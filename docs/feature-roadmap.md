# Feature Roadmap

Tài liệu này mô tả các chức năng hệ thống thương mại điện tử phân tán theo từng vai trò và dịch vụ.

## Vai trò chính

### CUSTOMER (KHÁCH HÀNG)

#### I. AUTHENTICATION
- Đăng ký tài khoản: CREATE
- Đăng nhập: READ
- Đăng xuất: UPDATE
- Quên mật khẩu: UPDATE
- Refresh token: UPDATE

#### II. PROFILE
- Xem thông tin cá nhân: READ
- Cập nhật profile: UPDATE
- Upload avatar: UPDATE
- Đổi mật khẩu: UPDATE
- Xóa tài khoản: DELETE (Soft Delete)

#### III. ĐỊA CHỈ GIAO HÀNG
- Thêm địa chỉ: CREATE
- Xem danh sách địa chỉ: READ
- Cập nhật địa chỉ: UPDATE
- Xóa địa chỉ: DELETE
- Đặt địa chỉ mặc định: UPDATE

#### IV. SẢN PHẨM
- Xem danh sách sản phẩm: READ
- Xem chi tiết sản phẩm: READ
- Tìm kiếm sản phẩm: READ
- Lọc sản phẩm: READ
- Xem sản phẩm hot: READ
- Xem flash sale: READ

#### V. GIỎ HÀNG
- Thêm sản phẩm vào giỏ: CREATE
- Xem giỏ hàng: READ
- Tăng giảm số lượng: UPDATE
- Xóa sản phẩm khỏi giỏ: DELETE
- Clear toàn bộ giỏ hàng: DELETE

#### VI. WISHLIST
- Thêm wishlist: CREATE
- Xem wishlist: READ
- Xóa wishlist: DELETE

#### VII. ĐƠN HÀNG
- Tạo đơn hàng: CREATE
- Xem đơn hàng: READ
- Xem chi tiết đơn hàng: READ
- Theo dõi đơn realtime: READ
- Hủy đơn hàng: UPDATE
- Xem lịch sử mua hàng: READ

> ⚠️ Không được xóa đơn hàng vật lý.

#### VIII. THANH TOÁN
- Tạo thanh toán: CREATE
- Xem lịch sử thanh toán: READ
- Thanh toán online: UPDATE

#### IX. REVIEW / ĐÁNH GIÁ
- Viết đánh giá: CREATE
- Xem đánh giá: READ
- Chỉnh sửa đánh giá: UPDATE
- Xóa đánh giá: DELETE

#### X. NOTIFICATION
- Xem notification: READ
- Đánh dấu đã đọc: UPDATE
- Xóa notification: DELETE

#### XI. VOUCHER
- Xem voucher: READ
- Áp dụng voucher: UPDATE

### ADMIN (QUẢN TRỊ VIÊN)

#### I. USER MANAGEMENT
- Tạo tài khoản admin/shipper: CREATE
- Xem danh sách user: READ
- Xem chi tiết user: READ
- Cập nhật thông tin user: UPDATE
- Khóa user: UPDATE
- Mở khóa user: UPDATE
- Xóa user: DELETE (Soft Delete)

#### II. ROLE MANAGEMENT
- Tạo role: CREATE
- Xem role: READ
- Cập nhật role: UPDATE
- Xóa role: DELETE

#### III. CATEGORY MANAGEMENT
- Thêm category: CREATE
- Xem category: READ
- Sửa category: UPDATE
- Xóa category: DELETE

#### IV. BRAND MANAGEMENT
- Tạo brand: CREATE
- Xem brand: READ
- Cập nhật brand: UPDATE
- Xóa brand: DELETE

#### V. PRODUCT MANAGEMENT
- Thêm sản phẩm: CREATE
- Xem sản phẩm: READ
- Cập nhật sản phẩm: UPDATE
- Xóa sản phẩm: DELETE
- Upload ảnh sản phẩm: CREATE
- Cập nhật ảnh: UPDATE
- Xóa ảnh: DELETE

