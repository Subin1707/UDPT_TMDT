package com.ecommerce.cart.controller;

import com.ecommerce.cart.dto.CartItemRequest;
import com.ecommerce.cart.entity.CartItem;
import com.ecommerce.cart.service.CartService;
import com.ecommerce.shared.response.ApiResponse;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
                "Cart items",
                cartService.getItems()
        );
    }

    // =========================================================
    // ADD ITEM TO CART
    // =========================================================
    @PostMapping("/items")
    public ApiResponse<?> addItem(
            @RequestBody CartItemRequest request
    ) {

        if ("UPDATE".equalsIgnoreCase(request.action())) {
            return ApiResponse.ok(
                    "Item quantity updated",
                    cartService.updateQuantity(
                            request.productId(),
                            request.quantity()
                    )
            );
        }

        if ("REMOVE".equalsIgnoreCase(request.action())) {
            return ApiResponse.ok(
                    "Item removed from cart",
                    cartService.removeItem(
                            request.productId()
                    )
            );
        }

        return ApiResponse.ok(
                "Item added to cart",
                cartService.addItem(request)
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

        return ApiResponse.ok(
                "Item quantity updated",
                cartService.updateQuantity(
                        productId,
                        request.quantity()
                )
        );
    }

    // OPTIONAL POST UPDATE
    @PostMapping("/items/{productId}/quantity")
    public ApiResponse<CartItem> updateItemByPost(
            @PathVariable Long productId,
            @RequestBody CartItemRequest request
    ) {

        return ApiResponse.ok(
                "Item quantity updated",
                cartService.updateQuantity(
                        productId,
                        request.quantity()
                )
        );
    }

    // =========================================================
    // REMOVE SINGLE ITEM
    // =========================================================
    @DeleteMapping("/items/{productId}")
    public ApiResponse<List<CartItem>> removeItem(
            @PathVariable Long productId
    ) {

        return ApiResponse.ok(
                "Item removed from cart",
                cartService.removeItem(productId)
        );
    }

    // OPTIONAL POST REMOVE
    @PostMapping("/items/{productId}/remove")
    public ApiResponse<List<CartItem>> removeItemByPost(
            @PathVariable Long productId
    ) {

        return ApiResponse.ok(
                "Item removed from cart",
                cartService.removeItem(productId)
        );
    }

    // =========================================================
    // CLEAR ENTIRE CART
    // =========================================================
    @DeleteMapping("/items")
    public ApiResponse<?> clearCart() {

        cartService.clearCart();

        return ApiResponse.ok(
                "Cart cleared successfully", null
        );
    }
}
