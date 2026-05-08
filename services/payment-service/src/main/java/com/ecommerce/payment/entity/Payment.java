package com.ecommerce.payment.entity;

import java.math.BigDecimal;

public record Payment(Long id, Long orderId, BigDecimal amount, PaymentStatus status) {
}
