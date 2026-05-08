package com.ecommerce.payment.seed;

import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.entity.PaymentStatus;

import java.math.BigDecimal;
import java.util.List;

public class PaymentSeeder {
    private static final List<Payment> PAYMENTS = List.of(
            new Payment(201L, 101L, BigDecimal.valueOf(250000), PaymentStatus.SUCCESS),
            new Payment(202L, 102L, BigDecimal.valueOf(1290000), PaymentStatus.SUCCESS),
            new Payment(203L, 103L, BigDecimal.valueOf(650000), PaymentStatus.PENDING)
    );

    public static List<Payment> findAll() {
        return PAYMENTS;
    }

    public static Payment findByOrderId(Long orderId) {
        return PAYMENTS.stream()
                .filter(payment -> payment.orderId().equals(orderId))
                .findFirst()
                .orElse(null);
    }
}
