package com.ecommerce.order.entity;

import com.ecommerce.shared.constants.OrderStatus;

import java.time.Instant;

public record Order(Long id, Long userId, OrderStatus status, Instant createdAt) {
}
