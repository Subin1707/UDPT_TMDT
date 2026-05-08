# Ecommerce Distributed System

He thong thuong mai dien tu phan tan theo kien truc microservices, ho tro xu ly don hang, thanh toan mo phong, theo doi van chuyen va thong bao realtime qua WebSocket.

## Cau Truc

- `services/api-gateway`: API Gateway dinh tuyen request, chay cong `8080`.
- `services/auth-service`: dang ky, dang nhap, sinh JWT, chay cong `8081`.
- `services/user-service`: ho so nguoi dung, chay cong `8082`.
- `services/product-service`: san pham, danh muc, ton kho, chay cong `8083`.
- `services/cart-service`: gio hang, chay cong `8084`.
- `services/order-service`: tao don hang va trang thai don, chay cong `8085`.
- `services/payment-service`: thanh toan mo phong, chay cong `8086`.
- `services/notification-service`: realtime notification bang WebSocket, chay cong `8087`.
- `services/delivery-service`: tracking van chuyen, chay cong `8088`.
- `services/analytics-service`: dashboard thong ke, chay cong `8089`.
- `shared-lib`: response, constants va code dung chung.
- `frontend-react`: dashboard ReactJS.
- `docker/docker-compose.yml`: PostgreSQL va Redis.
- `docs`: tai lieu kien truc, database va sequence diagram.

## Build / Install

Dung PowerShell tai thu muc root:

```powershell
.\mvnw.cmd -DskipTests install
```

Can chay lenh `install` it nhat mot lan truoc khi run tung service, vi cac service phu thuoc vao module `shared-lib`.

## Chay Backend

Vi day la multi-module microservices, khong chay truc tiep bang `.\mvnw.cmd spring-boot:run` o root. Can chon module bang `-pl`.

Chay API Gateway tren `http://localhost:8080`:
$env:Path += ";E:\apache-maven-3.9.15\bin"

```powershell
.\mvnw.cmd -pl services/api-gateway spring-boot:run
```

Mo them cac cua so PowerShell khac de chay service can dung:
chay lenh nay trc 
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

## Chay Ha Tang

```powershell
docker compose -f docker/docker-compose.yml up -d
```

## Chay Frontend

```powershell
cd frontend-react
npm install
npm run dev
```

Neu PowerShell chan `npm.ps1`, dung lenh:

```powershell
npm.cmd install
npm.cmd run dev
```

Demo admin login:

- Email: `admin@ecommerce.com`
- Password: `Admin@123`

Frontend hien co prototype cac nhom man hinh:

- Pre-login: splash, welcome, language, login, register, OTP, forgot password.
- Khach hang: home, category, search, product detail, review, cart, checkout, success, tracking, history, wishlist, notification, profile.
- Admin: admin login, dashboard, product, order, user, voucher, AI analytics.
- Shipper va nang cao: shipper dashboard, realtime delivery, chatbot AI, livestream, AR preview.

## Ket Noi Frontend Va Backend

Khi chay dev, frontend React dung Vite proxy trong `frontend-react/vite.config.js`:

```text
React 5173 -> /api/* -> API Gateway 8080 -> Product/Auth/Order services
```

Vi du de man hinh React lay san pham tu backend:

1. Terminal 1:

```powershell
.\mvnw.cmd -pl services/api-gateway spring-boot:run
```

2. Terminal 2:

```powershell
.\mvnw.cmd -pl services/product-service spring-boot:run
```

3. Terminal 3:

```powershell
cd frontend-react
npm.cmd run dev
```

Mo:

```text
http://localhost:5173
```

Neu backend chay dung, thanh trang thai tren UI se hien `Backend connected`.

## API Mau

- `POST http://localhost:8080/api/auth/register`
- `POST http://localhost:8080/api/auth/login`
- `GET http://localhost:8080/api/products`
- `POST http://localhost:8080/api/cart/items`
- `POST http://localhost:8080/api/orders`
- `POST http://localhost:8080/api/payments`
- `POST http://localhost:8080/api/notifications`
- `GET http://localhost:8080/api/deliveries/{orderId}`
- `GET http://localhost:8080/api/analytics/dashboard`

## WebSocket

Notification service dung WebSocket:

```text
ws://localhost:8087/ws/notifications
```

Gui thu thong bao:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:8087/api/notifications -ContentType "application/json" -Body '{"userId":1,"message":"Order #1 updated"}'
```