#### VI. INVENTORY MANAGEMENT
- Tạo kho hàng: CREATE
- Xem tồn kho: READ
- Cập nhật số lượng: UPDATE
- Khóa sản phẩm hết hàng: UPDATE

#### VII. ORDER MANAGEMENT
- Xem tất cả đơn hàng: READ
- Xem chi tiết đơn: READ
- Xác nhận đơn: UPDATE
- Hủy đơn: UPDATE
- Chuyển trạng thái đơn: UPDATE
- Phân công shipper: UPDATE

> ⚠️ Không xóa đơn hàng vật lý.

#### VIII. PAYMENT MANAGEMENT
- Xem payment: READ
- Xem transaction: READ
- Xác nhận thanh toán: UPDATE
- Hoàn tiền: UPDATE

#### IX. DELIVERY MANAGEMENT
- Xem giao hàng: READ
- Cập nhật trạng thái giao: UPDATE
- Quản lý shipper: UPDATE

#### X. VOUCHER MANAGEMENT
- Tạo voucher: CREATE
- Xem voucher: READ
- Cập nhật voucher: UPDATE
- Xóa voucher: DELETE

#### XI. REVIEW MANAGEMENT
- Xem review: READ
- Ẩn review xấu: UPDATE
- Xóa review: DELETE

#### XII. NOTIFICATION MANAGEMENT
- Tạo notification: CREATE
- Xem notification: READ
- Gửi thông báo hàng loạt: CREATE
- Xóa notification: DELETE

#### XIII. ANALYTICS MANAGEMENT
- Xem dashboard doanh thu: READ
- Xem biểu đồ thống kê: READ
- Xem sản phẩm bán chạy: READ
- Xem realtime analytics: READ

#### XIV. SYSTEM MANAGEMENT
- Xem log hệ thống: READ
- Monitoring services: READ
- Restart service: UPDATE
- Backup database: CREATE

### SHIPPER (NGƯỜI GIAO HÀNG)

#### I. PROFILE
- Xem profile: READ
- Cập nhật profile: UPDATE
- Đổi mật khẩu: UPDATE

#### II. DELIVERY MANAGEMENT
- Xem đơn cần giao: READ
- Nhận đơn hàng: UPDATE
- Từ chối đơn: UPDATE
- Xem chi tiết đơn: READ
- Cập nhật trạng thái giao hàng: UPDATE
- Xác nhận giao thành công: UPDATE
- Báo giao thất bại: UPDATE

#### III. GPS TRACKING
- Gửi vị trí realtime: CREATE
- Xem tracking: READ

#### IV. DELIVERY HISTORY
- Xem lịch sử giao hàng: READ
- Xem thu nhập: READ

## Soft Delete Enterprise
Không nên DELETE vật lý cho:
- `users`: status = `BANNED`
- `products`: status = `INACTIVE`
- `orders`: status = `CANCELLED`
- `payments`: status = `REFUNDED`

## Role Security
- `ROLE_ADMIN`: Toàn quyền
- `ROLE_CUSTOMER`: Mua hàng
- `ROLE_SHIPPER`: Giao hàng

## Phân chia microsservices
- `auth-service`: User/Auth CRUD
- `product-service`: Product CRUD, Category, Inventory
- `cart-service`: Cart CRUD
- `order-service`: Order CRUD
- `payment-service`: Payment CRUD
- `delivery-service`: Delivery CRUD
- `notification-service`: Notification CRUD
- `analytics-service`: Dashboard READ

## Ghi chú
Tài liệu này là bản đồ chức năng cho việc mở rộng hệ thống. Nhiều endpoint hiện tại đang dùng dữ liệu mẫu (`Seeder`) và cần được nâng cấp sang lưu trữ thực tế với Spring Data JPA, PostgreSQL và xác thực JWT.
