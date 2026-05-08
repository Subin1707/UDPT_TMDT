package com.ecommerce.product.controller;

import com.ecommerce.product.seed.ProductSeeder;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @GetMapping
    public ApiResponse<List<String>> findAll() {
        return ApiResponse.ok("Categories", ProductSeeder.findAllCategories());
    }
}
