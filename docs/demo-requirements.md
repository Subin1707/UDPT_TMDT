# Yêu Cầu Demo Báo Cáo

## 1. Tên Đề Tài

**Xây dựng hệ thống thương mại điện tử phân tán hỗ trợ xử lý đơn hàng và thông báo thời gian thực**

## 2. Mục Tiêu Demo

Demo cần thể hiện hệ thống thương mại điện tử được tách theo kiến trúc microservices, có frontend ReactJS, API Gateway và các service backend độc lập.

Trong phạm vi demo hiện tại, hệ thống tập trung chứng minh các luồng chính:

- Đăng ký, đăng nhập và sinh JWT.
- Xem danh sách sản phẩm.
- Xem chi tiết sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Cập nhật số lượng sản phẩm trong giỏ hàng.
- Xóa sản phẩm khỏi giỏ hàng.
- Tạo đơn hàng từ giỏ hàng.
- Xem lịch sử đơn hàng.
- Xem dashboard admin cơ bản.
- Gửi notification realtime qua WebSocket.
- Xem tracking giao hàng mẫu.
- Xem dashboard analytics mẫu.

Các phần như Kafka event-driven, Redis cache, MySQL production, phân quyền đầy đủ theo từng route và GPS tracking bản đồ là phần thiết kế/mở rộng trong roadmap, không bắt buộc chứng minh đầy đủ trong demo hiện tại nếu chưa có triển khai thật.

## 3. Kiến Trúc Demo

```text
ReactJS Frontend
      |
      v
API Gateway :8080
      |
      v
Microservices
      |
      v
Database / In-memory Seed / H2 File DB
```

## 4. Các Service Cần Chạy Khi Demo

| Service | Port | Vai trò demo |
| --- | --- | --- |
| `api-gateway` | `8080` | Điều hướng request từ frontend đến backend |
| `auth-service` | `8081` | Đăng nhập, đăng ký, sinh JWT |
| `product-service` | `8083` | Danh sách và chi tiết sản phẩm |
| `cart-service` | `8084` | Giỏ hàng, cập nhật số lượng, xóa item, lưu H2 file DB |
| `order-service` | `8085` | Tạo và xem đơn hàng |
| `payment-service` | `8086` | Thanh toán mô phỏng |
| `notification-service` | `8087` | Notification REST và WebSocket |
| `delivery-service` | `8088` | Tracking giao hàng mẫu |
| `analytics-service` | `8089` | Dashboard thống kê mẫu |
| `frontend-react` | `5173` | Giao diện demo |

## 5. Công Nghệ Sử Dụng Trong Demo

| Thành phần | Công nghệ | Trạng thái |
| --- | --- | --- |
| Frontend | ReactJS, Vite, Redux Toolkit | Đã có |
| Backend | Spring Boot | Đã có |
| API Gateway | Spring Cloud Gateway | Đã có |
| Auth | JWT demo | Đã có cơ bản |
| Cart DB | H2 file database | Đã có |
| Product/Order seed | In-memory data | Đã có |
| Realtime | WebSocket notification | Đã có cơ bản |
| Docker infra | PostgreSQL, Redis | Có file compose |
| Kafka | Event-driven design | Roadmap |
| Redis cache | Cache sản phẩm/flash sale | Roadmap |
| MySQL production | Database chính | Roadmap/thiết kế |

## 6. Tài Khoản Demo

### Admin

- Email: `admin@ecommerce.com`
- Password: `Admin@123`

### Customer

Có thể đăng ký tài khoản mới trên màn hình Register hoặc dùng email bất kỳ không bắt đầu bằng `admin@`.

## 7. Kịch Bản Demo Chính

### Bước 1: Chạy hệ thống

Build backend:

```powershell
.\mvnw.cmd -DskipTests install
```

Chạy API Gateway:

```powershell
.\mvnw.cmd -pl services/api-gateway spring-boot:run
```

Chạy các service chính:

```powershell
.\mvnw.cmd -pl services/auth-service spring-boot:run
.\mvnw.cmd -pl services/product-service spring-boot:run
.\mvnw.cmd -pl services/cart-service spring-boot:run
.\mvnw.cmd -pl services/order-service spring-boot:run
.\mvnw.cmd -pl services/payment-service spring-boot:run
.\mvnw.cmd -pl services/notification-service spring-boot:run
.\mvnw.cmd -pl services/delivery-service spring-boot:run
.\mvnw.cmd -pl services/analytics-service spring-boot:run
```

Chạy frontend:

```powershell
cd frontend-react
npm.cmd install
npm.cmd run dev
```

Mở:

```text
http://localhost:5173
```

### Bước 2: Demo đăng ký và đăng nhập

1. Vào màn hình Register.
2. Tạo tài khoản customer.
3. Đăng nhập.
4. Kiểm tra header hiển thị user đã đăng nhập.

Ý nghĩa demo:

- Frontend gọi `auth-service` qua API Gateway.
- Backend trả JWT.
- Frontend lưu token vào localStorage.

### Bước 3: Demo sản phẩm

1. Vào trang Products.
2. Xem danh sách sản phẩm.
3. Chọn một sản phẩm để xem chi tiết.

API dùng:

```text
GET /api/products
GET /api/products/{id}
```

Ý nghĩa demo:

- Product service cung cấp dữ liệu catalog.
- Frontend render danh sách và chi tiết sản phẩm.

### Bước 4: Demo giỏ hàng

