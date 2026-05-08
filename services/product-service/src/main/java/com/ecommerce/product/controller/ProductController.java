package com.ecommerce.product.controller;

import com.ecommerce.product.entity.Product;
import com.ecommerce.product.seed.ProductSeeder;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @GetMapping
    public ApiResponse<List<Product>> findAll() {
        return ApiResponse.ok("Products", ProductSeeder.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<Product> findById(@PathVariable Long id) {
        Product product = ProductSeeder.findById(id);
        if (product == null) {
            return ApiResponse.fail("Product not found");
        }
        return ApiResponse.ok("Product", product);
    }
}
