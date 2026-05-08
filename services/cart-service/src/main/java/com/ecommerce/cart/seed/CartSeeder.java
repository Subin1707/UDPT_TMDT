package com.ecommerce.cart.seed;

import com.ecommerce.cart.dto.CartItemRequest;
import com.ecommerce.cart.entity.CartItem;

import java.util.ArrayList;
import java.util.List;

public class CartSeeder {
    private static final List<CartItem> ITEMS = new ArrayList<>(List.of(
            new CartItem(1L, "Wireless Keyboard", 1, 390000),
            new CartItem(2L, "USB-C Hub", 2, 550000),
            new CartItem(5L, "Smart LED Lamp", 1, 690000)
    ));

    public static List<CartItem> getItems() {
        return List.copyOf(ITEMS);
    }

    public static CartItem addItem(CartItemRequest request) {
        CartItem newItem = new CartItem(request.productId(), "Product " + request.productId(), request.quantity(), 0);
        ITEMS.add(newItem);
        return newItem;
    }
}
