-- =========================================================
-- E-COMMERCE DISTRIBUTED SYSTEM DATABASE
-- MYSQL 8+
-- FIXED FOR CURRENT SPRING BOOT CART SERVICE
-- =========================================================

DROP DATABASE IF EXISTS defaultdb;
CREATE DATABASE defaultdb;
USE defaultdb;

-- =========================================================
-- AUTH SERVICE
-- =========================================================

CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(255) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,

    phone VARCHAR(20) UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    avatar_url TEXT,

    status ENUM(
        'ACTIVE',
        'INACTIVE',
        'BANNED'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY(user_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY(role_id)
        REFERENCES roles(id)
        ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    token TEXT NOT NULL,

    expired_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================================
-- USER SERVICE
-- =========================================================

CREATE TABLE user_addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    receiver_name VARCHAR(255) NOT NULL,

    phone VARCHAR(20) NOT NULL,

    province VARCHAR(100),

    district VARCHAR(100),

    ward VARCHAR(100),

    address_detail TEXT,

    is_default BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_addresses_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    product_id BIGINT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- PRODUCT SERVICE
-- =========================================================

CREATE TABLE brands (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL UNIQUE,

    logo_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    parent_id BIGINT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_parent
        FOREIGN KEY(parent_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    category_id BIGINT NULL,

    brand_id BIGINT NULL,

    name VARCHAR(255) NOT NULL,

    slug VARCHAR(255) UNIQUE,

    description LONGTEXT,

    price DECIMAL(12,2) NOT NULL,

    discount_percent INT DEFAULT 0,

    thumbnail_url TEXT,

    average_rating DECIMAL(3,2) DEFAULT 0,

    sold_count INT DEFAULT 0,

    status ENUM(
        'ACTIVE',
        'INACTIVE',
        'OUT_OF_STOCK'
    ) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_products_brand
        FOREIGN KEY(brand_id)
        REFERENCES brands(id)
        ON DELETE SET NULL
);

CREATE TABLE product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT NOT NULL,

    image_url TEXT NOT NULL,

    is_thumbnail BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_images_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

CREATE TABLE inventories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT NOT NULL UNIQUE,

    quantity INT NOT NULL DEFAULT 0,

    reserved_quantity INT NOT NULL DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventories_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);

CREATE TABLE product_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT NOT NULL,

    user_id BIGINT NOT NULL,

    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),

    comment TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_reviews_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================================
-- CART SERVICE
-- FIXED TO MATCH YOUR SPRING ENTITY
-- =========================================================

CREATE TABLE cart_items (
    product_id BIGINT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    quantity INT NOT NULL DEFAULT 1,

    unit_price INT NOT NULL
);

-- =========================================================
-- ORDER SERVICE
-- =========================================================

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    shipping_address_id BIGINT NULL,

    order_code VARCHAR(100) UNIQUE,

    total_amount DECIMAL(12,2) NOT NULL,

    shipping_fee DECIMAL(12,2) DEFAULT 0,

    discount_amount DECIMAL(12,2) DEFAULT 0,

    final_amount DECIMAL(12,2) NOT NULL,

    payment_method ENUM(
        'COD',
        'VNPAY',
        'MOMO',
        'PAYPAL'
    ) DEFAULT 'COD',

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'PACKING',
        'SHIPPING',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
    ) DEFAULT 'PENDING',

    note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_orders_address
        FOREIGN KEY(shipping_address_id)
        REFERENCES user_addresses(id)
        ON DELETE SET NULL
);

CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT NOT NULL,

    product_id BIGINT NOT NULL,

    product_name VARCHAR(255),

    thumbnail_url TEXT,

    price DECIMAL(12,2) NOT NULL,

    quantity INT NOT NULL,

    total_price DECIMAL(12,2) NOT NULL,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

CREATE TABLE order_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT NOT NULL,

    old_status VARCHAR(50),

    new_status VARCHAR(50),

    changed_by VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_history_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

-- =========================================================
-- PAYMENT SERVICE
-- =========================================================

CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT NOT NULL,

    payment_code VARCHAR(100) UNIQUE,

    amount DECIMAL(12,2) NOT NULL,

    method ENUM(
        'COD',
        'VNPAY',
        'MOMO',
        'PAYPAL'
    ),

    status ENUM(
        'PENDING',
        'COMPLETED',
        'FAILED',
        'REFUNDED'
    ) DEFAULT 'PENDING',

    paid_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payments_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
);

