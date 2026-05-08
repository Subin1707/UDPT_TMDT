package com.ecommerce.product.controller;

import com.ecommerce.product.entity.Product;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @GetMapping
    public ApiResponse<List<Product>> findAll() {
        return ApiResponse.ok("Products", List.of(
                new Product(1L, "Wireless Keyboard", BigDecimal.valueOf(390000), 25),
                new Product(2L, "USB-C Hub", BigDecimal.valueOf(550000), 12)
        ));
    }
}
