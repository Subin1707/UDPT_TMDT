package com.ecommerce.order.controller;

import com.ecommerce.order.dto.CreateOrderRequest;
import com.ecommerce.order.entity.Order;
import com.ecommerce.shared.constants.OrderStatus;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping
    public ApiResponse<Order> create(@RequestBody CreateOrderRequest request) {
        Order order = new Order(System.currentTimeMillis(), request.userId(), OrderStatus.CREATED, Instant.now());
        return ApiResponse.ok("Order created", order);
    }
}
