package com.ecommerce.order.dto;

import java.util.List;

public record CreateOrderRequest(Long userId, List<OrderItemRequest> items) {
}
