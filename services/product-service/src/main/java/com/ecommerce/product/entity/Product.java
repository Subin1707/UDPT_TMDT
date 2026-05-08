package com.ecommerce.product.entity;

import java.math.BigDecimal;

public record Product(Long id, String name, BigDecimal price, Integer stock) {
}
