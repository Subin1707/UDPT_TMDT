package com.ecommerce.gateway.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        return """
                <!doctype html>
                <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Ecommerce API Gateway</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #1f2937; }
                        h1 { margin-bottom: 8px; }
                        ul { padding-left: 20px; }
                        a { color: #2563eb; text-decoration: none; }
                        a:hover { text-decoration: underline; }
                        code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; }
                    </style>
                </head>
                <body>
                    <h1>Ecommerce Distributed System</h1>
                    <p>API Gateway is running on <code>localhost:8080</code>.</p>
                    <h2>Quick Links</h2>
                    <ul>
                        <li><a href="/api/products">Products</a> - requires product-service on port 8083</li>
                        <li><a href="/api/categories">Categories</a> - requires product-service on port 8083</li>
                        <li><a href="/api/analytics/dashboard">Analytics Dashboard</a> - requires analytics-service on port 8089</li>
                        <li><a href="/actuator/health">Gateway Health</a></li>
                    </ul>
                </body>
                </html>
                """;
    }
}
