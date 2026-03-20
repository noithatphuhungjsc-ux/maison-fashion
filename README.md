# MAISON — Thời trang cao cấp

> *Vẻ đẹp trong từng chi tiết*

Website thương mại điện tử thời trang cao cấp Việt Nam, xây dựng trên Next.js 14 App Router với thiết kế editorial luxury dark theme.

---

## Xem trước

| Trang | Mô tả |
|---|---|
| `/` | Homepage — Hero, sản phẩm, featured, categories, brand story, testimonials |
| `/products` | Danh sách với filter theo danh mục, badge, sort theo giá/rating |
| `/products/[slug]` | Chi tiết sản phẩm — gallery, size picker, qty, related |
| `/cart` | Giỏ hàng — subtotal, shipping, promo code, checkout |

---

## Tech Stack

```
Framework:  Next.js 14 (App Router)
Language:   TypeScript 5
Styling:    Tailwind CSS 3
State:      Zustand (persist)
Fonts:      Cormorant Garamond + DM Sans + DM Mono
Toast:      Sonner
```

---

## Bắt đầu nhanh

```bash
# 1. Clone / unzip project
cd maison

# 2. Cài dependencies
npm install

# 3. Cấu hình môi trường
cp .env.example .env.local

# 4. Chạy development server
npm run dev
# → http://localhost:3000

# 5. Build production
npm run build
npm start
```

---

## Cấu trúc dự án

```
maison/
├── src/
│   ├── app/                  # Pages & layouts
│   │   ├── page.tsx          # Homepage
│   │   ├── cart/             # Cart page
│   │   └── products/         # Product listing + detail
│   ├── components/
│   │   ├── layout/           # Navbar, CartDrawer, Footer, Cursor
│   │   ├── sections/         # Hero, Products, Featured, Categories...
│   │   └── shop/             # ProductCard, SizePicker
│   ├── store/cart.ts         # Zustand cart + wishlist
│   ├── hooks/useReveal.ts    # Scroll animation hook
│   ├── lib/data.ts           # Mock data (thay bằng API sau)
│   └── types/index.ts        # TypeScript types
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## Tính năng hiện tại

- ✅ Responsive (mobile, tablet, desktop)
- ✅ Custom cursor (dot + lagging ring)
- ✅ Scroll-reveal animations
- ✅ Marquee banner
- ✅ Product grid với hover overlay
- ✅ Cart drawer — thêm, xóa, tăng/giảm qty
- ✅ Zustand cart + wishlist (persist localStorage)
- ✅ Product detail page với gallery, size picker
- ✅ Products listing với filter sidebar + sort
- ✅ Cart page với promo code input
- ✅ Toast notifications
- ✅ SEO metadata per page
- ✅ Static generation cho product pages
- ✅ 404, loading pages

---

## Roadmap — Tích hợp Backend

```
Phase 1 — Database
  [ ] Kết nối Supabase
  [ ] Thay mock data bằng real API calls
  [ ] Thêm ảnh thật (next/image + Supabase Storage)

Phase 2 — Auth
  [ ] Đăng ký / Đăng nhập
  [ ] Trang hồ sơ cá nhân
  [ ] Lịch sử đơn hàng

Phase 3 — Checkout
  [ ] Trang checkout đầy đủ
  [ ] Tích hợp VNPay / PayOS
  [ ] Email xác nhận đơn hàng (Resend)

Phase 4 — AI Features
  [ ] Tìm kiếm ngôn ngữ tự nhiên
  [ ] Gợi ý sản phẩm cá nhân hóa
  [ ] Chatbot tư vấn thời trang
```

---

## Design Tokens

```
Màu nền chính:  #0b0a08  (đen ấm)
Accent chính:   #c8a96e  (vàng amber)
Accent hover:   #e8d0a0  (vàng nhạt)
Chữ chính:      #f0ede6  (trắng ấm)
Chữ phụ:        rgba(240,237,230,0.5)
Border:         rgba(255,255,255,0.07)
```

---

## Tài liệu chi tiết

| File | Nội dung |
|---|---|
| [`FRONTEND.md`](./FRONTEND.md) | Component structure, design system, patterns |
| [`BACKEND.md`](./BACKEND.md) | Database schema, API routes, payment flow |
| [`PROMPT_ENGINEERING.md`](./PROMPT_ENGINEERING.md) | AI features, prompt templates, implementation |
| [`CHANGELOG.md`](./CHANGELOG.md) | Lịch sử thay đổi |

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript check (tsc --noEmit)
```

---

## License

© 2025 MAISON. Internal use only.
