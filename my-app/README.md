# GoatWedding

Nền tảng tạo thiệp cưới online — Next.js + PostgreSQL + Prisma.

## Yêu cầu

- Node.js 20+
- PostgreSQL (local hoặc cloud)
- npm

## Cách chạy (lần đầu)

### 1. Cài dependency

```bash
cd my-app
npm install
```

### 2. Cấu hình biến môi trường

```bash
cp .env.example .env
```

Sửa file `.env`:

| Biến | Mô tả |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5434/goatwedding?schema=public` |
| `NEXT_PUBLIC_SITE_URL` | URL site, ví dụ `http://localhost:3000` |
| `SMTP_USER` | Email Gmail gửi thông báo |
| `SMTP_PASS` | [App Password](https://myaccount.google.com/apppasswords) của Gmail |
| `SMTP_FROM` | Tên hiển thị người gửi, ví dụ `GoatWedding <hello@gmail.com>` |
| `SEPAY_ACCOUNT_NAME` | Tên chủ tài khoản nhận thanh toán |
| `SEPAY_ACCOUNT_NUMBER` | Số tài khoản nhận thanh toán |
| `SEPAY_BANK` | Mã ngân hàng dùng để tạo QR Sepay, ví dụ `MBBank` |
| `SEPAY_WEBHOOK_API_KEY` | API key webhook Sepay (tuỳ chọn khi dev) |

### 3. Chạy PostgreSQL bằng Docker

```bash
docker compose up -d
```

Database chạy tại port **5434** (tránh xung đột với Postgres khác trên máy).

```bash
npm run db:push
```

### 4. Chạy dev server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run start` | Chạy bản production (sau `build`) |
| `npm run lint` | Kiểm tra ESLint |
| `npm run db:migrate` | Chạy Prisma migration |
| `npm run db:push` | Đồng bộ schema lên DB (dev) |
| `npm run db:generate` | Generate Prisma Client |

## Chạy production

```bash
npm run build
npm run start
```

## Các trang chính

| Route | Mô tả |
|---|---|
| `/` | Trang chủ |
| `/mau-thiep` | Danh sách mẫu thiệp |
| `/chon-goi` | Chọn gói dịch vụ |
| `/tao-thiep` | Form tạo thiệp (6 bước) |
| `/demo/[id]` | Xem bản demo (watermark) |
| `/thanh-toan/[orderId]` | Thanh toán Sepay |
| `/tao-thiep-ten-rieng` | Tạo link thiệp có tên riêng khách mời |
| `/[slug]` | Thiệp chính thức hoặc preview mẫu |

## Luồng sử dụng

1. Vào `/chon-goi` → chọn gói + loại thiệp (có/không tên riêng khách mời)
2. Nhập thông tin tại `/tao-thiep`
3. Xem demo → thanh toán **trên cùng một thiết bị**
4. Sau thanh toán → nhận link thiệp qua email

> Ảnh upload lưu tại `public/uploads/`. Email dùng Gmail SMTP qua nodemailer.

## Xem mẫu thiệp (không cần DB)

Các route preview mẫu vẫn xem được khi chưa cấu hình DB:

- `/thiep-cuoi-1`
- `/thiep-cuoi-2`
- `/thiep-cuoi-3`
- `/thiep-cuoi-4`

Luồng tạo thiệp / thanh toán cần PostgreSQL hoạt động.
