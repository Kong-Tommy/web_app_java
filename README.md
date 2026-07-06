# shopVN - Webapp ban hang (Spring Boot + React)

Webapp thuong mai dien tu theo tong mau Shopee. Backend Java Spring Boot (JWT auth, REST API,
Swagger), frontend React + Vite. Du lieu goc theo sum2025productinventorydb, mo rong them
Customer / Cart / Orders de co trai nghiem mua hang day du.

## Cau truc project

```
Project_java/
  backend/     Spring Boot API (Java 17, Maven)
  frontend/    React + Vite storefront + trang quan tri
  database/    schema.sql (MySQL)
  postman/     Postman collection (10 test case)
```

## 1. Chuan bi Database (MySQL)

Can co MySQL 8.x dang chay (vi du qua XAMPP/Docker/MySQL Installer).

```bash
mysql -u root -p < database/schema.sql
```

Script se tao database `webappjava` voi cac bang: `SystemAccounts`, `Category`,
`Product`, `Customer`, `CartItem`, `Orders`, `OrderItem`, kem du lieu mau.

Tai khoan nhan vien demo (mat khau chung: `123456`):

| Email | Role |
|---|---|
| admin@system.com | admin (full CRUD) |
| manager@system.com | manager (full CRUD) |
| analyst1... -> analyst@system.com | analyst (chi doc) |
| user1@system.com | role thuong - KHONG duoc cap token |

## 2. Chay Backend (Spring Boot)

Yeu cau: JDK 17+ va Maven (hoac dung IDE nhu IntelliJ/Eclipse da tich hop Maven).

Sua thong tin ket noi DB tai `backend/src/main/resources/application.yml` neu can
(user/password MySQL ):

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/webappjava
    username: root
    password: 123456
```

Chay:

```bash
cd backend
mvn spring-boot:run
```

Backend chay tai `http://localhost:8080`.

- Swagger UI: http://localhost:8080/swagger-ui.html
- Login nhan vien: `POST /api/auth`
- Login/dang ky khach hang: `POST /api/customer/auth/login`, `POST /api/customer/auth/register`

### Cac API chinh (theo dung de bai)

| Method | Endpoint | Quyen |
|---|---|---|
| POST | /api/auth | Public - login nhan vien |
| GET | /api/products | admin, manager, analyst, customer |
| GET | /api/products/{id} | admin, manager, analyst, customer |
| GET | /api/products/search?name=&category= | admin, manager, analyst, customer |
| POST | /api/products | admin, manager |
| PUT | /api/products/{id} | admin, manager |
| DELETE | /api/products/{id} | admin only |

Loi tra ve theo format:
```json
{ "errorCode": "PR40001", "message": "Product name is required" }
```

### API mo rong cho webapp ban hang (ngoai de bai)

- `GET /api/shop/products`, `/api/shop/products/{id}`, `/api/shop/products/search`,
  `/api/shop/categories` - xem san pham public, khong can dang nhap.
- `POST/GET/PUT/DELETE /api/cart/**` - gio hang (can dang nhap khach hang).
- `POST /api/orders`, `GET /api/orders`, `GET /api/orders/{id}` - dat hang / xem don hang.
- `GET /api/admin/orders`, `PUT /api/admin/orders/{id}/status` - quan tri don hang (admin/manager).

## 3. Chay Frontend (React + Vite)

Yeu cau: Node.js 18+.

```bash
cd frontend
npm install
npm run dev
```

Logo
- Logo: `frontend/src/components/Logo.jsx` (component SVG, co bien the `onOrange`/`onLight`).
- Anh san pham: `frontend/public/products/*.svg` (electronics, wearables, home-appliances, books, gaming).
- Favicon: `frontend/public/favicon.svg`.

Mo `http://localhost:5173`.

- Trang khach hang: trang chu, tim kiem, chi tiet san pham, gio hang, thanh toan, don hang.
- Trang quan tri (`/admin/login`): dang nhap bang tai khoan nhan vien (admin/manager/analyst),
  quan ly san pham va don hang.

Bien moi truong `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## 4. Postman test suite

Import `postman/Sum2025Shop_API.postman_collection.json` vao Postman. Collection gom 10 test case
(login success/failure, add/update/delete product theo role, search, get by id, 401/403/404...).
Chay theo thu tu (Run collection) de cac bien `token` / `createdProductId` duoc truyen tiep giua
cac request.

## Ghi chu

- Mat khau trong `database/schema.sql` da duoc hash bang BCrypt tuong ung voi `123456`.
- Theo dung de bai: nhan vien co Role = 4 ("Others") se KHONG dang nhap duoc (khong cap token).
- Khach hang (Customer) la mot he thong tai khoan rieng, dang ky qua `/api/customer/auth/register`
  de mua hang tren storefront - khong lien quan den bang `SystemAccounts`.
