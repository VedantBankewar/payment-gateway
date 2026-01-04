package com.ecommerce.payment.service;

import com.ecommerce.payment.model.BillingRecord;
import com.ecommerce.payment.model.Order;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BillingService {

    private final Map<String, BillingRecord> billingRecords = new HashMap<>();

    public BillingRecord createBillingRecord(Order order, String razorpayPaymentId,
            String status, String paymentMethod) {
        String transactionId = "TXN_" + System.currentTimeMillis();

        BillingRecord record = new BillingRecord();
        record.setTransactionId(transactionId);
        record.setOrderId(order.getOrderId());
        record.setRazorpayPaymentId(razorpayPaymentId);
        record.setRazorpayOrderId(order.getRazorpayOrderId());
        record.setAmount(order.getTotalAmount());
        record.setCurrency("INR");
        record.setStatus(status);
        record.setPaymentMethod(paymentMethod != null ? paymentMethod : "UNKNOWN");
        record.setCustomerEmail(order.getCustomerEmail());
        record.setCustomerName(order.getCustomerName());
        record.setTimestamp(LocalDateTime.now());

        billingRecords.put(transactionId, record);

        return record;
    }

    public List<BillingRecord> getBillingByEmail(String email) {
        return billingRecords.values().stream()
                .filter(record -> record.getCustomerEmail().equalsIgnoreCase(email))
                .sorted((r1, r2) -> r2.getTimestamp().compareTo(r1.getTimestamp()))
                .collect(Collectors.toList());
    }

    public BillingRecord getBillingByOrderId(String orderId) {
        return billingRecords.values().stream()
                .filter(record -> record.getOrderId().equals(orderId))
                .findFirst()
                .orElse(null);
    }

    public List<BillingRecord> getAllBillingRecords() {
        return new ArrayList<>(billingRecords.values());
    }
}
