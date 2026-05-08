# Architecture Overview

He thong duoc tach thanh cac service doc lap:

- `api-gateway`: diem vao chinh, dinh tuyen request den service phu hop.
- `auth-service`: dang ky, dang nhap, sinh JWT.
- `user-service`: quan ly ho so nguoi dung.
- `product-service`: san pham, danh muc, ton kho.
- `cart-service`: gio hang.
- `order-service`: tao don va quan ly trang thai don.
- `payment-service`: thanh toan mo phong.
- `notification-service`: WebSocket realtime.
- `delivery-service`: van chuyen va tracking.
- `analytics-service`: thong ke dashboard va goi y ban dau.

Luong xu ly don hang:

1. User tao don qua `order-service`.
2. `order-service` kiem tra san pham va tao don o trang thai `CREATED`.
3. `payment-service` xu ly thanh toan mo phong.
4. `notification-service` day thong bao realtime qua WebSocket.
5. `delivery-service` cap nhat trang thai giao hang.
