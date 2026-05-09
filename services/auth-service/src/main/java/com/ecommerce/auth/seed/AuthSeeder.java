package com.ecommerce.auth.seed;

import com.ecommerce.auth.dto.request.LoginRequest;
import com.ecommerce.auth.dto.request.RegisterRequest;
import com.ecommerce.shared.constants.UserRole;

import java.util.List;

public class AuthSeeder {
    private static final List<LoginRequest> DEMO_ACCOUNTS = List.of(
            new LoginRequest("admin@ecommerce.com", "Admin@123"),
            new LoginRequest("staff@ecommerce.com", "Staff@123"),
            new LoginRequest("customer@example.com", "Customer@123")
    );

    public static List<LoginRequest> findDemoAccounts() {
        return DEMO_ACCOUNTS;
    }

    public static RegisterRequest defaultUser() {
        return new RegisterRequest("Demo User", "customer@example.com", "Customer@123", UserRole.USER);
    }
}
