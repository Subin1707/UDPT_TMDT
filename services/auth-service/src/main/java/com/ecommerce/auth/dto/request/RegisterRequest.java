package com.ecommerce.auth.dto.request;

import com.ecommerce.shared.constants.UserRole;

public record RegisterRequest(String fullName, String email, String password, UserRole role) {
}