1. Bấm Add to Cart ở sản phẩm.
2. Vào Cart.
3. Bấm `+` để tăng số lượng.
4. Bấm `-` để giảm số lượng.
5. Bấm Remove để xóa một sản phẩm.
6. Refresh trang để chứng minh cart được lưu ở backend H2 database.

API dùng:

```text
GET /api/cart/items
POST /api/cart/items
```

Payload thêm sản phẩm:

```json
{
  "productId": 1,
  "quantity": 1
}
```

Payload cập nhật số lượng:

```json
{
  "productId": 1,
  "quantity": 2,
  "action": "UPDATE"
}
```

Payload xóa sản phẩm:

```json
{
  "productId": 1,
  "action": "REMOVE"
}
```

Ý nghĩa demo:

- Cart service xử lý CRUD giỏ hàng.
- Dữ liệu giỏ hàng được lưu qua Spring Data JPA vào H2 file DB.

### Bước 5: Demo đặt hàng

1. Vào Cart.
2. Bấm Checkout.
3. Nhập thông tin giao hàng.
4. Bấm Place Order.
5. Chuyển sang Orders để xem đơn vừa tạo.

API dùng:

```text
POST /api/orders
GET /api/orders
```

Ý nghĩa demo:

- Order service tạo đơn hàng.
- Frontend hiển thị lịch sử đơn hàng.

### Bước 6: Demo admin dashboard

1. Đăng nhập bằng tài khoản admin.
2. Vào trang Admin.
3. Xem số lượng đơn hàng, doanh thu ước tính và số lượng sản phẩm.

Ý nghĩa demo:

- Role admin được nhận diện từ JWT response.
- Dashboard đọc dữ liệu từ order và product service.

### Bước 7: Demo notification realtime

Chạy notification service, sau đó gọi:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8087/api/notifications -ContentType "application/json" -Body '{"userId":1,"message":"Order #1 updated"}'
```

WebSocket endpoint:

```text
ws://localhost:8087/ws/notifications
```

Ý nghĩa demo:

- Notification service hỗ trợ REST API.
- WebSocket dùng cho realtime notification.

### Bước 8: Demo delivery và analytics

Delivery tracking mẫu:

```text
GET /api/deliveries/{orderId}
```

Analytics dashboard:

```text
GET /api/analytics/dashboard
```

Ý nghĩa demo:

- Delivery service mô phỏng tracking đơn hàng.
- Analytics service mô phỏng thống kê dashboard.

## 8. Phân Quyền Trong Báo Cáo

Hệ thống định nghĩa 3 vai trò:

| Vai trò | Mô tả |
| --- | --- |
| `ADMIN` | Quản trị hệ thống |
| `CUSTOMER` | Mua hàng |
| `SHIPPER` | Giao hàng |

Trong demo hiện tại:

- Admin được nhận diện bằng email `admin@ecommerce.com`.
- Customer dùng email thông thường.
- Shipper là vai trò trong thiết kế/roadmap, chưa có màn hình demo đầy đủ.

## 9. Event-Driven Architecture Trong Báo Cáo

Thiết kế mục tiêu:

```text
Order Service
      |
      v
Kafka Event
      |
      v
Payment Service -> Notification Service -> Delivery Service
```

Trạng thái hiện tại:

- Hệ thống đã tách service theo microservices.
- Giao tiếp hiện tại chủ yếu là REST API.
- Kafka event-driven là phần mở rộng trong roadmap.

Khi thuyết trình, nên trình bày Kafka là hướng nâng cấp để hệ thống đạt mô hình bất đồng bộ giống doanh nghiệp.

## 10. Database Và Soft Delete

Trong thiết kế:

| Bảng | Ý nghĩa |
| --- | --- |
| `users` | Người dùng |
| `products` | Sản phẩm |
| `cart_items` | Giỏ hàng |
| `orders` | Đơn hàng |
| `payments` | Thanh toán |
| `deliveries` | Giao hàng |
| `notifications` | Thông báo |

Soft delete đề xuất:

| Bảng | Cách xử lý |
| --- | --- |
| `users` | `status = BANNED` |
| `products` | `status = INACTIVE` |
| `orders` | `status = CANCELLED` |
| `payments` | `status = REFUNDED` |

Trong demo hiện tại:

- `cart-service` đã có H2 file database.
- Một số service vẫn dùng dữ liệu mẫu để phục vụ demo.

## 11. Các Điểm Cần Nhấn Mạnh Khi Báo Cáo

- Hệ thống đã được chia thành nhiều service độc lập.
- Frontend không gọi trực tiếp từng service mà đi qua API Gateway.
- Các service có thể chạy độc lập trên port riêng.
- Cart đã chứng minh được thao tác CRUD có lưu DB.
- Notification có WebSocket để mô phỏng realtime.
- Analytics, payment, delivery đang ở mức mô phỏng để thể hiện luồng nghiệp vụ.
- Kafka, Redis, MySQL production và phân quyền chi tiết là hướng mở rộng.

## 12. Kết Luận Demo

Demo chứng minh hệ thống có nền tảng microservices cho thương mại điện tử:

- Có frontend ReactJS.
- Có API Gateway.
- Có các service riêng cho auth, product, cart, order, payment, delivery, notification, analytics.
- Có luồng mua hàng cơ bản từ xem sản phẩm đến tạo đơn.
- Có lưu giỏ hàng bằng database.
- Có notification realtime cơ bản.

Hệ thống có thể tiếp tục mở rộng theo hướng doanh nghiệp bằng Kafka, Redis, Docker hóa đầy đủ, database production và role-based security chặt chẽ hơn.
