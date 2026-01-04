package com.ecommerce.payment.controller;

import com.ecommerce.payment.model.CreateOrderRequest;
import com.ecommerce.payment.model.Order;
import com.ecommerce.payment.model.OrderRequest;
import com.ecommerce.payment.model.OrderResponse;
import com.ecommerce.payment.service.CartService;
import com.ecommerce.payment.service.OrderService;
import com.ecommerce.payment.service.PaymentService;
import com.razorpay.RazorpayException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;
    private final CartService cartService;

    public OrderController(OrderService orderService, PaymentService paymentService, CartService cartService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
        this.cartService = cartService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            // Validate required fields
            if (request.getSessionId() == null || request.getCustomerEmail() == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Session ID and email are required");
                return ResponseEntity.badRequest().body(error);
            }

            // 1. Create local order (status PENDING)
            Order order = orderService.createOrder(request);

            // 2. Create Razorpay order
            OrderRequest razorpayRequest = new OrderRequest();
            razorpayRequest.setAmount(order.getTotalAmount());
            razorpayRequest.setCurrency("INR");
            razorpayRequest.setReceipt(order.getOrderId());
            razorpayRequest.setCustomerName(order.getCustomerName());
            razorpayRequest.setCustomerEmail(order.getCustomerEmail());
            razorpayRequest.setCustomerPhone(order.getCustomerPhone());

            OrderResponse razorpayResponse = paymentService.createOrder(razorpayRequest);

            // 3. Link Razorpay order ID to local order
            orderService.updateRazorpayOrderId(order.getOrderId(), razorpayResponse.getOrderId());
            order.setRazorpayOrderId(razorpayResponse.getOrderId());

            // 4. Clear the cart
            cartService.clearCart(request.getSessionId());

            return ResponseEntity.ok(order);
        } catch (RazorpayException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Payment gateway error: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable String orderId) {
        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Order not found");
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/history/{email}")
    public ResponseEntity<List<Order>> getOrderHistory(@PathVariable String email) {
        List<Order> orders = orderService.getOrdersByEmail(email);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String orderId,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        Order order = orderService.updateOrderStatus(orderId, status);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(order);
    }
}
