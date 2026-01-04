package com.ecommerce.payment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private String orderId;
    private Integer amount;
    private String currency;
    private String key; // Razorpay Key ID for frontend
    private String receipt;
    private String status;
}
