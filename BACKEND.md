# MAISON — Backend Documentation

## Tổng quan

MAISON frontend hiện dùng mock data tĩnh (`src/lib/data.ts`). Tài liệu này định nghĩa toàn bộ backend cần xây để đưa website lên production, bao gồm database schema, API routes, và các tích hợp bên ngoài.

---

## Recommended Stack

| Layer | Technology | Lý do |
|---|---|---|
| Database | **Supabase** (PostgreSQL) | Auth + Realtime + Storage built-in |
| ORM | **Drizzle ORM** | Type-safe, lightweight |
| Auth | **Supabase Auth** | Email/password + Social OAuth |
| File Storage | **Supabase Storage** | Ảnh sản phẩm, avatar |
| Payment | **VNPay / PayOS** | QR code, ATM, credit card VN |
| Email | **Resend** | Order confirmations, receipts |
| Search | **Supabase Full-Text Search** hoặc **Algolia** |

---

## Database Schema

### users
```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'customer',  -- 'customer' | 'admin'
  created_at  TIMESTAMP DEFAULT NOW()
);
```

### products
```sql
CREATE TABLE products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  tag            TEXT,                    -- 'Mới về', 'Bán chạy', etc.
  price          INTEGER NOT NULL,        -- VNĐ
  original_price INTEGER,                 -- NULL nếu không giảm giá
  category       TEXT NOT NULL,           -- 'ao', 'vay-dam', etc.
  badge          TEXT,                    -- 'new' | 'sale' | NULL
  sizes          TEXT[] DEFAULT '{}',     -- ['XS','S','M','L','XL']
  images         TEXT[] DEFAULT '{}',     -- Supabase Storage URLs
  in_stock       BOOLEAN DEFAULT true,
  rating         DECIMAL(3,2) DEFAULT 0,
  review_count   INTEGER DEFAULT 0,
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);
```

### orders
```sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE NOT NULL,   -- 'MSN-2025-0001'
  user_id         UUID REFERENCES users(id),
  status          TEXT DEFAULT 'pending', -- pending|confirmed|shipping|delivered|cancelled
  subtotal        INTEGER NOT NULL,       -- VNĐ
  shipping_fee    INTEGER DEFAULT 0,
  discount        INTEGER DEFAULT 0,
  total           INTEGER NOT NULL,
  shipping_addr   JSONB,                  -- {name, phone, address, city}
  promo_code      TEXT,
  payment_method  TEXT,                   -- 'vnpay' | 'cod' | 'momo'
  payment_status  TEXT DEFAULT 'pending', -- pending | paid | refunded
  paid_at         TIMESTAMP,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

### order_items
```sql
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  product_name TEXT NOT NULL,             -- Snapshot tại thời điểm mua
  price       INTEGER NOT NULL,
  size        TEXT NOT NULL,
  qty         INTEGER NOT NULL,
  image_url   TEXT
);
```

### reviews
```sql
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  order_id    UUID REFERENCES orders(id),
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  verified    BOOLEAN DEFAULT false,      -- Đã mua hàng
  created_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(order_id, product_id)           -- 1 review per product per order
);
```

### wishlist
```sql
CREATE TABLE wishlist (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  added_at   TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);
```

### promo_codes
```sql
CREATE TABLE promo_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  type            TEXT NOT NULL,   -- 'percent' | 'fixed'
  value           INTEGER NOT NULL,-- 15 (15%) or 50000 (50k VNĐ)
  min_order       INTEGER DEFAULT 0,
  max_uses        INTEGER,
  used_count      INTEGER DEFAULT 0,
  expires_at      TIMESTAMP,
  is_active       BOOLEAN DEFAULT true
);
```

---

## API Routes

Tất cả routes prefix `/api/` — Next.js Route Handlers.

### Products

```
GET  /api/products              — List với filter, sort, pagination
GET  /api/products/[slug]       — Single product
POST /api/products              — Admin: tạo mới
PUT  /api/products/[slug]       — Admin: cập nhật
```

#### GET /api/products — Query params

| Param | Type | Mô tả |
|---|---|---|
| `category` | string | `ao`, `vay-dam`, `quan`... |
| `filter` | string | `new`, `sale` |
| `sort` | string | `price-asc`, `price-desc`, `rating`, `newest` |
| `page` | number | Pagination (default: 1) |
| `limit` | number | Items per page (default: 12) |
| `q` | string | Full-text search |

#### Response

```json
{
  "products": [...],
  "total": 48,
  "page": 1,
  "limit": 12,
  "hasMore": true
}
```

---

### Orders

```
GET  /api/orders            — User: lịch sử đơn
POST /api/orders            — Tạo đơn hàng mới
GET  /api/orders/[id]       — Chi tiết đơn
PUT  /api/orders/[id]       — Admin: cập nhật status
```

#### POST /api/orders — Request body

```json
{
  "items": [
    { "productId": "uuid", "size": "M", "qty": 1 }
  ],
  "shippingAddress": {
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "address": "123 Lê Lợi",
    "city": "Hà Nội"
  },
  "promoCode": "MAISON15",
  "paymentMethod": "vnpay"
}
```

#### Response

```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "MSN-2025-0001",
    "total": 3150000,
    "paymentUrl": "https://sandbox.vnpayment.vn/..."
  }
}
```

---

### Auth

```
POST /api/auth/register     — Đăng ký
POST /api/auth/login        — Đăng nhập (email + password)
POST /api/auth/logout       — Đăng xuất
GET  /api/auth/me           — Profile hiện tại
PUT  /api/auth/me           — Cập nhật profile
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

