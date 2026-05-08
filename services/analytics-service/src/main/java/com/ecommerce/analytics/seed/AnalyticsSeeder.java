package com.ecommerce.analytics.seed;

import java.util.List;
import java.util.Map;

public class AnalyticsSeeder {
    public static Map<String, Object> dashboardSummary() {
        return Map.of(
                "revenue", 12500000,
                "orders", 42,
                "conversionRate", 3.8,
                "activeUsers", 320,
                "monthlyGrowth", 12.5
        );
    }

    public static List<String> recommendForUser(Long userId) {
        return List.of("Wireless Keyboard", "USB-C Hub", "Portable SSD 1TB");
    }
}
