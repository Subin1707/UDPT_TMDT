package com.ecommerce.user.seed;

import com.ecommerce.user.entity.UserProfile;
import com.ecommerce.user.entity.UserStatus;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class UserSeeder {
    private static final List<UserProfile> USERS = new ArrayList<>();

    static {
        UserProfile u1 = new UserProfile(1L, "Admin User", "admin@commerco.com");
        u1.setPhone("0901234567");
        u1.setStatus(UserStatus.ACTIVE);
        u1.setAvatarUrl("https://via.placeholder.com/150?text=Admin");
        USERS.add(u1);

        UserProfile u2 = new UserProfile(2L, "Demo Customer", "customer@example.com");
        u2.setPhone("0912345678");
        u2.setStatus(UserStatus.ACTIVE);
        u2.setAvatarUrl("https://via.placeholder.com/150?text=Customer");
        USERS.add(u2);

        UserProfile u3 = new UserProfile(3L, "Shipper Member", "shipper@commerco.com");
        u3.setPhone("0923456789");
        u3.setStatus(UserStatus.ACTIVE);
        u3.setAvatarUrl("https://via.placeholder.com/150?text=Shipper");
        USERS.add(u3);
    }

    public static List<UserProfile> findAll() {
        return USERS;
    }

    public static UserProfile findById(Long id) {
        return USERS.stream()
                .filter(user -> user.getId().equals(id))
                .findFirst()
                .orElse(USERS.get(1));
    }
}
