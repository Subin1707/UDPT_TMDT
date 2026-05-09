# Frontend HTML - Hướng Dẫn Cấu Trúc

## 📁 Tổ Chức Thư Mục

```
frontend-html/
├── index.html                    # Trang chủ
├── pages/
│   ├── login.html               # Đăng nhập
│   ├── register.html            # Đăng ký
│   ├── products.html            # Danh sách sản phẩm
│   ├── product-detail.html      # Chi tiết sản phẩm
│   ├── cart.html                # Giỏ hàng
│   ├── checkout.html            # Thanh toán
│   ├── orders.html              # Lịch sử đơn hàng
│   └── admin-dashboard.html     # Bảng điều khiển admin
├── css/
│   ├── common.css               # Styles toàn cục (header, buttons, forms)
│   ├── home.css                 # Styles trang chủ
│   ├── auth.css                 # Styles đăng nhập/đăng ký
│   ├── product-detail.css       # Styles chi tiết sản phẩm
│   ├── cart.css                 # Styles giỏ hàng
│   ├── checkout.css             # Styles thanh toán
│   ├── orders.css               # Styles lịch sử đơn hàng
│   └── admin.css                # Styles admin dashboard
└── js/
    ├── api.js                   # Lớp API (gọi backend)
    ├── auth.js                  # Lớp xác thực (login/logout)
    ├── cart.js                  # Lớp giỏ hàng (quản lý items)
    ├── common.js                # Hàm tiện ích chung
    ├── home.js                  # Logic trang chủ
    ├── products.js              # Logic danh sách sản phẩm
    ├── product-detail.js        # Logic chi tiết sản phẩm
    ├── cart-page.js             # Logic trang giỏ hàng
    ├── checkout.js              # Logic thanh toán
    ├── orders.js                # Logic lịch sử đơn hàng
    └── admin.js                 # Logic admin dashboard
```

## 🔗 Luồng HTML Imports

Mỗi page HTML import theo thứ tự này:
```html
1. <script src="/js/common.js"></script>      <!-- Hàm tiện ích -->
2. <script src="/js/api.js"></script>         <!-- API layer -->
3. <script src="/js/auth.js"></script>        <!-- Auth system -->
4. <script src="/js/cart.js"></script>        <!-- Cart system (nếu cần) -->
5. <script src="/js/{page}.js"></script>      <!-- Page-specific logic -->
```

**Lý do thứ tự này:**
- `common.js` phải load trước (có hàm tiện ích dùng chung)
- `api.js` cần hàm từ `common.js`
- `auth.js` cần `api.js` để login/logout
- `cart.js` độc lập nhưng cần load nếu page dùng cart
- Page script load cuối cùng để có tất cả dependency

## 🎯 Các Trang Chính

### 1. **index.html** - Trang Chủ
- **Mục đích:** Hiển thị hero section + sản phẩm nổi bật
- **CSS:** `home.css` + `common.css`
- **JS:** `home.js`
- **API calls:** `productAPI.getAll(1, 6)` - lấy 6 sản phẩm
- **Tương tác:** Click "Thêm vào giỏ" → thêm item vào giỏ (localStorage)

### 2. **pages/login.html** - Đăng Nhập
- **Mục đích:** Form đăng nhập email/password
- **CSS:** `auth.css` + `common.css`
- **JS:** Xử lý form, gọi `auth.login()`
- **Lưu trữ:** Token + user info vào localStorage
- **Redirect:** Về trang chủ sau đăng nhập

### 3. **pages/register.html** - Đăng Ký
- **Mục đích:** Form đăng ký (fullName, email, phone, password)
- **CSS:** `auth.css` + `common.css`
- **JS:** Xử lý form, gọi `auth.register()`
- **Validation:** Kiểm tra password match
- **Redirect:** Về trang chủ sau đăng ký

### 4. **pages/products.html** - Danh Sách Sản Phẩm
- **Mục đích:** Hiển thị tất cả sản phẩm (20 items/page)
- **CSS:** `home.css` (grid layout) + `common.css`
- **JS:** `products.js` - fetch & render grid
- **Tương tác:** Click sản phẩm → product-detail page

### 5. **pages/product-detail.html** - Chi Tiết Sản Phẩm
- **Mục đích:** Chi tiết 1 sản phẩm, chọn số lượng, thêm giỏ
- **CSS:** `product-detail.css` + `common.css`
- **JS:** `product-detail.js`
- **Input:** `?id={productId}` từ URL
- **Tương tác:** ±1 quantity → "Thêm vào giỏ"

### 6. **pages/cart.html** - Giỏ Hàng
- **Mục đích:** Xem items, thay đổi size, xóa item
- **CSS:** `cart.css` + `common.css`
- **JS:** `cart-page.js` - render từ localStorage
- **Tương tác:** Adjust quantity → cập nhật total, "Thanh toán" → checkout page

### 7. **pages/checkout.html** - Thanh Toán
- **Mục đích:** Nhập địa chỉ, chọn payment, tạo order
- **CSS:** `checkout.css` + `common.css`
- **JS:** `checkout.js` - validate form, submit order
- **Flow:** Form submit → call `orderAPI.create()` → clear cart → orders.html

