# Feature Roadmap

Tài liệu này mô tả CRUD đầy đủ theo từng vai trò cho hệ thống thương mại điện tử phân tán. Đây là bản đích chức năng để chia việc triển khai cho từng microservice.

## Vai Trò

- `ROLE_ADMIN`: toàn quyền quản trị hệ thống.
- `ROLE_CUSTOMER`: mua hàng, quản lý hồ sơ, giỏ hàng, đơn hàng.
- `ROLE_SHIPPER`: nhận đơn giao hàng, cập nhật trạng thái giao, gửi GPS realtime.

## Customer

### I. Authentication

| Chức năng | CRUD |
| --- | --- |
| Đăng ký tài khoản | CREATE |
| Đăng nhập | READ |
| Đăng xuất | UPDATE |
| Quên mật khẩu | UPDATE |
| Refresh token | UPDATE |

### II. Profile

| Chức năng | CRUD |
| --- | --- |
| Xem thông tin cá nhân | READ |
| Cập nhật profile | UPDATE |
| Upload avatar | UPDATE |
| Đổi mật khẩu | UPDATE |
| Xóa tài khoản | DELETE (Soft Delete) |

### III. Địa Chỉ Giao Hàng

| Chức năng | CRUD |
| --- | --- |
| Thêm địa chỉ | CREATE |
| Xem danh sách địa chỉ | READ |
| Cập nhật địa chỉ | UPDATE |
| Xóa địa chỉ | DELETE |
| Đặt địa chỉ mặc định | UPDATE |

### IV. Sản Phẩm

| Chức năng | CRUD |
| --- | --- |
| Xem danh sách sản phẩm | READ |
| Xem chi tiết sản phẩm | READ |
| Tìm kiếm sản phẩm | READ |
| Lọc sản phẩm | READ |
| Xem sản phẩm hot | READ |
| Xem flash sale | READ |

### V. Giỏ Hàng

| Chức năng | CRUD |
| --- | --- |
| Thêm sản phẩm vào giỏ | CREATE |
| Xem giỏ hàng | READ |
| Tăng giảm số lượng | UPDATE |
| Xóa sản phẩm khỏi giỏ | DELETE |
| Clear toàn bộ giỏ hàng | DELETE |

### VI. Wishlist

| Chức năng | CRUD |
| --- | --- |
| Thêm wishlist | CREATE |
| Xem wishlist | READ |
| Xóa wishlist | DELETE |

### VII. Đơn Hàng

| Chức năng | CRUD |
| --- | --- |
| Tạo đơn hàng | CREATE |
| Xem đơn hàng | READ |
| Xem chi tiết đơn hàng | READ |
| Theo dõi đơn realtime | READ |
| Hủy đơn hàng | UPDATE |
| Xem lịch sử mua hàng | READ |

Không xóa đơn hàng vật lý. Hủy đơn phải chuyển trạng thái sang `CANCELLED`.

### VIII. Thanh Toán

| Chức năng | CRUD |
| --- | --- |
| Tạo thanh toán | CREATE |
| Xem lịch sử thanh toán | READ |
| Thanh toán online | UPDATE |

### IX. Review / Đánh Giá

| Chức năng | CRUD |
| --- | --- |
| Viết đánh giá | CREATE |
| Xem đánh giá | READ |
| Chỉnh sửa đánh giá | UPDATE |
| Xóa đánh giá | DELETE |

### X. Notification

| Chức năng | CRUD |
| --- | --- |
| Xem notification | READ |
| Đánh dấu đã đọc | UPDATE |
| Xóa notification | DELETE |

### XI. Voucher

| Chức năng | CRUD |
| --- | --- |
| Xem voucher | READ |
| Áp dụng voucher | UPDATE |

## Admin

### I. User Management

| Chức năng | CRUD |
| --- | --- |
| Tạo tài khoản admin/shipper | CREATE |
| Xem danh sách user | READ |
| Xem chi tiết user | READ |
| Cập nhật thông tin user | UPDATE |
| Khóa user | UPDATE |
| Mở khóa user | UPDATE |
| Xóa user | DELETE (Soft Delete) |

### II. Role Management

| Chức năng | CRUD |
| --- | --- |
| Tạo role | CREATE |
| Xem role | READ |
| Cập nhật role | UPDATE |
| Xóa role | DELETE |

### III. Category Management

| Chức năng | CRUD |
| --- | --- |
| Thêm category | CREATE |
| Xem category | READ |
| Sửa category | UPDATE |
| Xóa category | DELETE |

### IV. Brand Management

| Chức năng | CRUD |
| --- | --- |
| Tạo brand | CREATE |
| Xem brand | READ |
| Cập nhật brand | UPDATE |
| Xóa brand | DELETE |

### V. Product Management

| Chức năng | CRUD |
| --- | --- |
| Thêm sản phẩm | CREATE |
| Xem sản phẩm | READ |
| Cập nhật sản phẩm | UPDATE |
| Xóa sản phẩm | DELETE |
| Upload ảnh sản phẩm | CREATE |
| Cập nhật ảnh | UPDATE |
| Xóa ảnh | DELETE |

