package com.ecommerce.payment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cart {
    private String sessionId;
    private List<CartItem> items = new ArrayList<>();

    public Integer getTotalAmount() {
        return items.stream()
                .mapToInt(CartItem::getTotalPrice)
                .sum();
    }

    public Integer getTotalItems() {
        return items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
}
