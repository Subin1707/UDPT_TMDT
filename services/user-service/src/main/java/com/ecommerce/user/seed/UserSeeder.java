package com.ecommerce.user.seed;

import com.ecommerce.user.entity.UserProfile;

import java.util.List;

public class UserSeeder {
    private static final List<UserProfile> USERS = List.of(
            new UserProfile(1L, "Admin User", "admin@commerco.com"),
            new UserProfile(2L, "Demo Customer", "customer@example.com"),
            new UserProfile(3L, "Staff Member", "staff@commerco.com")
    );

    public static List<UserProfile> findAll() {
        return USERS;
    }

    public static UserProfile findById(Long id) {
        return USERS.stream()
                .filter(user -> user.id().equals(id))
                .findFirst()
                .orElse(USERS.get(1));
    }
}
