package com.ecommerce.order.seed;

import com.ecommerce.order.entity.Order;
import com.ecommerce.shared.constants.OrderStatus;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderSeeder {
    private static final List<Order> ORDERS = new ArrayList<>(List.of(
            new Order(101L, 2L, OrderStatus.CREATED, Instant.now().minusSeconds(3600)),
            new Order(102L, 2L, OrderStatus.SHIPPING, Instant.now().minusSeconds(7200)),
            new Order(103L, 3L, OrderStatus.COMPLETED, Instant.now().minusSeconds(10800))
    ));

    public static List<Order> findAll() {
        return List.copyOf(ORDERS);
    }

    public static List<Order> findByUserId(Long userId) {
        return ORDERS.stream()
                .filter(order -> order.userId().equals(userId))
                .collect(Collectors.toList());
    }

    public static Order add(Order order) {
        ORDERS.add(order);
        return order;
    }
}
