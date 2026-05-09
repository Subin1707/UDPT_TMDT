package com.ecommerce.cart.service;

import com.ecommerce.cart.dto.CartItemRequest;
import com.ecommerce.cart.entity.CartItem;
import com.ecommerce.cart.entity.CartItemEntity;
import com.ecommerce.cart.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class CartService {

    // =========================================================
    // MOCK PRODUCT CATALOG
    // =========================================================
    private static final Map<Long, CartItem> PRODUCT_CATALOG = Map.of(
            1L, new CartItem(1L, "Wireless Keyboard", 0, 390000),
            2L, new CartItem(2L, "USB-C Hub", 0, 550000),
            3L, new CartItem(3L, "Gaming Mouse", 0, 420000),
            4L, new CartItem(4L, "Noise Cancelling Headset", 0, 1190000),
            5L, new CartItem(5L, "Smart LED Lamp", 0, 690000),
            6L, new CartItem(6L, "Portable SSD 1TB", 0, 1790000),
            7L, new CartItem(7L, "Ergonomic Chair", 0, 2590000),
            8L, new CartItem(8L, "4K Monitor", 0, 6490000)
    );

    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    // =========================================================
    // GET ALL ITEMS
    // =========================================================
    @Transactional
    public List<CartItem> getItems() {

        syncExistingItems();

        return cartItemRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(CartItemEntity::getProductId))
                .map(this::toResponse)
                .toList();
    }

    // =========================================================
    // ADD ITEM
    // =========================================================
    @Transactional
    public CartItem addItem(CartItemRequest request) {

        if (request == null || request.productId() == null) {
            throw new RuntimeException("Product ID is required");
        }

        int quantity = request.quantity() == null
                ? 1
                : request.quantity();

        if (quantity <= 0) {
            quantity = 1;
        }

        CartItemEntity entity = cartItemRepository
                .findById(request.productId())
                .orElseGet(() ->
                        createEntity(request.productId(), 0)
                );

        syncProductInfo(entity);

        entity.setQuantity(
                entity.getQuantity() + quantity
        );

        CartItemEntity saved =
                cartItemRepository.save(entity);

        return toResponse(saved);
    }

    // =========================================================
    // UPDATE QUANTITY
    // =========================================================
    @Transactional
    public CartItem updateQuantity(
            Long productId,
            Integer quantity
    ) {

        CartItemEntity entity = cartItemRepository
                .findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found")
                );

        // REMOVE ITEM IF QUANTITY <= 0
        if (quantity == null || quantity <= 0) {

            cartItemRepository.delete(entity);

            return null;
        }

        syncProductInfo(entity);

        entity.setQuantity(quantity);

        CartItemEntity saved =
                cartItemRepository.save(entity);

        return toResponse(saved);
    }

    // =========================================================
    // REMOVE SINGLE ITEM
    // =========================================================
    @Transactional
    public List<CartItem> removeItem(Long productId) {

        cartItemRepository.findById(productId)
                .ifPresent(cartItemRepository::delete);

        return getItems();
    }

    // =========================================================
    // CLEAR CART
    // =========================================================
    @Transactional
    public void clearCart() {

        cartItemRepository.deleteAll();
    }

    // =========================================================
    // CREATE ENTITY
    // =========================================================
    private CartItemEntity createEntity(
            Long productId,
            int quantity
    ) {

        CartItem product =
                PRODUCT_CATALOG.get(productId);

        // FALLBACK PRODUCT
        if (product == null) {

            return new CartItemEntity(
                    productId,
                    "Product " + productId,
                    quantity,
                    0
            );
        }

        return new CartItemEntity(
                product.productId(),
                product.name(),
                quantity,
                product.unitPrice()
        );
    }

    // =========================================================
    // SYNC PRODUCT INFO
    // =========================================================
    private void syncProductInfo(
            CartItemEntity entity
    ) {

        CartItem product =
                PRODUCT_CATALOG.get(entity.getProductId());

        if (product == null) {
            return;
        }

        entity.setName(product.name());

        entity.setUnitPrice(
                product.unitPrice()
        );
    }

    // =========================================================
    // FIX INVALID DATA
    // =========================================================
    private void syncExistingItems() {

        List<CartItemEntity> items =
                cartItemRepository.findAll();

        for (CartItemEntity item : items) {

            syncProductInfo(item);

            if (
                    item.getQuantity() == null
                            || item.getQuantity() <= 0
            ) {
                item.setQuantity(1);
            }
        }

        cartItemRepository.saveAll(items);
    }

    // =========================================================
    // ENTITY -> RESPONSE DTO
    // =========================================================
    private CartItem toResponse(
            CartItemEntity entity
    ) {

        return new CartItem(
                entity.getProductId(),
                entity.getName(),
                entity.getQuantity(),
                entity.getUnitPrice()
        );
    }
}

