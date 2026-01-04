package com.ecommerce.payment.controller;

import com.ecommerce.payment.model.BillingRecord;
import com.ecommerce.payment.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "*")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/{email}")
    public ResponseEntity<List<BillingRecord>> getBillingHistory(@PathVariable String email) {
        List<BillingRecord> records = billingService.getBillingByEmail(email);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getBillingByOrderId(@PathVariable String orderId) {
        BillingRecord record = billingService.getBillingByOrderId(orderId);
        if (record == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(record);
    }
}
