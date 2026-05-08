package com.ecommerce.notification.seed;

import com.ecommerce.notification.dto.NotificationRequest;

import java.util.ArrayList;
import java.util.List;

public class NotificationSeeder {
    private static final List<NotificationRequest> NOTIFICATIONS = new ArrayList<>(List.of(
            new NotificationRequest(2L, "Your order #101 has been confirmed."),
            new NotificationRequest(2L, "Your package is now shipping."),
            new NotificationRequest(3L, "Your delivery is on the way.")
    ));

    public static List<NotificationRequest> findByUserId(Long userId) {
        return NOTIFICATIONS.stream()
                .filter(notification -> notification.userId().equals(userId))
                .toList();
    }

    public static NotificationRequest addNotification(NotificationRequest request) {
        NOTIFICATIONS.add(request);
        return request;
    }
}
