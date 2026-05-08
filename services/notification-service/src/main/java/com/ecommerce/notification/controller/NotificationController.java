package com.ecommerce.notification.controller;

import com.ecommerce.notification.dto.NotificationRequest;
import com.ecommerce.notification.websocket.NotificationSocketHandler;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationSocketHandler socketHandler;

    public NotificationController(NotificationSocketHandler socketHandler) {
        this.socketHandler = socketHandler;
    }

    @PostMapping
    public ApiResponse<NotificationRequest> send(@RequestBody NotificationRequest request) {
        socketHandler.broadcast(request.message());
        return ApiResponse.ok("Notification sent", request);
    }
}