CREATE TABLE payment_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    payment_id BIGINT NOT NULL,

    transaction_code VARCHAR(255),

    gateway_name VARCHAR(100),

    response_data LONGTEXT,

    status VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_transactions_payment
        FOREIGN KEY(payment_id)
        REFERENCES payments(id)
        ON DELETE CASCADE
);

-- =========================================================
-- DELIVERY SERVICE
-- =========================================================

CREATE TABLE shippers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(255),

    phone VARCHAR(20),

    vehicle_number VARCHAR(50),

    status ENUM(
        'ONLINE',
        'OFFLINE',
        'BUSY'
    ) DEFAULT 'OFFLINE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    order_id BIGINT NOT NULL,

    shipper_id BIGINT NULL,

    status ENUM(
        'PENDING',
        'PICKED_UP',
        'IN_TRANSIT',
        'DELIVERED',
        'FAILED'
    ) DEFAULT 'PENDING',

    estimated_delivery_time TIMESTAMP NULL,

    delivered_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_deliveries_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_deliveries_shipper
        FOREIGN KEY(shipper_id)
        REFERENCES shippers(id)
        ON DELETE SET NULL
);

CREATE TABLE delivery_tracking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    delivery_id BIGINT NOT NULL,

    latitude DOUBLE,

    longitude DOUBLE,

    tracking_message VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_delivery_tracking_delivery
        FOREIGN KEY(delivery_id)
        REFERENCES deliveries(id)
        ON DELETE CASCADE
);

-- =========================================================
-- NOTIFICATION SERVICE
-- =========================================================

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    title VARCHAR(255),

    type VARCHAR(50),

    message TEXT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- =========================================================
-- VOUCHER SERVICE
-- =========================================================

CREATE TABLE vouchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(50) UNIQUE NOT NULL,

    description TEXT,

    discount_percent INT,

    max_discount_amount DECIMAL(12,2),

    minimum_order_amount DECIMAL(12,2),

    quantity INT DEFAULT 0,

    used_count INT DEFAULT 0,

    expired_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_vouchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    voucher_id BIGINT NOT NULL,

    is_used BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_vouchers_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_vouchers_voucher
        FOREIGN KEY(voucher_id)
        REFERENCES vouchers(id)
        ON DELETE CASCADE
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_products_category
ON products(category_id);

CREATE INDEX idx_products_brand
ON products(brand_id);

CREATE INDEX idx_products_status
ON products(status);

CREATE INDEX idx_orders_user
ON orders(user_id);

CREATE INDEX idx_orders_status
ON orders(status);

CREATE INDEX idx_payments_order
ON payments(order_id);

CREATE INDEX idx_notifications_user
ON notifications(user_id);

CREATE INDEX idx_reviews_product
ON product_reviews(product_id);

CREATE INDEX idx_delivery_tracking_delivery
ON delivery_tracking(delivery_id);

-- =========================================================
-- DEFAULT DATA
-- =========================================================

INSERT INTO roles(name)
VALUES
('ROLE_ADMIN'),
('ROLE_CUSTOMER'),
('ROLE_SHIPPER');

-- =========================================================
-- SAMPLE PRODUCTS
-- =========================================================

INSERT INTO brands(name)
VALUES
('Logitech'),
('Samsung'),
('Sony');

INSERT INTO categories(name)
VALUES
('Electronics'),
('Accessories');

INSERT INTO products(
    category_id,
    brand_id,
    name,
    slug,
    description,
    price,
    status
)
VALUES
(2, 1, 'Wireless Keyboard', 'wireless-keyboard', 'Keyboard', 390000, 'ACTIVE'),
(2, 1, 'USB-C Hub', 'usb-c-hub', 'Hub', 550000, 'ACTIVE'),
(2, 1, 'Gaming Mouse', 'gaming-mouse', 'Mouse', 420000, 'ACTIVE'),
(1, 3, 'Noise Cancelling Headset', 'noise-headset', 'Headset', 1190000, 'ACTIVE'),
(1, 2, 'Smart LED Lamp', 'smart-led-lamp', 'Lamp', 690000, 'ACTIVE'),
(1, 2, 'Portable SSD 1TB', 'portable-ssd-1tb', 'SSD', 1790000, 'ACTIVE'),
(1, 1, 'Ergonomic Chair', 'ergonomic-chair', 'Chair', 2590000, 'ACTIVE'),
(1, 2, '4K Monitor', '4k-monitor', 'Monitor', 6490000, 'ACTIVE');

-- =========================================================
-- END
-- =========================================================