package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.request.LoginRequest;
import com.ecommerce.auth.dto.request.RegisterRequest;
import com.ecommerce.auth.dto.response.JwtResponse;

public interface AuthService {
    JwtResponse register(RegisterRequest request);

    JwtResponse login(LoginRequest request);
}
