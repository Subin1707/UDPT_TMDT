package com.ecommerce.analytics.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationService {
    public List<String> recommendForUser(Long userId) {
        return List.of("Wireless Keyboard", "USB-C Hub");
    }
}
