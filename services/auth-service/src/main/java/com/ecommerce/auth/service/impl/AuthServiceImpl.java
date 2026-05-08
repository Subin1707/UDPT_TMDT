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
        UserRole role = request.role() == null ? UserRole.USER : request.role();
        return new JwtResponse(jwtProvider.generateToken(request.email(), role), "Bearer", request.email(), role);
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        UserRole role = resolveRoleForDemoAccount(request.email(), request.password());
        return new JwtResponse(jwtProvider.generateToken(request.email(), role), "Bearer", request.email(), role);
    }

    private UserRole resolveRoleForDemoAccount(String email, String password) {
        if (email == null) {
            return UserRole.USER;
        }
        if (email.equalsIgnoreCase(defaultAdminEmail) && password != null && password.equals(defaultAdminPassword)) {
            return UserRole.ADMIN;
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
