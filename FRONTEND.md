# MAISON — Frontend Documentation

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State | Zustand (persist middleware) |
| Fonts | Cormorant Garamond + DM Sans + DM Mono |
| Notifications | Sonner |

---

## Cấu trúc thư mục

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — metadata, fonts, Toaster
│   ├── page.tsx                # Homepage (Server Component)
│   ├── loading.tsx             # Global loading skeleton
│   ├── not-found.tsx           # 404 page
│   ├── globals.css             # Tailwind directives + custom base styles
│   ├── cart/
│   │   └── page.tsx            # Full cart page — subtotal, shipping, promo
│   └── products/
│       ├── page.tsx            # Listing + filter sidebar + sort (Server)
│       └── [slug]/
│           ├── page.tsx        # generateStaticParams, generateMetadata
│           └── ProductDetailClient.tsx  # Gallery, size, qty, add-to-cart
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav, scroll effect, cart icon badge
│   │   ├── CartDrawer.tsx      # Slide-in drawer, realtime total
│   │   ├── CustomCursor.tsx    # Dot + ring cursor with laggy ring animation
│   │   ├── PromoBar.tsx        # Top banner (Server Component)
│   │   └── Footer.tsx          # Links, social, payment icons
│   ├── sections/               # All homepage sections (mostly Server)
│   │   ├── Hero.tsx            # Full-viewport hero with stats
│   │   ├── Marquee.tsx         # Infinite scrolling text banner
│   │   ├── ProductsGrid.tsx    # 4-col grid with ProductCard
│   │   ├── FeaturedProduct.tsx # Single product spotlight (Client)
│   │   ├── Categories.tsx      # 3-col masonry-style category cards
│   │   ├── BrandStory.tsx      # Brand narrative + accent border
│   │   ├── Testimonials.tsx    # 3-col review cards
│   │   └── Newsletter.tsx      # Email signup form (Client)
│   └── shop/
│       ├── ProductCard.tsx     # Card with hover overlay + wishlist (Client)
│       └── SizePicker.tsx      # Size selector buttons (Client)
│
├── store/
│   └── cart.ts                 # Zustand: cart + wishlist (localStorage persist)
│
├── hooks/
│   └── useReveal.ts            # IntersectionObserver scroll-reveal hook
│
├── lib/
│   ├── data.ts                 # PRODUCTS, FEATURED_PRODUCT, CATEGORIES, REVIEWS
│   └── utils.ts                # cn(), formatPrice(), discount()
│
└── types/
    └── index.ts                # Product, CartItem, Size, Category, Review
```

---

## Design System

### Color Tokens

```css
/* Dark luxury palette */
--bg:       #0b0a08   /* Primary background */
--bg2:      #131210   /* Card / section backgrounds */
--bg3:      #1a1916   /* Deep recessed areas */
--surface:  #1f1e1b   /* Elevated surfaces */
--surface2: #2a2825   /* Higher elevation */
--border:   rgba(255,255,255,0.07)   /* Subtle dividers */
--border2:  rgba(255,255,255,0.13)   /* Stronger borders */
--text:     #f0ede6   /* Primary text */
--muted:    rgba(240,237,230,0.5)    /* Secondary text */
--faint:    rgba(240,237,230,0.28)   /* Hint text */
--gold:     #c8a96e   /* Primary accent */
--gold2:    #e8d0a0   /* Gold hover state */
```

### Typography

```css
font-serif: 'Cormorant Garamond'  /* Headlines, prices, quotes */
font-sans:  'DM Sans'             /* Body, UI text */
font-mono:  'DM Mono'             /* Prices, codes, badges */
```

### Spacing Convention

All sections use `px-12 py-24` (48px horizontal, 96px vertical).
Products grid uses `gap-px bg-white/7` trick for 1px separator lines.

---

## Server vs Client Components

| Component | Type | Reason |
|---|---|---|
| `page.tsx` (homepage) | Server | Data fetching at build time |
| `ProductsGrid` | Server | Receives props from server page |
| `Categories` | Server | Static data, no interactivity |
| `BrandStory` | Server | Pure HTML, no state |
| `Footer` | Server | Static links |
| `ProductCard` | **Client** | Hover state, add-to-cart, wishlist |
| `FeaturedProduct` | **Client** | Size picker + cart actions |
| `CartDrawer` | **Client** | Zustand state, open/close |
| `Navbar` | **Client** | Scroll listener, cart count |
| `CustomCursor` | **Client** | RAF animation loop |
| `Newsletter` | **Client** | Form submission |

---

## State Management — Zustand

```ts
// src/store/cart.ts

