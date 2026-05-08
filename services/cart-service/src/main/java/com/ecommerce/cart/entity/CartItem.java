package com.ecommerce.cart.entity;

public record CartItem(Long productId, String name, Integer quantity, Integer unitPrice) {
}