---

### Reviews

```
GET  /api/products/[slug]/reviews    — Lấy reviews
POST /api/products/[slug]/reviews    — Viết review (phải có order)
```

---

### Wishlist

```
GET    /api/wishlist         — Danh sách yêu thích (authed)
POST   /api/wishlist         — Thêm: { productId }
DELETE /api/wishlist/[id]    — Xóa
```

---

### Promo Codes

```
POST /api/promo/validate     — Kiểm tra: { code, orderTotal }
```

```json
// Response
{
  "valid": true,
  "type": "percent",
  "value": 15,
  "discount": 450000
}
```

---

### Admin

```
GET  /api/admin/dashboard    — Stats: revenue, orders, top products
GET  /api/admin/orders       — All orders với filter
PUT  /api/admin/orders/[id]  — Update status
GET  /api/admin/products     — All products
POST /api/admin/products     — Create
PUT  /api/admin/products/[id]— Update
DEL  /api/admin/products/[id]— Soft delete
```

---

### Webhooks

```
POST /api/webhooks/vnpay     — VNPay payment callback
POST /api/webhooks/payos     — PayOS payment callback
```

---

## Payment Flow — VNPay

```
1. Khách click "Thanh toán" → POST /api/orders
2. Server tạo order → generate VNPay payment URL
3. Redirect khách đến VNPay gateway
4. Khách thanh toán
5. VNPay redirect về /payment/return?vnp_ResponseCode=00
6. VNPay gọi webhook → POST /api/webhooks/vnpay
7. Server verify checksum → update order.payment_status = 'paid'
8. Gửi email xác nhận đơn hàng
```

---

## Email Templates (Resend)

| Template | Trigger | Nội dung |
|---|---|---|
| `order-confirmed` | Tạo đơn thành công | Mã đơn, sản phẩm, tổng tiền |
| `payment-success` | Webhook paid | Xác nhận thanh toán |
| `order-shipping` | Admin cập nhật shipping | Mã vận đơn, link theo dõi |
| `order-delivered` | Status = delivered | Yêu cầu đánh giá sản phẩm |
| `password-reset` | Quên mật khẩu | Link reset |
| `welcome` | Đăng ký thành công | Onboarding + voucher 10% |

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=postgresql://...

# VNPay
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://maison.vn/payment/return

# Email
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=https://maison.vn
```

---

## Supabase Row Level Security

```sql
-- Users chỉ đọc được data của mình
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_orders"
  ON orders FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "admins_all_orders"
  ON orders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Products — tất cả đọc được, chỉ admin ghi
CREATE POLICY "products_public_read"
  ON products FOR SELECT USING (true);

CREATE POLICY "products_admin_write"
  ON products FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## Kiến trúc triển khai

```
                    ┌─────────────────┐
     Browser ──────▶│  Vercel (Edge)  │
                    │  Next.js 14     │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────▼─────┐ ┌──────▼────┐ ┌──────▼──────┐
        │ Supabase  │ │  Resend   │ │   VNPay     │
        │ Postgres  │ │  Email    │ │   Payment   │
        │ Auth      │ └───────────┘ └─────────────┘
        │ Storage   │
        └───────────┘
```

---

## Checklist triển khai production

- [ ] Cấu hình domain trong Supabase Auth
- [ ] Set VNPay live credentials
- [ ] Verify domain trong Resend (SPF/DKIM)
- [ ] Enable Supabase RLS cho mọi bảng
- [ ] Cấu hình Vercel environment variables
- [ ] Setup Vercel Analytics
- [ ] Thêm Google Analytics 4
- [ ] Configure CDN cho ảnh (Cloudinary hoặc Supabase Storage CDN)
- [ ] Enable Supabase Point-in-Time Recovery (backup)
- [ ] Rate limiting trên API routes
