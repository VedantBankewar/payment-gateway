package com.ecommerce.payment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private String orderId;
    private String razorpayOrderId;
    private List<CartItem> items;
    private Integer totalAmount; // In paise
    private String status; // PENDING, PAID, FAILED, CANCELLED

    // Customer Details
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String city;
    private String pincode;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
