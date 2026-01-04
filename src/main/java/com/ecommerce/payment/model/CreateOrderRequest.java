package com.ecommerce.payment.model;

import lombok.Data;

@Data
public class CreateOrderRequest {
    private String sessionId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String city;
    private String pincode;
}
