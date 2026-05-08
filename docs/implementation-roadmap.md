# Implementation Roadmap

Roadmap này chuyển CRUD theo vai trò trong [feature-roadmap.md](feature-roadmap.md) thành các giai đoạn triển khai kỹ thuật.

## Giai Đoạn 1: Chuẩn Hóa Nền Tảng

- Hoàn thiện Maven multi-module và đảm bảo build được toàn bộ backend.
- Đồng bộ endpoint giữa frontend và backend.
- Chuẩn hóa response format trong `shared-lib`.
- Chuẩn hóa role thành `ADMIN`, `CUSTOMER`, `SHIPPER`.
- Thống nhất rule soft delete cho `users`, `products`, `orders`, `payments`.

## Giai Đoạn 2: Auth, User Và Role Security

- `auth-service`: đăng ký, đăng nhập, đăng xuất, refresh token, quên mật khẩu.
- `auth-service`: mã hóa mật khẩu bằng BCrypt.
- `auth-service`: lưu user, role, refresh token bằng Spring Data JPA.
- `api-gateway`: validate JWT và forward identity header sang service phía sau.
- `api-gateway`: phân quyền route theo `ROLE_ADMIN`, `ROLE_CUSTOMER`, `ROLE_SHIPPER`.
- `user-service`: profile, đổi mật khẩu, avatar, soft delete tài khoản.
- `user-service`: quản lý địa chỉ giao hàng.
- `user-service`: admin quản lý user và shipper.

## Giai Đoạn 3: Catalog Và Inventory

- `product-service`: CRUD category.
- `product-service`: CRUD brand.
- `product-service`: CRUD product.
- `product-service`: upload, cập nhật, xóa ảnh sản phẩm.
- `product-service`: tìm kiếm, lọc, sản phẩm hot, flash sale.
- `product-service`: CRUD inventory và tự khóa sản phẩm hết hàng.
- `product-service`: wishlist và review.

## Giai Đoạn 4: Cart Và Order

- `cart-service`: thêm sản phẩm, xem giỏ hàng, cập nhật số lượng, xóa item, clear cart.
- `order-service`: tạo đơn hàng từ giỏ hàng.
- `order-service`: xem đơn, chi tiết đơn, lịch sử mua hàng.
- `order-service`: hủy đơn bằng trạng thái `CANCELLED`, không xóa vật lý.
- `order-service`: admin xác nhận đơn, chuyển trạng thái, phân công shipper.
- `order-service`: publish event khi trạng thái đơn thay đổi.

## Giai Đoạn 5: Payment, Delivery Và Notification

- `payment-service`: tạo payment, xem lịch sử payment, transaction.
- `payment-service`: xác nhận thanh toán online, hoàn tiền bằng trạng thái `REFUNDED`.
- `delivery-service`: shipper xem đơn cần giao, nhận/từ chối đơn.
- `delivery-service`: cập nhật trạng thái giao hàng, giao thành công, giao thất bại.
- `delivery-service`: GPS tracking realtime và lịch sử giao hàng.
- `notification-service`: CRUD notification, đánh dấu đã đọc, gửi thông báo hàng loạt.
- `notification-service`: WebSocket realtime cho order, delivery và notification.

## Giai Đoạn 6: Analytics, Admin Và Vận Hành

- `analytics-service`: dashboard doanh thu.
- `analytics-service`: biểu đồ thống kê, sản phẩm bán chạy, realtime analytics.
- Frontend customer: auth, profile, product, cart, checkout, order, wishlist, review, notification.
- Frontend admin: user, role, category, brand, product, inventory, order, payment, delivery, voucher, review, notification, analytics.
- Frontend shipper: profile, đơn cần giao, tracking, lịch sử giao hàng, thu nhập.
- System management: xem log, monitoring service, restart service, backup database.

## Ưu Tiên Gần Nhất

1. Sửa build backend/Maven wrapper để CI local chạy ổn định.
2. Đồng bộ các API đang lệch: product detail, cart, order list.
3. Thay seed/in-memory bằng persistence thật cho auth, product, cart, order.
4. Bật JWT validation ở gateway.
5. Mở rộng CRUD theo từng service, bắt đầu từ customer flow: register -> login -> products -> cart -> order -> payment.
