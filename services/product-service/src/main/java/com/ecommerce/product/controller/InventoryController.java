package com.ecommerce.product.controller;

import com.ecommerce.product.seed.ProductSeeder;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inventory")
public class InventoryController {
    @GetMapping("/{productId}")
    public ApiResponse<Integer> stock(@PathVariable Long productId) {
        return ApiResponse.ok("Available stock", ProductSeeder.getStock(productId));
    }
}
