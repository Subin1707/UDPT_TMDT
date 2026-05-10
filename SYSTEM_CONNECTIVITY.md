# KIẾN TRÚC HỆ THỐNG & KẾT NỐI (SYSTEM ARCHITECTURE & CONNECTIVITY)

## 📐 KIẾN TRÚC TỔNG QUAN (OVERALL ARCHITECTURE)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                      │
│                       http://localhost:5173                          │
└────────────────────────┬────────────────────────────────────────────┘
                         │ HTTP/REST Calls
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (Spring Cloud)                        │
│                        Port 8080                                     │
│                                                                      │
│  - Route requests to appropriate services                           │
│  - CORS handling                                                    │
│  - Load balancing                                                   │
│  - Rate limiting (optional)                                         │
└────┬────────┬─────────┬─────────┬─────────┬──────────┬──────────┬──┘
     │        │         │         │         │          │          │
     ▼        ▼         ▼         ▼         ▼          ▼          ▼
  Auth    User      Product    Cart      Order      Payment    Delivery
  8081    8082      8083       8084      8085       8086       8087
  │        │         │         │         │          │          │
  └────────┴─────────┴─────────┴─────────┴──────────┴──────────┴──┐
                                                                   │
                          ▼ (Shared Library)
             ┌─────────────────────────────────┐
             │    shared-lib (Common DTOs,     │
             │    Entities, Utils)              │
             └─────────────────────────────────┘
                                                                   │
                    All services use shared-lib                    │
                         │                                        │
                         ▼                                        │
            ┌────────────────────────────┐                      │
            │   MySQL Database (3306)    │◄─────────────────────┘
            │   ├─ Auth DB               │
            │   ├─ Users DB              │
            │   ├─ Products DB           │
            │   ├─ Orders DB             │
            │   ├─ Payments DB           │
            │   ├─ Delivery DB           │
            │   └─ Notifications DB      │
            └────────────────────────────┘
                         ▲
                         │
            ┌────────────────────────────┐
            │   Redis Cache (6379)       │
            │   ├─ Sessions              │
            │   ├─ Cache Layer           │
            │   └─ Message Queue         │
            └────────────────────────────┘
```

---

## 🔄 DATA FLOW - QUẢN LÝ LUỒNG DỮ LIỆU

### 1. USER REGISTRATION & LOGIN FLOW

```
Frontend (Register Form)
    ↓
POST /api/auth/register
    ↓
API Gateway (8080)
    ↓
Route to Auth Service (8081)
    ↓
Auth Service:
  1. Validate input
  2. Hash password
  3. Save to users table
  4. Create role assignment
  5. Return user object
    ↓
Response to Frontend with JWT token
    ↓
Frontend stores token in localStorage
```

**Involved Tables:**
- `users` - Store user credentials
- `user_roles` - Store role assignments
- `roles` - Role definitions (ADMIN, CUSTOMER, SHIPPER)

---

### 2. PRODUCT LISTING FLOW

```
Frontend (Home Page)
    ↓
GET /api/products
    ↓
API Gateway (8080)
    ↓
Route to Product Service (8083)
    ↓
Product Service:
  1. Check Redis cache
  2. If not cached, query database
  3. Load from products table
  4. Fetch product_images
  5. Get inventory info
  6. Cache result in Redis
    ↓
Response with product list
    ↓
Frontend displays products
```

**Involved Tables:**
- `products` - Product information
- `product_images` - Product images
- `inventories` - Stock quantity
- `categories` - Product categories
- `brands` - Product brands

---

### 3. ADD TO CART FLOW

```
Frontend (authenticated user)
    ↓
POST /api/cart/add
Headers: Authorization: Bearer {token}
    ↓
API Gateway (8080)
    ↓
Validate JWT token
    ↓
Route to Cart Service (8084)
    ↓
Cart Service:
  1. Verify user from token
  2. Get product from Product Service
  3. Add to cart_items table
  4. Update Redis session
  5. Return updated cart
    ↓
Frontend updates cart display
```

**Involved Tables:**
- `cart_items` - Store cart items (per session/user)
- `products` - Get product details
- `inventories` - Verify stock

---

### 4. CREATE ORDER FLOW

```
Frontend (Checkout)
    ↓
POST /api/orders
Body: {items: [...], shipping_address_id, payment_method}
    ↓
API Gateway (8080)
    ↓
Route to Order Service (8085)
    ↓
Order Service:
  1. Validate items from Product Service
  2. Verify inventory
  3. Reserve quantities in inventory
  4. Create order record
  5. Create order_items records
  6. Clear cart
  7. Send to Payment Service
  8. Return order
    ↓
Response with order_id
    ↓
Frontend redirects to payment page
```

**Involved Tables:**
- `orders` - Order header
- `order_items` - Order line items
- `user_addresses` - Shipping address
- `inventories` - Reserve stock
- `products` - Product info

---

### 5. PAYMENT PROCESSING FLOW

```
Frontend (Payment Confirmation)
    ↓
POST /api/payments
Body: {order_id, amount, method}
    ↓
API Gateway (8080)
    ↓
Route to Payment Service (8086)
    ↓
Payment Service:
  1. Create payment record
  2. If VNPAY/MOMO: redirect to gateway
  3. If COD: mark as PENDING
  4. Store transaction details
  5. Update order status
  6. Send notification
    ↓
Response with payment status
```

**Involved Tables:**
- `payments` - Payment records
- `payment_transactions` - Transaction details
- `orders` - Update status

---

### 6. DELIVERY TRACKING FLOW

```
Order shipped
    ↓
Admin/Shipper app
    ↓
POST /api/deliveries/{orderId}/track
Body: {location, status, message}
    ↓
