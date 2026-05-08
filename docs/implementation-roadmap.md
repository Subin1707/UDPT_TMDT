# Implementation Roadmap

## Giai doan 1: Nen tang kien truc

- Hoan thien Maven multi-module.
- Chay rieng tung service tren port doc lap.
- Dinh tuyen request qua `api-gateway`.
- Tao response format dung chung trong `shared-lib`.

## Giai doan 2: Authentication

- Bo sung entity `User`, `Role`, `RefreshToken`.
- Luu user vao PostgreSQL bang Spring Data JPA.
- Ma hoa mat khau bang BCrypt.
- Xac thuc JWT tai Gateway.
- Phan quyen `USER`, `ADMIN`.

## Giai doan 3: Product, Cart, Order

- Xay dung CRUD san pham, category, inventory.
- Xay dung gio hang theo user.
- Tao don hang tu gio hang.
- Tru ton kho khi don hang duoc xac nhan.

## Giai doan 4: Payment va Delivery

- Mo phong thanh toan `COD`, `MOMO`, `VNPAY`.
- Cap nhat trang thai don hang sau thanh toan.
- Tao tracking giao hang.
- Dong bo trang thai `PACKING`, `SHIPPING`, `COMPLETED`.

## Giai doan 5: Realtime Notification

- Gui thong bao qua WebSocket khi don hang thay doi.
- Luu notification vao database.
- Hien thi realtime tren dashboard React.

## Giai doan 6: Dashboard, Docker, Testing

- Hoan thien dashboard quan tri.
- Them thong ke doanh thu, don hang, ton kho.
- Docker hoa tung service.
- Viet unit test va integration test cho flow dat hang.
