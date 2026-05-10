# HỆNG THỐNG ĐỒNG BỘ VÀ TEST - SYSTEM SYNCHRONIZATION & TESTING GUIDE

## 📋 MỤC LỤC (TABLE OF CONTENTS)

1. [Khởi động hệ thống](#khởi-động-hệ-thống)
2. [Kiểm tra kết nối cơ sở dữ liệu](#kiểm-tra-kết-nối-cơ-sở-dữ-liệu)
3. [Test các services](#test-các-services)
4. [Kiểm tra đồng bộ dữ liệu](#kiểm-tra-đồng-bộ-dữ-liệu)
5. [Test frontend kết nối backend](#test-frontend-kết-nối-backend)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 KHỞI ĐỘNG HỆ THỐNG (SYSTEM STARTUP)

### 1️⃣ START DATABASE & REDIS SERVICES

**Dùng Docker Compose:**
```bash
cd /workspaces/UDPT_TMDT/docker
docker-compose up -d
```

**Kiểm tra services đã start:**
```bash
docker-compose ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE           STATUS
xxx            mysql:8.0       Up (healthy)
xxx            redis:7-alpine  Up (healthy)
```

**Kết nối MySQL để verify data:**
```bash
docker exec -it ecommerce_mysql mysql -u root -p
# Password: root

# Inside MySQL:
USE defaultdb;
SHOW TABLES;
SELECT COUNT(*) FROM roles;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM products;
```

---

### 2️⃣ BUILD & START BACKEND SERVICES

**Build tất cả services:**
```bash
cd /workspaces/UDPT_TMDT
export JAVA_HOME=/home/codespace/java/21.0.10-ms
./mvnw clean install -DskipTests -q
```

**Start services (một cách):**

**Option A - Sequential (tuần tự):**
```bash
# Terminal 1 - API Gateway
./mvnw -pl services/api-gateway spring-boot:run

# Terminal 2 - Auth Service
./mvnw -pl services/auth-service -am spring-boot:run

# Terminal 3 - Product Service
./mvnw -pl services/product-service -am spring-boot:run

# Terminal 4 - Cart Service
./mvnw -pl services/cart-service -am spring-boot:run

# Terminal 5 - Order Service
./mvnw -pl services/order-service -am spring-boot:run

# Terminal 6 - Payment Service
./mvnw -pl services/payment-service -am spring-boot:run
```

**Option B - Sử dụng script:**
```bash
./start-services-v2.sh
```

**Service Ports:**
| Service | Port | Health Check |
|---------|------|-------------|
| API Gateway | 8080 | http://localhost:8080/actuator/health |
| Auth Service | 8081 | http://localhost:8081/actuator/health |
| User Service | 8082 | http://localhost:8082/actuator/health |
| Product Service | 8083 | http://localhost:8083/actuator/health |
| Cart Service | 8084 | http://localhost:8084/actuator/health |
| Order Service | 8085 | http://localhost:8085/actuator/health |
| Payment Service | 8086 | http://localhost:8086/actuator/health |
| Delivery Service | 8087 | http://localhost:8087/actuator/health |
| Notification Service | 8088 | http://localhost:8088/actuator/health |

---

### 3️⃣ START FRONTEND

```bash
cd /workspaces/UDPT_TMDT/frontend-react
npm install
npm run dev
```

**Frontend Access:** http://localhost:5173

---

## 🔍 KIỂM TRA KẾT NỐI CƠ SỞ DỮ LIỆU (DATABASE CONNECTIVITY CHECK)

### Quick Health Check Script

```bash
#!/bin/bash

echo "================================"
echo "SYSTEM HEALTH CHECK"
echo "================================"
echo ""

# Check MySQL
echo "🗄️  Checking MySQL..."
if mysql -h localhost -u ecommerce -pecommerce defaultdb -e "SELECT 1" &> /dev/null; then
    echo "✓ MySQL connected"
    mysql -h localhost -u ecommerce -pecommerce defaultdb -e "SELECT COUNT(*) as 'Total Tables' FROM information_schema.tables WHERE table_schema='defaultdb';"
else
    echo "✗ MySQL connection failed"
fi
echo ""

# Check Redis
echo "🔴 Checking Redis..."
if redis-cli -p 6379 ping &> /dev/null; then
    echo "✓ Redis connected"
else
    echo "✗ Redis connection failed"
fi
echo ""

# Check Services
echo "⚙️  Checking Services..."
declare -a services=("8080" "8081" "8083" "8084" "8085")
declare -a names=("API Gateway" "Auth" "Product" "Cart" "Order")

for i in "${!services[@]}"; do
    port=${services[$i]}
    name=${names[$i]}
    if curl -s http://localhost:$port/actuator/health | grep -q "UP"; then
        echo "✓ $name (port $port) - UP"
    else
        echo "✗ $name (port $port) - DOWN"
    fi
done
```

---

## ✅ TEST CÁC SERVICES

### 1. AUTH SERVICE - Test Đăng ký & Đăng nhập

**Register (Đăng ký):**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "full_name": "John Doe"
  }'
```

**Response Expected:**
```json
{
  "message": "Registration successful",
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe"
}
```

**Login (Đăng nhập):**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

**Response Expected:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "xxx",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

**Save token cho test tiếp theo:**
```bash
export TOKEN="your_jwt_token_here"
```

---

### 2. PRODUCT SERVICE - Test Lấy danh sách sản phẩm

**Get All Products (Lấy tất cả sản phẩm):**
```bash
curl -X GET http://localhost:8080/api/products
```

**Get Product Detail (Chi tiết sản phẩm):**
```bash
curl -X GET http://localhost:8080/api/products/1
```

**Response Expected:**
```json
{
  "id": 1,
  "name": "Wireless Keyboard",
  "price": 390000,
  "description": "Keyboard",
  "status": "ACTIVE",
  "quantity": 100
}
```

---

### 3. CART SERVICE - Test Giỏ hàng

**Add to Cart (Thêm vào giỏ):**
```bash
curl -X POST http://localhost:8080/api/cart/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

**Get Cart (Lấy giỏ hàng):**
```bash
curl -X GET http://localhost:8080/api/cart \
  -H "Authorization: Bearer $TOKEN"
```

**Remove from Cart (Xóa khỏi giỏ):**
```bash
curl -X DELETE http://localhost:8080/api/cart/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 4. ORDER SERVICE - Test Đơn hàng

**Create Order (Tạo đơn hàng):**
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 2}
    ],
    "shipping_address_id": 1,
    "payment_method": "COD"
  }'
```

**Get Order List (Danh sách đơn hàng):**
```bash
curl -X GET http://localhost:8080/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

**Get Order Detail (Chi tiết đơn hàng):**
```bash
curl -X GET http://localhost:8080/api/orders/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

### 5. PAYMENT SERVICE - Test Thanh toán

**Create Payment (Tạo thanh toán):**
```bash
curl -X POST http://localhost:8080/api/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "amount": 780000,
    "method": "VNPAY"
  }'
```

---

### 6. DELIVERY SERVICE - Test Giao hàng

**Get Delivery Status (Trạng thái giao hàng):**
```bash
curl -X GET http://localhost:8080/api/deliveries/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 KIỂM TRA ĐỒNG BỘ DỮ LIỆU (DATA SYNCHRONIZATION CHECK)

### Database Consistency Check

```sql
-- Kiểm tra số lượng records
SELECT 'Users' as Type, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Deliveries', COUNT(*) FROM deliveries;

-- Kiểm tra referential integrity
-- Các order phải có user
SELECT COUNT(*) FROM orders WHERE user_id NOT IN (SELECT id FROM users);

-- Các payment phải có order
SELECT COUNT(*) FROM payments WHERE order_id NOT IN (SELECT id FROM orders);

-- Kiểm tra tổng số sản phẩm
SELECT COUNT(*) FROM products WHERE status = 'ACTIVE';

-- Kiểm tra inventory
SELECT p.id, p.name, i.quantity FROM products p 
LEFT JOIN inventories i ON p.id = i.product_id 
WHERE p.status = 'ACTIVE';
```

---

## 🌐 TEST FRONTEND KẾT NỐI BACKEND (FRONTEND-BACKEND INTEGRATION)

### 1. Kiểm tra API Configuration

**File to check:** `frontend-react/src/services/api.js`

```javascript
// Verify API base URL
const API_BASE_URL = 'http://localhost:8080/api';
```

### 2. Test Flow trong Frontend

**Home Page (Trang chủ):**
- [ ] Load sản phẩm từ Product Service
- [ ] Hiển thị danh sách sản phẩm
- [ ] Có thể click vào sản phẩm

**Login/Register:**
- [ ] Form đăng ký hoạt động
- [ ] Gửi request đến Auth Service
- [ ] Lưu token vào localStorage
- [ ] Redirect đến trang chính

**Products Page (Trang sản phẩm):**
- [ ] Load tất cả sản phẩm
- [ ] Filter theo category
- [ ] Phân trang
- [ ] Add to Cart

**Cart Page (Trang giỏ hàng):**
- [ ] Hiển thị items trong giỏ
- [ ] Update quantity
- [ ] Remove item
- [ ] Calculate total price

**Checkout:**
- [ ] Load user addresses
- [ ] Select shipping address
- [ ] Select payment method
- [ ] Create order

**Orders Page (Trang đơn hàng):**
- [ ] Hiển thị danh sách order
- [ ] Hiển thị chi tiết order
- [ ] Hiển thị trạng thái giao hàng

### 3. Browser Console Checks

Mở Browser DevTools (F12) và check:

```javascript
// Kiểm tra localStorage
console.log(localStorage.getItem('token'));

// Kiểm tra requests
// Xem Network tab để verify API calls

// Kiểm tra response status
// Tất cả requests phải return 200-299 status
```

---

## 🔧 TROUBLESHOOTING

### Problem 1: Unable to connect to MySQL

**Diagnosis:**
```bash
# Check if MySQL container is running
docker ps | grep mysql

# Check MySQL logs
docker logs ecommerce_mysql

# Check port
netstat -an | grep 3306
```

**Solution:**
```bash
# Stop and restart
docker-compose down
docker-compose up -d

# Wait for MySQL to be healthy
docker-compose ps
```

---

### Problem 2: Services not connecting to database

**Check service logs:**
```bash
# Check for connection errors
grep -i "connection" /tmp/auth-service.log
grep -i "database" /tmp/product-service.log

# Or if running in terminal, check console output
```

**Verify application.yml:**
- Ensure database credentials match docker-compose.yml
- Check: `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`

---

### Problem 3: CORS errors when frontend calls backend

**Check API Gateway CORS configuration:**

**File:** `services/api-gateway/src/main/resources/application.yml`

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:5173"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true
```

---

### Problem 4: JWT Token expired or invalid

**Solution:**
- Clear localStorage in browser
- Re-login to get new token
- Verify token expiration time in Auth Service

---

### Problem 5: Data not syncing between services

**Check:**
```bash
# Verify all services are running
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8083/actuator/health

# Check if event publishing is working
# Look for Kafka/RabbitMQ logs if using message queue

# Verify database tables exist
mysql -h localhost -u ecommerce -pecommerce defaultdb -e "SHOW TABLES;"
```

---

## 📝 TESTING CHECKLIST (DANH SÁCH KIỂM TRA)

- [ ] MySQL running and healthy
- [ ] Redis running and healthy
- [ ] All backend services started
- [ ] Auth Service login working
- [ ] Product Service returning data
- [ ] Cart Service adding items
- [ ] Order Service creating orders
- [ ] Payment Service processing
- [ ] Frontend loading and connecting to API
- [ ] Frontend login working
- [ ] Products displaying on frontend
- [ ] Cart functionality working
- [ ] Checkout process complete
- [ ] Orders visible after purchase
- [ ] Delivery tracking working

---

## 🎯 QUICK START COMMAND

```bash
#!/bin/bash
set -e

echo "🚀 Starting E-Commerce System..."

# Start Database
cd /workspaces/UDPT_TMDT/docker
docker-compose up -d
echo "✓ Database & Redis started"
sleep 5

# Build services
cd /workspaces/UDPT_TMDT
export JAVA_HOME=/home/codespace/java/21.0.10-ms
./mvnw clean install -DskipTests -q &
echo "✓ Building services..."
wait

# Start frontend
cd frontend-react
npm install > /dev/null 2>&1 &
echo "✓ Frontend dependencies installing..."

echo ""
echo "=========================================="
echo "System starting. Open in new terminals:"
echo "=========================================="
echo "1. Services: cd /workspaces/UDPT_TMDT && ./start-services-v2.sh"
echo "2. Frontend: cd /workspaces/UDPT_TMDT/frontend-react && npm run dev"
echo ""
echo "Endpoints:"
echo "- API Gateway: http://localhost:8080"
echo "- Frontend: http://localhost:5173"
echo "- MySQL: localhost:3306"
echo "- Redis: localhost:6379"
```

---

## 📞 SUPPORT

**If something not working:**

1. Check logs: `docker logs ecommerce_mysql`
2. Verify ports: `netstat -an | grep LISTEN`
3. Test database: `mysql -h localhost -u ecommerce -pecommerce defaultdb`
4. Restart services: `docker-compose restart`

---

**Last Updated:** May 9, 2026
**Database:** MySQL 8.0
**Frontend:** React + Vite
**Backend:** Spring Boot Microservices
