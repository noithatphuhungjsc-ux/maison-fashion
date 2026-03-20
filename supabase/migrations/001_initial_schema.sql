-- =============================================
-- MAISON E-commerce — Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Products
CREATE TABLE products (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  tag            TEXT,
  price          INTEGER NOT NULL,
  original_price INTEGER,
  category       TEXT NOT NULL,
  badge          TEXT,
  sizes          TEXT[] DEFAULT '{}',
  images         TEXT[] DEFAULT '{}',
  emoji          TEXT,
  in_stock       BOOLEAN DEFAULT true,
  rating         DECIMAL(3,2) DEFAULT 0,
  review_count   INTEGER DEFAULT 0,
  details        TEXT[] DEFAULT '{}',
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  count       INTEGER DEFAULT 0,
  emoji       TEXT,
  aspect_tall BOOLEAN DEFAULT false
);

-- 3. Reviews
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  author      TEXT NOT NULL,
  avatar      TEXT,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text        TEXT,
  date        TEXT,
  verified    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Promo Codes
CREATE TABLE promo_codes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code       TEXT UNIQUE NOT NULL,
  type       TEXT NOT NULL,
  value      INTEGER NOT NULL,
  min_order  INTEGER DEFAULT 0,
  max_uses   INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active  BOOLEAN DEFAULT true
);

-- 5. Orders (for future use)
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number    TEXT UNIQUE NOT NULL,
  status          TEXT DEFAULT 'pending',
  subtotal        INTEGER NOT NULL,
  shipping_fee    INTEGER DEFAULT 0,
  discount        INTEGER DEFAULT 0,
  total           INTEGER NOT NULL,
  shipping_addr   JSONB,
  promo_code      TEXT,
  payment_method  TEXT,
  payment_status  TEXT DEFAULT 'pending',
  paid_at         TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Order Items
CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  price        INTEGER NOT NULL,
  size         TEXT NOT NULL,
  qty          INTEGER NOT NULL,
  image_url    TEXT
);

-- =============================================
-- Row Level Security — Public read for products
-- =============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_badge ON products(badge);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
