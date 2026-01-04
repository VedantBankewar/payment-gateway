package com.ecommerce.payment.controller;

import com.ecommerce.payment.model.OrderRequest;
import com.ecommerce.payment.model.OrderResponse;
import com.ecommerce.payment.model.PaymentResponse;
import com.ecommerce.payment.model.PaymentVerificationRequest;
import com.ecommerce.payment.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;
    private final com.ecommerce.payment.service.OrderService orderService;
    private final com.ecommerce.payment.service.BillingService billingService;

    public PaymentController(PaymentService paymentService,
            com.ecommerce.payment.service.OrderService orderService,
            com.ecommerce.payment.service.BillingService billingService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.billingService = billingService;
    }

    /**
     * Creates a new Razorpay order
     * POST /api/payment/create-order
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            // Validate required fields
            if (orderRequest.getAmount() == null || orderRequest.getAmount() <= 0) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Amount is required and must be greater than 0");
                return ResponseEntity.badRequest().body(error);
            }

            if (orderRequest.getReceipt() == null || orderRequest.getReceipt().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Receipt ID is required");
                return ResponseEntity.badRequest().body(error);
            }

            OrderResponse response = paymentService.createOrder(orderRequest);
            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Verifies payment signature
     * POST /api/payment/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(
            @RequestBody PaymentVerificationRequest request) {

        // Validate required fields
        if (request.getRazorpay_order_id() == null ||
                request.getRazorpay_payment_id() == null ||
                request.getRazorpay_signature() == null) {

            return ResponseEntity.badRequest().body(
                    new PaymentResponse(false, "Missing required payment verification fields", null, null));
        }

        PaymentResponse response = paymentService.verifyPayment(request);

        if (response.isSuccess()) {
            // Update local order status and create billing record
            com.ecommerce.payment.model.Order order = orderService
                    .findByRazorpayOrderId(request.getRazorpay_order_id());

            if (order != null) {
                orderService.updateOrderStatus(order.getOrderId(), "PAID");
                billingService.createBillingRecord(order, request.getRazorpay_payment_id(), "SUCCESS", "ONLINE");

                // Add local order ID to response
                response.setOrderId(order.getOrderId());
            }
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Payment Gateway");
        return ResponseEntity.ok(status);
    }
}
