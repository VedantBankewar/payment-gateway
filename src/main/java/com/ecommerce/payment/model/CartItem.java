package com.ecommerce.payment.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    private Long productId;
    private String productName;
    private Integer price; // Price per unit in paise
    private Integer quantity;
    private String imageUrl;

    public Integer getTotalPrice() {
        return price * quantity;
    }
}
