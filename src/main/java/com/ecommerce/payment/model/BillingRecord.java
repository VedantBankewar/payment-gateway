package com.ecommerce.payment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillingRecord {
    private String transactionId;
    private String orderId;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private Integer amount; // In paise
    private String currency;
    private String status; // SUCCESS, FAILED, PENDING
    private String paymentMethod; // UPI, CARD, NETBANKING, WALLET
    private String customerEmail;
    private String customerName;
    private LocalDateTime timestamp;
}
