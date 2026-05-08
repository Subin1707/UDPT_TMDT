# Initial Database Design

Bang nen tang:

- `users(id, full_name, email, password_hash, status, created_at)`
- `roles(id, name)`
- `user_roles(user_id, role_id)`
- `products(id, category_id, name, description, price, status, created_at)`
- `categories(id, name, parent_id)`
- `inventories(id, product_id, quantity, reserved_quantity)`
- `carts(id, user_id, created_at)`
- `cart_items(id, cart_id, product_id, quantity)`
- `orders(id, user_id, status, total_amount, created_at)`
- `order_items(id, order_id, product_id, price, quantity)`
- `payments(id, order_id, amount, method, status, created_at)`
- `deliveries(id, order_id, status, current_location, updated_at)`
- `notifications(id, user_id, type, message, read_at, created_at)`
