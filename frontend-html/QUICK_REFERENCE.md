# 🚀 Frontend HTML - Quick Reference

## ✅ Hoàn Thành

**30 Files Created:**
- ✅ 9 HTML Pages
- ✅ 8 CSS Files
- ✅ 11 JS Files
- ✅ 2 Documentation Files

---

## 📄 HTML Pages

| File | Mục đích | Require Login | Role |
|------|---------|--------------|------|
| `index.html` | Trang chủ | ❌ | Any |
| `pages/login.html` | Đăng nhập | ❌ | Any |
| `pages/register.html` | Đăng ký | ❌ | Any |
| `pages/products.html` | Danh sách sản phẩm | ❌ | Any |
| `pages/product-detail.html` | Chi tiết sản phẩm | ❌ | Any |
| `pages/cart.html` | Giỏ hàng | ❌ | Any |
| `pages/checkout.html` | Thanh toán | ✅ Required | User |
| `pages/orders.html` | Lịch sử đơn hàng | ✅ Required | User |
| `pages/admin-dashboard.html` | Dashboard admin | ✅ Required | Admin |

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────┐
│           HTML Pages (User Interface)       │ ← User interacts here
├─────────────────────────────────────────────┤
│    Page-Specific JS (home.js, cart.js)      │ ← Page logic
├─────────────────────────────────────────────┤
│        Shared Modules (auth, cart, api)     │ ← Reusable code
├─────────────────────────────────────────────┤
│        Common Utilities (formatting, DOM)   │ ← Helper functions
├─────────────────────────────────────────────┤
│              Backend API (REST)             │ ← Database
└─────────────────────────────────────────────┘
```

---

## 🔄 Page Flow

### Unauthenticated User Path
```
index.html → products.html → product-detail.html → cart.html 
                                                        ↓
                                                 (Must Login)
                                                        ↓
                                                  login.html →
                                                        ↓
                                                  checkout.html
```

### Authenticated User Path
```
index.html → products.html → product-detail.html → cart.html 
                                                        ↓
                                                  checkout.html →
                                                        ↓
                                                   orders.html
```

### Admin Path
```
index.html → ... → admin-dashboard.html (stats + recent orders)
```

---

## 🔌 API Integration

**Each page calls backend:**

| Page | Endpoint | Method |
|------|----------|--------|
| `index.html` | `/api/products?limit=6` | GET |
| `login.html` | `/api/auth/login` | POST |
| `register.html` | `/api/auth/register` | POST |
| `products.html` | `/api/products?page=X` | GET |
| `product-detail.html` | `/api/products/{id}` | GET |
| `checkout.html` | `/api/orders` | POST |
| `orders.html` | `/api/orders` | GET |
| `admin.html` | `/api/orders`, `/api/products` | GET |

---

## 💾 LocalStorage Usage

```javascript
// Auth tokens & user info
localStorage.getItem('authToken')      // JWT token
localStorage.getItem('user')           // { id, email, role, ... }

// Cart state
localStorage.getItem('cart')           // { items: [...], total: ... }
```

---

## 🎯 Common Tasks

### Add Product to Cart
```javascript
// Anywhere in JS:
if (cart) {
  cart.addItem(product, quantity)
  showToast('Đã thêm vào giỏ hàng')
  updateCartBadge()
}
```

### Check if User is Admin
```javascript
if (auth.isAdmin()) {
  // Show admin features
}
```

### Get Product by URL
```javascript
const productId = getUrlParam('id')
const product = await productAPI.getById(productId)
```

### Format Values
```javascript
formatCurrency(123456)  // "$123,456.00"
formatDate('2024-01-15')  // "01/15/2024"
```

### Show Loading State
```javascript
showLoading(element)  // Show spinner
// ... fetch data ...
element.innerHTML = result
```

---

## 🔐 Security Notes

⚠️ **NOT Production-Ready Features:**
- JWT token in localStorage (can be stolen via XSS)
- Cart state only client-side (can be manipulated)
- No CSRF protection on forms
- No input sanitization

✅ **For Production, Add:**
- httpOnly cookies for JWT
- CSRF tokens
- Input validation/sanitization
- HTTPS only
- Server-side cart validation

---

## 📱 Responsive Design

**Breakpoints:**
```css
1180px - Max container width
900px  - iPad horizontal (3→2 columns)
640px  - Mobile (2→1 column)
< 400px- Extra small (full width)
```

All pages are **mobile-first** with proper viewport meta tag.

---

## 🎨 CSS Variables & Colors

**Primary Colors:**
```css
#2563eb   - Blue (primary)
#0f172a   - Dark blue (text)
#f8fafc   - Light (background)
#ef4444   - Red (danger/alert)
#10b981   - Green (success)
#f59e0b   - Amber (warning)
```

**Reusable Utility Classes:**
```html
<div class="container">        <!-- max-width wrapper -->
<div class="grid grid-2">      <!-- 2-column grid -->
<div class="grid grid-3">      <!-- 3-column grid -->
<button class="btn">           <!-- Primary button -->
<button class="btn btn-small"> <!-- Small button -->
```

---

## 🧪 Testing Checklist

- [ ] Homepage loads products
- [ ] Register creates new user
- [ ] Login with correct credentials
- [ ] Add product to cart
- [ ] Remove from cart
- [ ] Update quantity
- [ ] Checkout creates order
- [ ] Orders page shows user's orders
- [ ] Admin page shows stats (if admin)
- [ ] Navbar updates on login/logout
- [ ] Mobile responsive

---

## 🚀 Deploy

### Quick Local Test
```bash
cd frontend-html
python3 -m http.server 3000
# Open http://localhost:3000
```

### Deploy to Nginx
```bash
sudo cp -r frontend-html /var/www/ecommerce/
sudo nginx -s reload
# Access http://your-server-ip
```

### Deploy to Cloud (Vercel, Netlify)
```bash
# Push entire frontend-html folder
# Simple deployment - pure static files
```

---

## 📚 File Dependencies

```
common.js          (independent - load first)
    ↓
api.js             (needs: common.js)
    ↓
auth.js            (needs: api.js, common.js)
    ↓
cart.js            (independent - any time)
    ↓
page-specific.js   (needs all above)
```

**Load scripts in this order in every HTML page.**

---

## ❓ FAQ

### Q: Giỏ hàng của tôi mất khi refresh?
A: Không, localStorage giữ dữ liệu. Check DevTools → Application → LocalStorage

### Q: Sao không thể add to cart?
A: Phải load `cart.js` trước. Check console cho errors.

### Q: Admin page trống?
A: Cần role='ADMIN' từ backend. Check user object: `auth.user.role`

### Q: Sao API lỗi?
A: Kiểm tra API_BASE ở `js/api.js`, backend phải running, CORS phải enabled

### Q: Làm sao thêm trang mới?
A: 1. Tạo `pages/new.html`, 2. Tạo `css/new.css`, 3. Tạo `js/new.js`, 4. Link từ navbar

---

## 📞 Support

**Issues?**
1. Check browser console (F12)
2. Check network tab (XHR requests)
3. Verify API_BASE in `js/api.js`
4. Ensure backend API is running

**Need help?** Read [STRUCTURE_GUIDE.md](./STRUCTURE_GUIDE.md)

---

**Last Updated:** 2024 | **Status:** ✅ Complete
