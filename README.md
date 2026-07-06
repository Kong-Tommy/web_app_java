# shopVN - Webapp bán hàng (Spring Boot + React)

Webapp thương mại điện tử theo tông màu Shopee. Backend Java Spring Boot (JWT auth, REST API,
Swagger), frontend React + Vite. Dữ liệu gốc theo sum2025productinventorydb, mở rộng thêm
Customer / Cart / Orders để có trải nghiệm mua hàng đầy đủ.

## Cấu trúc project

```
Project_java/
  backend/     Spring Boot API (Java 17, Maven)
  frontend/    React + Vite storefront + trang quản trị
  database/    schema.sql (MySQL)
  postman/     Postman collection (10 test case)
```

## 1. Chuẩn bị Database (MySQL)

Cần có MySQL 8.x đang chạy (ví dụ qua XAMPP/Docker/MySQL Installer).

```bash
mysql -u root -p < database/schema.sql
```

Script sẽ tạo database `webappjava` với các bảng: `SystemAccounts`, `Category`,
`Product`, `Customer`, `CartItem`, `Orders`, `OrderItem`, kèm dữ liệu mẫu.

Tài khoản nhân viên demo (mật khẩu chung: `123456`):

| Email | Role |
|---|---|
| admin@system.com | admin (full CRUD) |
| manager@system.com | manager (full CRUD) |
| analyst1... -> analyst@system.com | analyst (chỉ đọc) |
| user1@system.com | role thường - KHÔNG được cấp token |

## 2. Chạy Backend (Spring Boot)

Yêu cầu: JDK 17+ và Maven (hoặc dùng IDE như IntelliJ/Eclipse đã tích hợp Maven).

Sửa thông tin kết nối DB tại `backend/src/main/resources/application.yml` nếu cần
(user/password MySQL):

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/webappjava
    username: root
    password: 123456
```

Chạy:

```bash
cd backend
mvn spring-boot:run
```

Backend chạy tại `http://localhost:8080`.

- Swagger UI: http://localhost:8080/swagger-ui.html
- Login nhân viên: `POST /api/auth`
- Login/đăng ký khách hàng: `POST /api/customer/auth/login`, `POST /api/customer/auth/register`

### Các API chính (theo đúng đề bài)

| Method | Endpoint | Quyền |
|---|---|---|
| POST | /api/auth | Public - login nhân viên |
| GET | /api/products | admin, manager, analyst, customer |
| GET | /api/products/{id} | admin, manager, analyst, customer |
| GET | /api/products/search?name=&category= | admin, manager, analyst, customer |
| POST | /api/products | admin, manager |
| PUT | /api/products/{id} | admin, manager |
| DELETE | /api/products/{id} | admin only |

Lỗi trả về theo format:
```json
{ "errorCode": "PR40001", "message": "Product name is required" }
```

### API mở rộng cho webapp bán hàng (ngoài đề bài)

- `GET /api/shop/products`, `/api/shop/products/{id}`, `/api/shop/products/search`,
  `/api/shop/categories` - xem sản phẩm public, không cần đăng nhập.
- `POST/GET/PUT/DELETE /api/cart/**` - giỏ hàng (cần đăng nhập khách hàng).
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/{id}` - đặt hàng / xem đơn hàng.
- `GET /api/customer/profile`, `PUT /api/customer/profile` - xem/sửa thông tin cá nhân khách hàng.
- `GET /api/admin/orders`, `PUT /api/admin/orders/{id}/status` - quản trị đơn hàng (admin/manager).

## 3. Chạy Frontend (React + Vite)

Yêu cầu: Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

Logo
- Logo: `frontend/src/components/Logo.jsx` (component SVG, có biến thể `onOrange`/`onLight`).
- Ảnh sản phẩm: `frontend/public/products/*.svg` (electronics, wearables, home-appliances, books, gaming).
- Favicon: `frontend/public/favicon.svg`.

Mở `http://localhost:5173`.

- Trang khách hàng: trang chủ, tìm kiếm, chi tiết sản phẩm, giỏ hàng, thanh toán, đơn hàng,
  thông tin tài khoản (`/profile`).
- Trang quản trị (`/admin/login`): đăng nhập bằng tài khoản nhân viên (admin/manager/analyst),
  quản lý sản phẩm và đơn hàng.

Biến môi trường `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## 4. Postman test suite

Import `postman/Sum2025Shop_API.postman_collection.json` vào Postman. Collection gồm 10 test case
(login success/failure, add/update/delete product theo role, search, get by id, 401/403/404...).
Chạy theo thứ tự (Run collection) để các biến `token` / `createdProductId` được truyền tiếp giữa
các request.

## Ghi chú

- Mật khẩu trong `database/schema.sql` đã được hash bằng BCrypt tương ứng với `123456`.
- Theo đúng đề bài: nhân viên có Role = 4 ("Others") sẽ KHÔNG đăng nhập được (không cấp token).
- Khách hàng (Customer) là một hệ thống tài khoản riêng, đăng ký qua `/api/customer/auth/register`
  để mua hàng trên storefront - không liên quan đến bảng `SystemAccounts`.

## Link Github để clone trong trường hợp lỗi khi cài file không thành công

`https://github.com/Kong-Tommy/web_app_java`
