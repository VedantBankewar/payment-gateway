package com.ecommerce.payment.controller;

import com.ecommerce.payment.model.AddToCartRequest;
import com.ecommerce.payment.model.Cart;
import com.ecommerce.payment.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<Cart> getCart(@PathVariable String sessionId) {
        return ResponseEntity.ok(cartService.getCart(sessionId));
    }

    @PostMapping("/{sessionId}/add")
    public ResponseEntity<?> addToCart(@PathVariable String sessionId,
            @RequestBody AddToCartRequest request) {
        try {
            Cart cart = cartService.addToCart(sessionId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{sessionId}/update")
    public ResponseEntity<Cart> updateQuantity(@PathVariable String sessionId,
            @RequestBody AddToCartRequest request) {
        Cart cart = cartService.updateQuantity(sessionId, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{sessionId}/remove/{productId}")
    public ResponseEntity<Cart> removeFromCart(@PathVariable String sessionId,
            @PathVariable Long productId) {
        Cart cart = cartService.removeFromCart(sessionId, productId);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/{sessionId}/clear")
    public ResponseEntity<Map<String, String>> clearCart(@PathVariable String sessionId) {
        cartService.clearCart(sessionId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cart cleared successfully");
        return ResponseEntity.ok(response);
    }
}
