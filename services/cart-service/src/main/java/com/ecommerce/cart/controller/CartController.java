package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.CartItemRequest;
import com.ecommerce.cart.entity.CartItem;
import com.ecommerce.cart.service.CartService;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // =========================================================
    // GET ALL CART ITEMS
    // =========================================================
    @GetMapping("/items")
    public ApiResponse<List<CartItem>> getItems() {

        return ApiResponse.ok(
                "Cart items fetched successfully",
                cartService.getItems()
        );
    }

    // =========================================================
    // ADD ITEM TO CART
    // =========================================================
    @PostMapping("/items")
    public ApiResponse<CartItem> addItem(
            @RequestBody CartItemRequest request
    ) {

        CartItem item = cartService.addItem(request);

        return ApiResponse.ok(
                "Item added to cart successfully",
                item
        );
    }

    // =========================================================
    // UPDATE QUANTITY
    // =========================================================
    @PutMapping("/items/{productId}")
    public ApiResponse<CartItem> updateItem(
            @PathVariable Long productId,
            @RequestBody CartItemRequest request
    ) {

        CartItem updatedItem = cartService.updateQuantity(
                productId,
                request.quantity()
        );

        return ApiResponse.ok(
                "Cart item updated successfully",
                updatedItem
        );
    }

    // =========================================================
    // OPTIONAL POST UPDATE
    // =========================================================
    @PostMapping("/items/{productId}/quantity")
    public ApiResponse<CartItem> updateItemByPost(
            @PathVariable Long productId,
            @RequestBody CartItemRequest request
    ) {

        CartItem updatedItem = cartService.updateQuantity(
                productId,
                request.quantity()
        );

        return ApiResponse.ok(
                "Cart item updated successfully",
                updatedItem
        );
    }

    // =========================================================
    // REMOVE SINGLE ITEM
    // =========================================================
    @DeleteMapping("/items/{productId}")
    public ApiResponse<List<CartItem>> removeItem(
            @PathVariable Long productId
    ) {

        List<CartItem> items = cartService.removeItem(productId);

        return ApiResponse.ok(
                "Item removed from cart successfully",
                items
        );
    }

    // =========================================================
    // OPTIONAL POST REMOVE
    // =========================================================
    @PostMapping("/items/{productId}/remove")
    public ApiResponse<List<CartItem>> removeItemByPost(
            @PathVariable Long productId
    ) {

        List<CartItem> items = cartService.removeItem(productId);

        return ApiResponse.ok(
                "Item removed from cart successfully",
                items
        );
    }

    // =========================================================
    // CLEAR ENTIRE CART
    // =========================================================
    @DeleteMapping("/items")
    public ApiResponse<List<CartItem>> clearCart() {

        List<CartItem> items = cartService.clearCart();

        return ApiResponse.ok(
                "Cart cleared successfully",
                items
        );
    }
}