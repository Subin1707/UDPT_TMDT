package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.CartItemRequest;
import com.ecommerce.cart.entity.CartItem;
import com.ecommerce.cart.seed.CartSeeder;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @GetMapping("/items")
    public ApiResponse<List<CartItem>> getItems() {
        return ApiResponse.ok("Cart items", CartSeeder.getItems());
    }

    @PostMapping("/items")
    public ApiResponse<CartItem> addItem(@RequestBody CartItemRequest request) {
        return ApiResponse.ok("Item added to cart", CartSeeder.addItem(request));
    }
}
