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

    @Transactional
    public List<CartItem> getItems() {
        syncExistingItems();
        return cartItemRepository.findAll().stream()
                .sorted(Comparator.comparing(CartItemEntity::getProductId))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CartItem addItem(CartItemRequest request) {
        int quantity = request.quantity() == null ? 1 : request.quantity();
        if (quantity <= 0) {
            quantity = 1;
        }

        CartItemEntity entity = cartItemRepository.findById(request.productId())
                .orElseGet(() -> createEntity(request.productId(), 0));
        syncProductInfo(entity);
        entity.setQuantity(entity.getQuantity() + quantity);
        return toResponse(cartItemRepository.save(entity));
    }

    @Transactional
    public CartItem updateQuantity(Long productId, Integer quantity) {
        int safeQuantity = quantity == null ? 1 : quantity;
        if (safeQuantity <= 0) {
            cartItemRepository.deleteById(productId);
            return null;
        }

        CartItemEntity entity = cartItemRepository.findById(productId)
                .orElseGet(() -> createEntity(productId, safeQuantity));
        syncProductInfo(entity);
        entity.setQuantity(safeQuantity);
        return toResponse(cartItemRepository.save(entity));
    }

    @Transactional
    public List<CartItem> removeItem(Long productId) {
        if (cartItemRepository.existsById(productId)) {
            cartItemRepository.deleteById(productId);
        }
        return getItems();
    }

    private CartItemEntity createEntity(Long productId, int quantity) {
        CartItem product = PRODUCT_CATALOG.get(productId);
        if (product == null) {
            return new CartItemEntity(productId, "Product " + productId, quantity, 0);
        }
        return new CartItemEntity(product.productId(), product.name(), quantity, product.unitPrice());
    }

    private void syncProductInfo(CartItemEntity entity) {
        CartItem product = PRODUCT_CATALOG.get(entity.getProductId());
        if (product == null) {
            return;
        }
        entity.setName(product.name());
        entity.setUnitPrice(product.unitPrice());
    }

    private void syncExistingItems() {
        List<CartItemEntity> items = cartItemRepository.findAll();
        for (CartItemEntity item : items) {
            syncProductInfo(item);
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                item.setQuantity(1);
            }
        }
        cartItemRepository.saveAll(items);
    }

    private CartItem toResponse(CartItemEntity entity) {
        return new CartItem(entity.getProductId(), entity.getName(), entity.getQuantity(), entity.getUnitPrice());
    }
}
