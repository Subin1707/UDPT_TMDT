package com.ecommerce.payment.controller;

import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.entity.PaymentStatus;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @PostMapping
    public ApiResponse<Payment> pay(@RequestBody PaymentRequest request) {
        Payment payment = new Payment(System.currentTimeMillis(), request.orderId(), request.amount(), PaymentStatus.SUCCESS);
        return ApiResponse.ok("Payment simulated", payment);
    }
}
