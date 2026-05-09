package com.ecommerce.product.seed;

import com.ecommerce.product.entity.Product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class ProductSeeder {
    private static final List<Product> PRODUCTS = new ArrayList<>();

    static {
        Product p1 = new Product(1L, "Wireless Keyboard", BigDecimal.valueOf(390000), 25);
        p1.setStatus(com.ecommerce.product.entity.ProductStatus.ACTIVE);
        p1.setSlug("wireless-keyboard");
        p1.setThumbnailUrl("https://via.placeholder.com/300?text=Wireless+Keyboard");
        p1.setSoldCount(150);
        p1.setAverageRating(4.5);
        PRODUCTS.add(p1);

        Product p2 = new Product(2L, "USB-C Hub", BigDecimal.valueOf(550000), 12);
        p2.setStatus(com.ecommerce.product.entity.ProductStatus.ACTIVE);
        p2.setSlug("usb-c-hub");
        p2.setThumbnailUrl("https://via.placeholder.com/300?text=USB-C+Hub");
        p2.setSoldCount(89);
        p2.setAverageRating(4.2);
        PRODUCTS.add(p2);

        Product p3 = new Product(3L, "Gaming Mouse", BigDecimal.valueOf(420000), 18);
        p3.setStatus(com.ecommerce.product.entity.ProductStatus.ACTIVE);
        p3.setSlug("gaming-mouse");
        p3.setThumbnailUrl("https://via.placeholder.com/300?text=Gaming+Mouse");
        p3.setSoldCount(203);
        p3.setAverageRating(4.7);
        PRODUCTS.add(p3);

        Product p4 = new Product(4L, "Noise Cancelling Headset", BigDecimal.valueOf(1190000), 8);
        p4.setStatus(com.ecommerce.product.entity.ProductStatus.ACTIVE);
        p4.setSlug("noise-cancelling-headset");
        p4.setThumbnailUrl("https://via.placeholder.com/300?text=Headset");
        p4.setSoldCount(67);
        p4.setAverageRating(4.6);
        PRODUCTS.add(p4);

        Product p5 = new Product(5L, "Smart LED Lamp", BigDecimal.valueOf(690000), 15);
        p5.setStatus(com.ecommerce.product.entity.ProductStatus.ACTIVE);
        p5.setSlug("smart-led-lamp");
        p5.setThumbnailUrl("https://via.placeholder.com/300?text=LED+Lamp");
        p5.setSoldCount(112);
        p5.setAverageRating(4.3);
        PRODUCTS.add(p5);

        Product p6 = new Product(6L, "Portable SSD 1TB", BigDecimal.valueOf(1790000), 7);
        p6.setStatus(com.ecommerce.product.entity.ProductStatus.ACTIVE);
        p6.setSlug("portable-ssd-1tb");
        p6.setThumbnailUrl("https://via.placeholder.com/300?text=SSD+1TB");
        p6.setSoldCount(45);
        p6.setAverageRating(4.8);
        PRODUCTS.add(p6);

        Product p7 = new Product(7L, "Ergonomic Chair", BigDecimal.valueOf(2590000), 5);
        p7.setStatus(com.ecommerce.product.entity.ProductStatus.ACTIVE);
        p7.setSlug("ergonomic-chair");
        p7.setThumbnailUrl("https://via.placeholder.com/300?text=Ergonomic+Chair");
        p7.setSoldCount(28);
        p7.setAverageRating(4.4);
        PRODUCTS.add(p7);

        Product p8 = new Product(8L, "4K Monitor", BigDecimal.valueOf(6490000), 6);
        p8.setStatus(com.ecommerce.product.entity.ProductStatus.ACTIVE);
        p8.setSlug("4k-monitor");
        p8.setThumbnailUrl("https://via.placeholder.com/300?text=4K+Monitor");
        p8.setSoldCount(34);
        p8.setAverageRating(4.6);
        PRODUCTS.add(p8);
    }

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
                .filter(product -> product.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public static List<String> findAllCategories() {
        return CATEGORIES;
    }

    public static int getStock(Long productId) {
        return PRODUCTS.stream()
                .filter(product -> product.getId().equals(productId))
                .findFirst()
                .map(Product::getSoldCount)
                .orElse(0);
    }
}
