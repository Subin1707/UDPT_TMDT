package com.ecommerce.notification.controller;

import com.ecommerce.notification.dto.NotificationRequest;
import com.ecommerce.notification.seed.NotificationSeeder;
import com.ecommerce.notification.websocket.NotificationSocketHandler;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationSocketHandler socketHandler;

    public NotificationController(NotificationSocketHandler socketHandler) {
        this.socketHandler = socketHandler;
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<NotificationRequest>> findByUser(@PathVariable Long userId) {
        return ApiResponse.ok("Notifications", NotificationSeeder.findByUserId(userId));
    }

    @PostMapping
    public ApiResponse<NotificationRequest> send(@RequestBody NotificationRequest request) {
        socketHandler.broadcast(request.message());
        NotificationSeeder.addNotification(request);
        return ApiResponse.ok("Notification sent", request);
    }
}