// Cart store (persisted to localStorage)
useCart.items        // CartItem[]
useCart.add(item)    // Add or increment qty
useCart.remove(id, size)
useCart.changeQty(id, size, delta)
useCart.total()      // number (VNĐ)
useCart.count()      // number

// Wishlist store (persisted)
useWishlist.toggle(id)
useWishlist.has(id)  // boolean
```

---

## Key Patterns

### 1. Gap-as-separator grid

```tsx
<div className="grid grid-cols-4 gap-px bg-white/7">
  {products.map(p => (
    <div className="bg-[#0b0a08]"> {/* each card resets background */}
      ...
    </div>
  ))}
</div>
```

### 2. Scroll reveal (hook)

```tsx
const { ref, visible } = useReveal(0.12)

<div
  ref={ref}
  className={cn(
    'opacity-0 translate-y-6 transition-all duration-700',
    visible && 'opacity-100 translate-y-0'
  )}
>
```

### 3. Cart event bus (cross-component)

```tsx
// Navbar triggers:
window.dispatchEvent(new CustomEvent('maison:open-cart'))

// CartDrawer listens:
window.addEventListener('maison:open-cart', () => setOpen(true))
```

---

## SEO Configuration

```ts
// src/app/layout.tsx
export const metadata: Metadata = {
  title: { default: 'MAISON', template: '%s | MAISON' },
  description: '...',
  openGraph: { type: 'website', ... },
}

// src/app/products/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const product = PRODUCTS.find(p => p.slug === params.slug)
  return { title: product.name, description: product.description }
}

// Static generation for all product pages
export function generateStaticParams() {
  return ALL_PRODUCTS.map(p => ({ slug: p.slug }))
}
```

---

## Performance

- Homepage: **2.37 kB** page JS (118 kB total with shared chunks)
- Product pages: **3.12 kB** (statically generated at build time)
- Cart page: **4.98 kB** (client-side, Zustand hydration)
- All product pages pre-rendered via `generateStaticParams`
- Custom cursor uses `requestAnimationFrame` (not CSS transitions) for smooth 60fps

---

## Thêm sản phẩm mới

```ts
// src/lib/data.ts
export const PRODUCTS: Product[] = [
  {
    id: 9,
    slug: 'ten-san-pham',       // URL slug
    name: 'Tên sản phẩm',
    tag: 'Mới về',
    price: 2_500_000,
    originalPrice: 3_000_000,  // optional — hiển thị gạch ngang
    emoji: '👗',                // placeholder (thay bằng next/image sau)
    rating: 4.8,
    reviewCount: 0,
    badge: 'new',              // 'new' | 'sale' | null
    category: 'vay-dam',       // ProductCategory
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    description: 'Mô tả sản phẩm...',
    details: ['Chi tiết 1', 'Chi tiết 2'],
  },
]
```

---

## Tích hợp ảnh thật (Next Image)

Thay emoji placeholder bằng ảnh thật:

```tsx
// ProductCard.tsx
import Image from 'next/image'

// Thay:
<div className="pi-in">{product.emoji}</div>

// Bằng:
<Image
  src={product.imageUrl}
  alt={product.name}
  fill
  className="object-cover transition-transform duration-700 group-hover:scale-105"
  sizes="(max-width: 768px) 50vw, 25vw"
/>
```

Cập nhật `next.config.mjs`:
```js
const nextConfig = {
  images: {
    domains: ['cdn.yourdomain.com', 'res.cloudinary.com'],
  },
}
```
