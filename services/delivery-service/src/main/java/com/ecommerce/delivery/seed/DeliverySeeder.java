package com.ecommerce.delivery.seed;

import com.ecommerce.delivery.entity.Delivery;
import com.ecommerce.delivery.entity.DeliveryStatus;

import java.util.List;

public class DeliverySeeder {
    private static final List<Delivery> DELIVERIES = List.of(
            new Delivery(101L, DeliveryStatus.PACKING, "Warehouse"),
            new Delivery(102L, DeliveryStatus.SHIPPING, "Distribution Center"),
            new Delivery(103L, DeliveryStatus.DELIVERED, "Customer Address")
    );

    public static Delivery findByOrderId(Long orderId) {
        return DELIVERIES.stream()
                .filter(delivery -> delivery.orderId().equals(orderId))
                .findFirst()
                .orElse(new Delivery(orderId, DeliveryStatus.FAILED, "Unknown"));
    }
}
