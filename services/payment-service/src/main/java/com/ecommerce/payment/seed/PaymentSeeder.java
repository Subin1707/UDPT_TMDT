package com.ecommerce.payment.seed;

import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.entity.PaymentStatus;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PaymentSeeder {
    private static final List<Payment> PAYMENTS = new ArrayList<>();

    static {
        Payment p1 = new Payment();
        p1.setId(201L);
        p1.setOrderId(101L);
        p1.setAmount(BigDecimal.valueOf(250000));
        p1.setStatus(PaymentStatus.COMPLETED);
        PAYMENTS.add(p1);

        Payment p2 = new Payment();
        p2.setId(202L);
        p2.setOrderId(102L);
        p2.setAmount(BigDecimal.valueOf(1290000));
        p2.setStatus(PaymentStatus.COMPLETED);
        PAYMENTS.add(p2);

        Payment p3 = new Payment();
        p3.setId(203L);
        p3.setOrderId(103L);
        p3.setAmount(BigDecimal.valueOf(650000));
        p3.setStatus(PaymentStatus.PENDING);
        PAYMENTS.add(p3);
    }

    public static List<Payment> findAll() {
        return PAYMENTS;
    }

    public static Payment findByOrderId(Long orderId) {
        return PAYMENTS.stream()
                .filter(payment -> payment.getOrderId().equals(orderId))
                .findFirst()
                .orElse(null);
    }
}
