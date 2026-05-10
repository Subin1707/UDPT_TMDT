package com.ecommerce.user.controller;

import com.ecommerce.shared.response.ApiResponse;
import com.ecommerce.user.entity.UserProfile;
import com.ecommerce.user.seed.UserSeeder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @GetMapping
    public ApiResponse<List<UserProfile>> findAll() {
        return ApiResponse.ok("User list", UserSeeder.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<UserProfile> findById(@PathVariable Long id) {
        return ApiResponse.ok("User profile", UserSeeder.findById(id));
    }
}