Route to Delivery Service (8087)
    ↓
Delivery Service:
  1. Update delivery status
  2. Store tracking location
  3. Send notification to user
  4. Update order status
    ↓
Frontend (Orders page)
GET /api/deliveries/{deliveryId}/tracking
    ↓
Display real-time tracking to customer
```

**Involved Tables:**
- `deliveries` - Delivery info
- `delivery_tracking` - GPS tracking
- `shippers` - Shipper info
- `orders` - Update status

---

## 🔐 SERVICE-TO-SERVICE COMMUNICATION

### Internal Service Calls (Services to Services)

```
Order Service → Product Service
  Purpose: Get product details, verify inventory
  Endpoint: GET /api/products/{id}
  
Order Service → Cart Service  
  Purpose: Clear cart after order creation
  Endpoint: DELETE /api/cart/clear
  
Payment Service → Order Service
  Purpose: Update order status after payment
  Endpoint: PUT /api/orders/{id}/status
  
Delivery Service → Order Service
  Purpose: Update order status and trigger notifications
  Endpoint: PUT /api/orders/{id}/status
  
Notification Service ← (all services)
  Purpose: Send notifications to users
  Endpoint: POST /api/notifications
```

---

## 🗄️ DATABASE SYNCHRONIZATION STRATEGY

### Tables by Service

| Service | Tables | Update Frequency |
|---------|--------|-----------------|
| **Auth Service** | roles, users, user_roles, refresh_tokens | On login/registration |
| **User Service** | users, user_addresses, wishlists | On profile update |
| **Product Service** | brands, categories, products, product_images, inventories, product_reviews | Daily sync |
| **Cart Service** | cart_items | Real-time |
| **Order Service** | orders, order_items, order_status_history | Real-time |
| **Payment Service** | payments, payment_transactions | Real-time |
| **Delivery Service** | shippers, deliveries, delivery_tracking | Real-time |
| **Notification Service** | notifications | Real-time |
| **Voucher Service** | vouchers, user_vouchers | Daily |

---

## ✅ TESTING CONNECTIVITY

### 1. Test Database Connection

```bash
# From container
docker exec ecommerce_mysql mysql -u root -proot defaultdb -e "SELECT 1;"

# From host (if MySQL client installed)
mysql -h localhost -u ecommerce -pecommerce defaultdb -e "SELECT 1;"
```

---

### 2. Test Service Registry

```bash
# Health check each service
curl http://localhost:8080/actuator/health  # API Gateway
curl http://localhost:8081/actuator/health  # Auth Service
curl http://localhost:8083/actuator/health  # Product Service
curl http://localhost:8084/actuator/health  # Cart Service
curl http://localhost:8085/actuator/health  # Order Service
curl http://localhost:8086/actuator/health  # Payment Service
curl http://localhost:8087/actuator/health  # Delivery Service
```

---

### 3. Test Service Discovery (if using Eureka/Consul)

```bash
# List registered services
curl http://localhost:8761/eureka/apps  # If using Eureka
```

---

### 4. Test Inter-Service Communication

```bash
# From one service, call another
# Inside Order Service container
curl http://api-gateway:8080/api/products

# Or using service name
curl http://product-service:8083/api/products
```

---

## 🚨 COMMON SYNCHRONIZATION ISSUES

### Issue 1: Services can't connect to database
**Symptoms:** Error logs show "Connection refused"
**Root Cause:** Database not running or wrong credentials
**Fix:** 
```bash
docker-compose restart mysql
# Verify credentials in application.yml
```

---

### Issue 2: Data inconsistency between services
**Symptoms:** Product counts don't match, orders missing data
**Root Cause:** Services using different database instances
**Fix:** Ensure all services use same MySQL instance
```bash
# In each application.yml:
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/defaultdb
    username: ecommerce
    password: ecommerce
```

---

### Issue 3: Orders not updating payment status
**Symptoms:** Order stuck in PENDING status
**Root Cause:** Payment Service not communicating with Order Service
**Fix:** Check inter-service communication
```bash
# Test Payment Service → Order Service
curl -X PUT http://localhost:8085/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "CONFIRMED"}'
```

---

### Issue 4: Frontend can't fetch data
**Symptoms:** 404 errors, CORS errors
**Root Cause:** API Gateway not routing correctly
**Fix:** Check gateway configuration
```bash
# Verify API Gateway is running
curl http://localhost:8080/actuator/routes

# Check CORS settings
# Verify application.yml has correct routing rules
```

---

## 📊 MONITORING CHECKLIST

- [ ] MySQL database online and accessible
- [ ] Redis cache running
- [ ] All 8 services started and healthy
- [ ] API Gateway routing requests correctly
- [ ] Services can communicate with each other
- [ ] Database tables populated with initial data
- [ ] Frontend connecting to backend API
- [ ] Authentication working (login/register)
- [ ] Products displaying on frontend
- [ ] Cart functionality operational
- [ ] Orders being created and saved
- [ ] Payment processing functional
- [ ] Delivery tracking working
- [ ] Notifications being sent

---

## 🔄 RECOMMENDED UPDATE SEQUENCE

When deploying changes:

1. **Update shared-lib first** (all services depend on it)
   ```bash
   ./mvnw -pl shared-lib clean install
   ```

2. **Update Auth Service** (other services need authentication)
   ```bash
   ./mvnw -pl services/auth-service clean install
   ```

3. **Update other services** (in any order)
   ```bash
   ./mvnw -pl services/{service-name} clean install
   ```

4. **Restart all services** in order
5. **Run tests** using test-sync.sh
6. **Verify frontend** still working

---

**Last Updated:** May 9, 2026