### 8. **pages/orders.html** - Lịch Sử Đơn Hàng
- **Mục đích:** Xem tất cả đơn hàng của user
- **CSS:** `orders.css` + `common.css`
- **JS:** `orders.js` - fetch từ `orderAPI.getOrders()`
- **Hiển thị:** Order ID, status badge, total, date, address
- **Yêu cầu:** Phải đăng nhập

### 9. **pages/admin-dashboard.html** - Admin Dashboard
- **Mục đích:** Thống kê tổng revenue, đơn hàng, sản phẩm
- **CSS:** `admin.css` + `common.css`
- **JS:** `admin.js` - fetch orders & products, tính toán
- **Hiển thị:** 4 stat cards + 10 đơn hàng gần đây
- **Yêu cầu:** Phải có role ADMIN

## 🔧 Các File JS Chính

### **js/api.js**
Chat với backend. Tất cả HTTP requests qua đây.

```javascript
// Cấu trúc:
async function apiCall(endpoint, options = {}) 
  ↓ (tự động inject JWT token từ localStorage)
  
// Objects exported:
window.productAPI = {
  getAll(page, limit)
  getById(id)
}
window.authAPI = {
  login(email, password)
  register(fullName, email, phone, password)
  logout()
}
window.cartAPI = {
  sync(items)
}
window.orderAPI = {
  getOrders()
  create(data)
}
```

### **js/auth.js**
Quản lý trạng thái login/logout.

```javascript
class Auth {
  isLoggedIn()           // true/false
  isAdmin()              // true/false nếu user.role === 'ADMIN'
  login(email, pwd)      // POST /auth/login
  logout()               // clear localStorage
  updateUI()             // render navbar (Orders, Admin, Logout buttons)
}
// Global instance: window.auth
```

### **js/cart.js**
Quản lý giỏ hàng ở client-side (localStorage).

```javascript
class Cart {
  addItem(product, quantity)     // thêm vào giỏ
  removeItem(productId)          // xóa khỏi giỏ
  updateQuantity(productId, qty) // thay đổi số lượng
  getItems()                     // lấy tất cả items
  getTotal()                     // tính tổng tiền
  clear()                        // xóa giỏ
}
// Global instance: window.cart
```

### **js/common.js**
Hàm tiện ích dùng chung.

```javascript
$('#id')               // querySelector
$$('selector')         // querySelectorAll
createElement(tag)     // tạo element

formatCurrency(num)    // 123456 → "$123,456.00"
formatDate(date)       // ISO date → "12/25/2024"

showLoading(el)        // hiển thị spinner
showError(el, msg)     // hiển thị lỗi (đỏ)
showToast(msg, type)   // toast notification

redirect(url)          // chuyển trang
getUrlParam(key)       // lấy query param từ URL
```

## 📡 Backend API Endpoints

Frontend dùng endpoints này (configure ở `js/api.js`):

```javascript
// Sản phẩm
GET    /api/products?page=1&limit=20

// Xác thực
POST   /api/auth/login           { email, password }
POST   /api/auth/register        { fullName, email, phone, password }
POST   /api/auth/logout

// Đơn hàng
GET    /api/orders               (require login)
POST   /api/orders               { items, shipping_address, note, ... }

// Giỏ hàng (optional - frontend dùng localStorage)
POST   /api/cart/sync
```

## 💾 LocalStorage Keys

Frontend lưu vào browser storage:

```javascript
authToken      // JWT token
user           // { id, email, full_name, role, phone }
cart           // { items: [...], total: ... }
cartItems      // (legacy) items array
```

## 🎨 Styling System

**Color Palette:**
- Primary: `#2563eb` (blue)
- Dark: `#0f172a` (dark blue)
- Light bg: `#f8fafc` (light)
- Border: `rgba(148, 163, 184, 0.14)` (slate)

**Responsive Breakpoints:**
```css
1180px - max container width
900px  - tablet (3→2 columns)
640px  - mobile (2→1 column)
```

## 🚀 Sử Dụng

1. **Phát triển cục bộ:**
   ```bash
   # Serve folder backend API running at http://localhost:8080
   npx http-server frontend-html -p 3000
   ```

2. **Cấu hình API URL:**
   - Edit `js/api.js`  dòng: `const API_BASE = 'http://localhost:8080/api'`

3. **Testing:**
   - Open http://localhost:3000 → trang chủ
   - Click login/register → test auth flow
   - Add to cart → test cart
   - Checkout → test order creation

## ✅ Checklist Triển Khai

- [ ] Backend API chạy tại `http://localhost:8080/api`
- [ ] Config API_BASE ở `js/api.js` đúng
- [ ] Test login/register flow
- [ ] Test product loading
- [ ] Test cart add/remove
- [ ] Test checkout → order creation
- [ ] Test orders page (see own orders)
- [ ] Test admin page (if ADMIN role)
- [ ] Deploy static files to web server (nginx/apache/S3)

---

**Ghi chú:** Đây là pure HTML+CSS+JavaScript (no build tools). Mọi file có thể edit trực tiếp và reload page để thấy thay đổi.
