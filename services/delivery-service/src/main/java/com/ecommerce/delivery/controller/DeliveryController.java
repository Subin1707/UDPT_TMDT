package com.ecommerce.delivery.controller;

import com.ecommerce.delivery.entity.Delivery;
import com.ecommerce.delivery.seed.DeliverySeeder;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {
    @GetMapping("/{orderId}")
    public ApiResponse<Delivery> track(@PathVariable Long orderId) {
        return ApiResponse.ok("Delivery tracking", DeliverySeeder.findByOrderId(orderId));
    }
}
