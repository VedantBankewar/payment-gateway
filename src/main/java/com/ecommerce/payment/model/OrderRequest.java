package com.ecommerce.payment.model;

import lombok.Data;

@Data
public class OrderRequest {
    private Integer amount; // Amount in paise (e.g., 50000 for ₹500)
    private String currency; // Currency code (e.g., INR)
    private String receipt; // Unique receipt ID
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}
