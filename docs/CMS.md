# CMS + Vercel Postgres/Neon

## Local

```powershell
Copy-Item .env.example .env.local
# tạo hash mật khẩu quản trị, không ghi mật khẩu vào Git
node scripts/hash-password.mjs "mat-khau-manh"
npm run cms:dev
npm run dev
```

Mở `/admin` để chỉnh catalogue local. API local chạy `127.0.0.1:8787`. Bản UI hiện có fallback localStorage để xem trước khi chưa cấu hình API.

## Vercel

Vercel Postgres cũ đã chuyển sang Neon. Tạo Neon database trong Vercel Marketplace, gắn `DATABASE_URL`, tạo `ADMIN_PASSWORD_HASH`, redeploy. API:

- `GET /api/content`: đọc catalogue công khai.
- `POST /api/login`, `POST /api/logout`: session HttpOnly 8 giờ.
- `PUT /api/admin/content`: cập nhật catalogue, kiểm tra Zod + optimistic revision.
- `POST /api/orders`: nhận yêu cầu COD, idempotency key, giới hạn IP.
- `GET/PATCH /api/admin/orders`: quản lý trạng thái đơn sau đăng nhập.

Đơn COD chưa tự xác nhận giao hàng; cửa hàng phải gọi lại. Không lưu thẻ hay thông tin thanh toán nhạy cảm.

## Tạo hash

`ADMIN_PASSWORD_HASH` có dạng `salt:hex`, dùng scrypt. Không dùng giá trị mặc định.
