package com.ecommerce.payment.service;

import com.ecommerce.payment.model.Product;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;

@Service
public class ProductService {

    private final Map<Long, Product> products = new HashMap<>();

    @PostConstruct
    public void initProducts() {
        // Pre-load sample products
        products.put(1L, new Product(1L, "Premium Wireless Earbuds",
                "High-quality wireless earbuds with noise cancellation and 24-hour battery life",
                399900, "🎧", "Electronics"));

        products.put(2L, new Product(2L, "Smart Fitness Band",
                "Track your health with heart rate monitor, sleep tracking, and 7-day battery",
                149900, "⌚", "Wearables"));

        products.put(3L, new Product(3L, "Aluminum Laptop Stand",
                "Ergonomic laptop stand with adjustable height and cooling ventilation",
                249900, "💻", "Accessories"));

        products.put(4L, new Product(4L, "Mechanical Gaming Keyboard",
                "RGB backlit mechanical keyboard with blue switches and macro keys",
                499900, "⌨️", "Gaming"));

        products.put(5L, new Product(5L, "USB-C Hub 7-in-1",
                "Multi-port adapter with HDMI, USB 3.0, SD card reader, and PD charging",
                199900, "🔌", "Accessories"));

        products.put(6L, new Product(6L, "Portable Bluetooth Speaker",
                "Waterproof speaker with 360° sound and 12-hour playtime",
                299900, "🔊", "Audio"));
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(products.values());
    }

    public Optional<Product> getProductById(Long id) {
        return Optional.ofNullable(products.get(id));
    }

    public List<Product> getProductsByCategory(String category) {
        return products.values().stream()
                .filter(p -> p.getCategory().equalsIgnoreCase(category))
                .toList();
    }
}
