package com.ecommerce.order.controller;

import com.ecommerce.order.dto.CreateOrderRequest;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.seed.OrderSeeder;
import com.ecommerce.shared.constants.OrderStatus;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @GetMapping
    public ApiResponse<List<Order>> getAll() {
        return ApiResponse.ok("Order list", OrderSeeder.findAll());
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getByUser(@PathVariable Long userId) {
        return ApiResponse.ok("Order list", OrderSeeder.findByUserId(userId));
    }

    @PostMapping
    public ApiResponse<Order> create(@RequestBody CreateOrderRequest request) {
        Long userId = request.userId() == null ? 2L : request.userId();
        Order order = new Order(System.currentTimeMillis(), userId, OrderStatus.PENDING, Instant.now());
        OrderSeeder.add(order);
        return ApiResponse.ok("Order created", order);
    }
}
