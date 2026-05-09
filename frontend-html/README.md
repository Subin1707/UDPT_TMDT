# Frontend HTML5 - E-Commerce

**Pure HTML + CSS + JavaScript Frontend** (No React, No Build Tools)

Đây là frontend đơn giản, dễ maintain, không cần JSX hay build tools. Mỗi page là 1 file HTML riêng với CSS + JS riêng.

## 📋 Quick Start

### 1. Prerequisites
- Backend API running at `http://localhost:8080/api`
- Node.js hoặc Python (để serve static files)

### 2. Run Frontend
```bash
# Option 1: Node.js HTTP Server
npx http-server frontend-html -p 3000

# Option 2: Python
cd frontend-html
python3 -m http.server 3000

# Option 3: Nginx
# Copy frontend-html folder → /var/www/ecommerce
```

### 3. Access
```
http://localhost:3000
```

## 📁 Cấu Trúc

- `index.html` - Trang chủ
- `pages/` - 9 trang chính (login, register, products, cart, checkout, orders, admin, ...)
- `css/` - 8 file CSS (global + per-page)
- `js/` - 11 file JS (api, auth, cart, common + per-page logic)

**Chi tiết:** Xem [STRUCTURE_GUIDE.md](./STRUCTURE_GUIDE.md)

## 🔑 Tính năng

✅ Xác thực (Login/Register)
✅ Duyệt sản phẩm
✅ Chi tiết sản phẩm
✅ Giỏ hàng (LocalStorage)
✅ Thanh toán
✅ Lịch sử đơn hàng
✅ Admin Dashboard
✅ Responsive Design

## 🔧 Config

**Edit API URL** (`js/api.js`):
```javascript
const API_BASE = 'http://your-backend:8080/api'
```

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🎨 Design

- Responsive (mobile-first)
- Modern gradient UI
- 8-color palette
- CSS Grid + Flexbox

## 📖 Tài Liệu

- [STRUCTURE_GUIDE.md](./STRUCTURE_GUIDE.md) - Hướng dẫn chi tiết cấu trúc
- Inline comments trong mỗi file

## 🚀 Deployment

### Nginx
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/ecommerce/frontend-html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Docker
```dockerfile
FROM nginx:alpine
COPY frontend-html /usr/share/nginx/html
EXPOSE 80
```

## ⚠️ Lưu ý

- Tất cả state (cart, auth) lưu ở localStorage - KHÔNG production-safe
- JWT token lưu ở localStorage - KHÔNG secure cho data sensitive
- CORS phải được setup ở backend
- Cart sync cuối cùng khi checkout (tạm thời)

## 🤝 Phát Triển

1. Edit `.html` file, reload browser
2. CSS thay đổi → reload browser
3. JS thay đổi → hard refresh (Ctrl+Shift+R)

**No build step needed!** ⚡

## 📋 TODO

- [ ] Real-time notifications (WebSocket)
- [ ] Payment gateway integration
- [ ] Product image optimization
- [ ] Search + filtering
- [ ] User profile page
- [ ] Review/rating system

---

**Created:** 2024 | **Type:** Pure HTML5+CSS+JS | **License:** MIT
