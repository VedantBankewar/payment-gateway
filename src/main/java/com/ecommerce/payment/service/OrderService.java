package com.ecommerce.payment.service;

import com.ecommerce.payment.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final Map<String, Order> orders = new HashMap<>();
    private final CartService cartService;

    public OrderService(CartService cartService) {
        this.cartService = cartService;
    }

    public Order createOrder(CreateOrderRequest request) {
        Cart cart = cartService.getCart(request.getSessionId());

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        String orderId = "ORD_" + System.currentTimeMillis();

        Order order = new Order();
        order.setOrderId(orderId);
        order.setItems(new ArrayList<>(cart.getItems()));
        order.setTotalAmount(cart.getTotalAmount());
        order.setStatus("PENDING");
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setCity(request.getCity());
        order.setPincode(request.getPincode());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        orders.put(orderId, order);

        return order;
    }

    public Order getOrderById(String orderId) {
        return orders.get(orderId);
    }

    public List<Order> getOrdersByEmail(String email) {
        return orders.values().stream()
                .filter(order -> order.getCustomerEmail().equalsIgnoreCase(email))
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Order updateOrderStatus(String orderId, String status) {
        Order order = orders.get(orderId);
        if (order != null) {
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now());
        }
        return order;
    }

    public Order updateRazorpayOrderId(String orderId, String razorpayOrderId) {
        Order order = orders.get(orderId);
        if (order != null) {
            order.setRazorpayOrderId(razorpayOrderId);
            order.setUpdatedAt(LocalDateTime.now());
        }
        return order;
    }

    public Order findByRazorpayOrderId(String razorpayOrderId) {
        return orders.values().stream()
                .filter(order -> razorpayOrderId.equals(order.getRazorpayOrderId()))
                .findFirst()
                .orElse(null);
    }
}
