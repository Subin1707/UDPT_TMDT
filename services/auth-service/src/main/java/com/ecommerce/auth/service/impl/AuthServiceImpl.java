package com.ecommerce.auth.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ecommerce.auth.dto.request.LoginRequest;
import com.ecommerce.auth.dto.request.RegisterRequest;
import com.ecommerce.auth.dto.response.JwtResponse;
import com.ecommerce.auth.security.jwt.JwtProvider;
import com.ecommerce.auth.service.AuthService;
import com.ecommerce.shared.constants.UserRole;

@Service
public class AuthServiceImpl implements AuthService {
    private final JwtProvider jwtProvider;
    private final String defaultAdminEmail;
    private final String defaultAdminPassword;

    public AuthServiceImpl(
            JwtProvider jwtProvider,
            @Value("${app.default-admin-email:admin@ecommerce.com}") String defaultAdminEmail,
            @Value("${app.default-admin-password:Admin@123}") String defaultAdminPassword
    ) {
        this.jwtProvider = jwtProvider;
        this.defaultAdminEmail = defaultAdminEmail;
        this.defaultAdminPassword = defaultAdminPassword;
    }

    @Override
    public JwtResponse register(RegisterRequest request) {
        UserRole role = request.role() == null ? UserRole.CUSTOMER : request.role();
        Long userId = generateUserIdFromEmail(request.email());
        return new JwtResponse(jwtProvider.generateToken(request.email(), role), "Bearer", request.email(), role, userId);
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        UserRole role = resolveRoleForDemoAccount(request.email(), request.password());
        Long userId = generateUserIdFromEmail(request.email());
        return new JwtResponse(jwtProvider.generateToken(request.email(), role), "Bearer", request.email(), role, userId);
    }

    private Long generateUserIdFromEmail(String email) {
        if (email == null) return 2L; // default to customer
        if (email.toLowerCase().contains("admin")) return 1L;
        if (email.toLowerCase().contains("staff")) return 3L;
        return 2L; // default to customer
    }

    private UserRole resolveRoleForDemoAccount(String email, String password) {
        if (email == null) {
            return UserRole.CUSTOMER;
        }
        if (email.equalsIgnoreCase(defaultAdminEmail) && password != null && password.equals(defaultAdminPassword)) {
            return UserRole.ADMIN;
        }
        if (email.startsWith("admin@")) {
            return UserRole.ADMIN;
        }
        if (email.startsWith("shipper@")) {
            return UserRole.SHIPPER;
        }
        return UserRole.CUSTOMER;
    }
}
