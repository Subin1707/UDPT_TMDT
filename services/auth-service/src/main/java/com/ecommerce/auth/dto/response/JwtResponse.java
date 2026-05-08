package com.ecommerce.auth.dto.response;

import com.ecommerce.shared.constants.UserRole;

public record JwtResponse(String accessToken, String tokenType, String email, UserRole role) {
}
