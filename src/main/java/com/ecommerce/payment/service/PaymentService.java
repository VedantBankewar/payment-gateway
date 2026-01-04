package com.ecommerce.payment.service;

import com.ecommerce.payment.model.OrderRequest;
import com.ecommerce.payment.model.OrderResponse;
import com.ecommerce.payment.model.PaymentResponse;
import com.ecommerce.payment.model.PaymentVerificationRequest;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final String razorpayKeyId;
    private final String razorpayKeySecret;

    public PaymentService(RazorpayClient razorpayClient,
            @Qualifier("razorpayKeyId") String razorpayKeyId,
            @Value("${razorpay.key.secret}") String razorpayKeySecret) {
        this.razorpayClient = razorpayClient;
        this.razorpayKeyId = razorpayKeyId;
        this.razorpayKeySecret = razorpayKeySecret;
    }

    /**
     * Creates a new Razorpay order
     */
    public OrderResponse createOrder(OrderRequest orderRequest) throws RazorpayException {
        JSONObject orderData = new JSONObject();
        orderData.put("amount", orderRequest.getAmount());
        orderData.put("currency", orderRequest.getCurrency() != null ? orderRequest.getCurrency() : "INR");
        orderData.put("receipt", orderRequest.getReceipt());

        // Add customer notes if provided
        if (orderRequest.getCustomerName() != null ||
                orderRequest.getCustomerEmail() != null) {
            JSONObject notes = new JSONObject();
            if (orderRequest.getCustomerName() != null) {
                notes.put("customer_name", orderRequest.getCustomerName());
            }
            if (orderRequest.getCustomerEmail() != null) {
                notes.put("customer_email", orderRequest.getCustomerEmail());
            }
            if (orderRequest.getCustomerPhone() != null) {
                notes.put("customer_phone", orderRequest.getCustomerPhone());
            }
            orderData.put("notes", notes);
        }

        Order order = razorpayClient.orders.create(orderData);

        OrderResponse response = new OrderResponse();
        response.setOrderId(order.get("id"));
        response.setAmount(order.get("amount"));
        response.setCurrency(order.get("currency"));
        response.setKey(razorpayKeyId);
        response.setReceipt(order.get("receipt"));
        response.setStatus(order.get("status"));

        return response;
    }

    /**
     * Verifies payment signature using HMAC SHA256
     */
    public PaymentResponse verifyPayment(PaymentVerificationRequest request) {
        try {
            // Create the signature verification payload
            String payload = request.getRazorpay_order_id() + "|" +
                    request.getRazorpay_payment_id();

            // Verify signature using Razorpay Utils
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.getRazorpay_order_id());
            options.put("razorpay_payment_id", request.getRazorpay_payment_id());
            options.put("razorpay_signature", request.getRazorpay_signature());

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            if (isValid) {
                return new PaymentResponse(
                        true,
                        "Payment verified successfully!",
                        request.getRazorpay_payment_id(),
                        request.getRazorpay_order_id());
            } else {
                return new PaymentResponse(
                        false,
                        "Payment verification failed - Invalid signature",
                        null,
                        request.getRazorpay_order_id());
            }
        } catch (RazorpayException e) {
            return new PaymentResponse(
                    false,
                    "Payment verification error: " + e.getMessage(),
                    null,
                    request.getRazorpay_order_id());
        }
    }
}
