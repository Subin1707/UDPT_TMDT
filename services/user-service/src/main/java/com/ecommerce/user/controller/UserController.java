package com.ecommerce.user.controller;

import com.ecommerce.shared.response.ApiResponse;
import com.ecommerce.user.entity.UserProfile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping("/{id}")
    public ApiResponse<UserProfile> findById(@PathVariable Long id) {
        return ApiResponse.ok("User profile", new UserProfile(id, "Demo User", "demo@example.com"));
    }
}
