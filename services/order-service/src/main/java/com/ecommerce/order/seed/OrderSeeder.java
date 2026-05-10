package com.ecommerce.order.seed;

import com.ecommerce.order.entity.Order;
import com.ecommerce.shared.constants.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderSeeder {
    private static final List<Order> ORDERS = new ArrayList<>();

    static {
        Order o1 = new Order();
        o1.setId(101L);
        o1.setUserId(2L);
        o1.setOrderCode("ORD-001");
        o1.setStatus(OrderStatus.PENDING);
        o1.setTotalAmount(BigDecimal.valueOf(250000));
        o1.setFinalAmount(BigDecimal.valueOf(250000));
        o1.setCreatedAt(Instant.now().minusSeconds(3600));
        o1.setUpdatedAt(Instant.now().minusSeconds(3600));
        ORDERS.add(o1);

        Order o2 = new Order();
        o2.setId(102L);
        o2.setUserId(2L);
        o2.setOrderCode("ORD-002");
        o2.setStatus(OrderStatus.SHIPPING);
        o2.setTotalAmount(BigDecimal.valueOf(1290000));
        o2.setFinalAmount(BigDecimal.valueOf(1290000));
        o2.setCreatedAt(Instant.now().minusSeconds(7200));
        o2.setUpdatedAt(Instant.now().minusSeconds(7200));
        ORDERS.add(o2);

        Order o3 = new Order();
        o3.setId(103L);
        o3.setUserId(3L);
        o3.setOrderCode("ORD-003");
        o3.setStatus(OrderStatus.DELIVERED);
        o3.setTotalAmount(BigDecimal.valueOf(650000));
        o3.setFinalAmount(BigDecimal.valueOf(650000));
        o3.setCreatedAt(Instant.now().minusSeconds(10800));
        o3.setUpdatedAt(Instant.now().minusSeconds(10800));
        ORDERS.add(o3);
    }

    public static List<Order> findAll() {
        return List.copyOf(ORDERS);
    }

    public static List<Order> findByUserId(Long userId) {
        return ORDERS.stream()
                .filter(order -> order.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public static Order add(Order order) {
        ORDERS.add(order);
        return order;
    }
}
