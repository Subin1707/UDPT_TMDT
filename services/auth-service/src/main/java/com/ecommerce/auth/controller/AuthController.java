package com.ecommerce.auth.controller;

import com.ecommerce.auth.dto.request.LoginRequest;
import com.ecommerce.auth.dto.request.RegisterRequest;
import com.ecommerce.auth.dto.response.JwtResponse;
import com.ecommerce.auth.seed.AuthSeeder;
import com.ecommerce.auth.service.AuthService;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/demo-accounts")
    public ApiResponse<List<LoginRequest>> demoAccounts() {
        return ApiResponse.ok("Demo accounts", AuthSeeder.findDemoAccounts());
    }

    @PostMapping("/register")
    public ApiResponse<JwtResponse> register(@RequestBody RegisterRequest request) {
        return ApiResponse.ok("Register success", authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<JwtResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.ok("Login success", authService.login(request));
    }
}