### VI. Inventory Management

| Chức năng | CRUD |
| --- | --- |
| Tạo kho hàng | CREATE |
| Xem tồn kho | READ |
| Cập nhật số lượng | UPDATE |
| Khóa sản phẩm hết hàng | UPDATE |

### VII. Order Management

| Chức năng | CRUD |
| --- | --- |
| Xem tất cả đơn hàng | READ |
| Xem chi tiết đơn | READ |
| Xác nhận đơn | UPDATE |
| Hủy đơn | UPDATE |
| Chuyển trạng thái đơn | UPDATE |
| Phân công shipper | UPDATE |

Không xóa đơn hàng vật lý. Admin chỉ được chuyển trạng thái nghiệp vụ.

### VIII. Payment Management

| Chức năng | CRUD |
| --- | --- |
| Xem payment | READ |
| Xem transaction | READ |
| Xác nhận thanh toán | UPDATE |
| Hoàn tiền | UPDATE |

### IX. Delivery Management

| Chức năng | CRUD |
| --- | --- |
| Xem giao hàng | READ |
| Cập nhật trạng thái giao | UPDATE |
| Quản lý shipper | UPDATE |

### X. Voucher Management

| Chức năng | CRUD |
| --- | --- |
| Tạo voucher | CREATE |
| Xem voucher | READ |
| Cập nhật voucher | UPDATE |
| Xóa voucher | DELETE |

### XI. Review Management

| Chức năng | CRUD |
| --- | --- |
| Xem review | READ |
| Ẩn review xấu | UPDATE |
| Xóa review | DELETE |

### XII. Notification Management

| Chức năng | CRUD |
| --- | --- |
| Tạo notification | CREATE |
| Xem notification | READ |
| Gửi thông báo hàng loạt | CREATE |
| Xóa notification | DELETE |

### XIII. Analytics Management

| Chức năng | CRUD |
| --- | --- |
| Xem dashboard doanh thu | READ |
| Xem biểu đồ thống kê | READ |
| Xem sản phẩm bán chạy | READ |
| Xem realtime analytics | READ |

### XIV. System Management

| Chức năng | CRUD |
| --- | --- |
| Xem log hệ thống | READ |
| Monitoring services | READ |
| Restart service | UPDATE |
| Backup database | CREATE |

## Shipper

### I. Profile

| Chức năng | CRUD |
| --- | --- |
| Xem profile | READ |
| Cập nhật profile | UPDATE |
| Đổi mật khẩu | UPDATE |

### II. Delivery Management

| Chức năng | CRUD |
| --- | --- |
| Xem đơn cần giao | READ |
| Nhận đơn hàng | UPDATE |
| Từ chối đơn | UPDATE |
| Xem chi tiết đơn | READ |
| Cập nhật trạng thái giao hàng | UPDATE |
| Xác nhận giao thành công | UPDATE |
| Báo giao thất bại | UPDATE |

### III. GPS Tracking

| Chức năng | CRUD |
| --- | --- |
| Gửi vị trí realtime | CREATE |
| Xem tracking | READ |

### IV. Delivery History

| Chức năng | CRUD |
| --- | --- |
| Xem lịch sử giao hàng | READ |
| Xem thu nhập | READ |

## Soft Delete Enterprise

Các bảng nghiệp vụ quan trọng không được xóa vật lý:

| Bảng | Giải pháp |
| --- | --- |
| `users` | `status = BANNED` |
| `products` | `status = INACTIVE` |
| `orders` | `status = CANCELLED` |
| `payments` | `status = REFUNDED` |

## Phân Chia Microservices

| Service | CRUD chính |
| --- | --- |
| `auth-service` | Authentication, token, password, role security |
| `user-service` | User profile, address, admin user management |
| `product-service` | Product, category, brand, inventory, wishlist, review |
| `cart-service` | Cart CRUD |
| `order-service` | Order CRUD, order status, order history |
| `payment-service` | Payment, transaction, refund |
| `delivery-service` | Delivery, shipper assignment, GPS tracking |
| `notification-service` | Notification CRUD, realtime WebSocket |
| `analytics-service` | Dashboard, revenue, chart, best-seller, realtime analytics |

## Ghi Chú Triển Khai

- Code hiện tại mới là prototype, nhiều controller còn dùng dữ liệu seed/in-memory.
- Cần chuẩn hóa role trong code theo `ADMIN`, `CUSTOMER`, `SHIPPER` hoặc map rõ sang `ROLE_*` ở tầng security.
- Các API xóa mềm phải là `UPDATE status`, không dùng hard delete cho user, product, order, payment.
- Gateway cần validate JWT và phân quyền route theo role trước khi mở rộng CRUD thật.
- Frontend cần đồng bộ lại endpoint với backend trước khi phát triển tiếp các màn hình CRUD.
