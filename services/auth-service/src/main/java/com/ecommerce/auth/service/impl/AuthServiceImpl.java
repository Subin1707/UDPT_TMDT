package com.ecommerce.auth.service.impl;

import com.ecommerce.auth.dto.request.LoginRequest;
import com.ecommerce.auth.dto.request.RegisterRequest;
import com.ecommerce.auth.dto.response.JwtResponse;
import com.ecommerce.auth.service.AuthService;
import com.ecommerce.auth.security.jwt.JwtProvider;
import com.ecommerce.shared.constants.UserRole;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final JwtProvider jwtProvider;

    public AuthServiceImpl(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    public JwtResponse register(RegisterRequest request) {
        UserRole role = request.role() == null ? UserRole.USER : request.role();
        return new JwtResponse(jwtProvider.generateToken(request.email(), role), "Bearer", request.email(), role);
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        UserRole role = resolveRoleForDemoAccount(request.email());
        return new JwtResponse(jwtProvider.generateToken(request.email(), role), "Bearer", request.email(), role);
    }

    private UserRole resolveRoleForDemoAccount(String email) {
        if (email == null) {
            return UserRole.USER;
        }
        if (email.startsWith("admin@")) {
            return UserRole.ADMIN;
        }
        if (email.startsWith("staff@")) {
            return UserRole.STAFF;
        }
        return UserRole.USER;
    }
}
