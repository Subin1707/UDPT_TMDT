package com.ecommerce.delivery.entity;

public record Delivery(Long orderId, DeliveryStatus status, String currentLocation) {
}
