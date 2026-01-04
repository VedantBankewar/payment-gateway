package com.ecommerce.payment.service;

import com.ecommerce.payment.model.Cart;
import com.ecommerce.payment.model.CartItem;
import com.ecommerce.payment.model.Product;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CartService {

    private final Map<String, Cart> carts = new HashMap<>();
    private final ProductService productService;

    public CartService(ProductService productService) {
        this.productService = productService;
    }

    public Cart getCart(String sessionId) {
        return carts.computeIfAbsent(sessionId, id -> {
            Cart cart = new Cart();
            cart.setSessionId(id);
            cart.setItems(new ArrayList<>());
            return cart;
        });
    }

    public Cart addToCart(String sessionId, Long productId, Integer quantity) {
        Cart cart = getCart(sessionId);
        Optional<Product> productOpt = productService.getProductById(productId);

        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found: " + productId);
        }

        Product product = productOpt.get();

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // Update quantity
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            // Add new item
            CartItem newItem = new CartItem(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    quantity,
                    product.getImageUrl());
            cart.getItems().add(newItem);
        }

        return cart;
    }

    public Cart updateQuantity(String sessionId, Long productId, Integer quantity) {
        Cart cart = getCart(sessionId);

        if (quantity <= 0) {
            return removeFromCart(sessionId, productId);
        }

        cart.getItems().stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .ifPresent(item -> item.setQuantity(quantity));

        return cart;
    }

    public Cart removeFromCart(String sessionId, Long productId) {
        Cart cart = getCart(sessionId);
        cart.getItems().removeIf(item -> item.getProductId().equals(productId));
        return cart;
    }

    public void clearCart(String sessionId) {
        Cart cart = getCart(sessionId);
        cart.getItems().clear();
    }
}
