# CHANGELOG

Tất cả thay đổi đáng kể của dự án MAISON được ghi lại trong file này.

---

## [1.0.0] — 2025-03-20

### Khởi tạo dự án

**Frontend (Next.js 14)**
- Scaffold toàn bộ project với App Router + TypeScript + Tailwind
- Root layout với metadata SEO đầy đủ
- Global loading skeleton + 404 page

**Design System**
- Thiết lập design tokens: màu nền đen ấm `#0b0a08`, accent vàng `#c8a96e`
- Font pairing: Cormorant Garamond (serif) + DM Sans + DM Mono
- Noise texture overlay via SVG filter
- Tailwind config với custom colors, fonts, animations

**Components Layout**
- `Navbar` — sticky, scroll effect, cart badge
- `CartDrawer` — slide-in từ phải, realtime total
- `CustomCursor` — dot + lagging ring, 60fps RAF animation
- `PromoBar` — top banner server component
- `Footer` — links, social icons, payment methods

**Sections Homepage**
- `Hero` — full-viewport, stats, scroll indicator, gradient overlay
- `Marquee` — infinite scrolling banner với ✦ separators
- `ProductsGrid` — 4-col grid, 1px separator trick
- `FeaturedProduct` — single spotlight với size picker
- `Categories` — masonry-style 3-col với hover zoom
- `BrandStory` — 2-col layout + gold accent border
- `Testimonials` — 3-col review cards
- `Newsletter` — email signup form

**Shop Components**
- `ProductCard` — hover overlay, wishlist toggle, add-to-cart
- `SizePicker` — size selector với active state

**Pages**
- `/` Homepage (Server Component)
- `/products` Listing với filter sidebar + sort (Server)
- `/products/[slug]` Detail với gallery, qty, related (Client)
- `/cart` Full cart với subtotal, shipping, promo (Client)

**State Management**
- Zustand cart store (persisted localStorage) — add, remove, changeQty
- Zustand wishlist store (persisted)

**Hooks & Utils**
- `useReveal` — IntersectionObserver scroll animations
- `formatPrice`, `discount`, `cn` utilities

**SEO**
- Per-page metadata via `generateMetadata`
- `generateStaticParams` cho 9 product pages
- Open Graph tags

**Build**
- `npm run build` ✅ — 0 TypeScript errors, 0 build errors
- Homepage: 2.37 kB page JS
- All product pages statically generated
