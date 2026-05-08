package com.ecommerce.analytics.controller;

import com.ecommerce.analytics.seed.AnalyticsSeeder;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> dashboard() {
        return ApiResponse.ok("Dashboard summary", AnalyticsSeeder.dashboardSummary());
    }

    @GetMapping("/recommendations/{userId}")
    public ApiResponse<List<String>> recommendations(@PathVariable Long userId) {
        return ApiResponse.ok("Recommendations", AnalyticsSeeder.recommendForUser(userId));
    }
}
