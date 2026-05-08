package com.ecommerce.product.seed;

import com.ecommerce.product.entity.Product;

import java.math.BigDecimal;
import java.util.List;

public class ProductSeeder {
    private static final List<Product> PRODUCTS = List.of(
            new Product(1L, "Wireless Keyboard", BigDecimal.valueOf(390000), 25),
            new Product(2L, "USB-C Hub", BigDecimal.valueOf(550000), 12),
            new Product(3L, "Gaming Mouse", BigDecimal.valueOf(420000), 18),
            new Product(4L, "Noise Cancelling Headset", BigDecimal.valueOf(1190000), 8),
            new Product(5L, "Smart LED Lamp", BigDecimal.valueOf(690000), 15),
            new Product(6L, "Portable SSD 1TB", BigDecimal.valueOf(1790000), 7),
            new Product(7L, "Ergonomic Chair", BigDecimal.valueOf(2590000), 5),
            new Product(8L, "4K Monitor", BigDecimal.valueOf(6490000), 6)
    );

    private static final List<String> CATEGORIES = List.of(
            "Electronics",
            "Gaming",
            "Smart Home",
            "Office",
            "Accessories",
            "Audio"
    );

    public static List<Product> findAll() {
        return PRODUCTS;
    }

    public static Product findById(Long id) {
        return PRODUCTS.stream()
                .filter(product -> product.id().equals(id))
                .findFirst()
                .orElse(null);
    }

    public static List<String> findAllCategories() {
        return CATEGORIES;
    }

    public static int getStock(Long productId) {
        return PRODUCTS.stream()
                .filter(product -> product.id().equals(productId))
                .findFirst()
                .map(Product::stock)
                .orElse(0);
    }
}
