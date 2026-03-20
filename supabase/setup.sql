-- =============================================
-- MAISON — FULL SETUP (Migration + Seed)
-- Copy toàn bộ file này → Supabase SQL Editor → Run
-- =============================================

-- 1. Products
CREATE TABLE IF NOT EXISTS products (
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
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  count       INTEGER DEFAULT 0,
  emoji       TEXT,
  aspect_tall BOOLEAN DEFAULT false
);

-- 3. Reviews
CREATE TABLE IF NOT EXISTS reviews (
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
CREATE TABLE IF NOT EXISTS promo_codes (
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

-- 5. Orders
CREATE TABLE IF NOT EXISTS orders (
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
CREATE TABLE IF NOT EXISTS order_items (
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
-- Row Level Security
-- =============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "categories_public_read" ON categories FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =============================================
-- Indexes
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_badge ON products(badge);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- =============================================
-- SEED DATA
-- =============================================

-- Products
INSERT INTO products (slug, name, tag, price, original_price, emoji, rating, review_count, badge, category, sizes, in_stock, description, details) VALUES
  ('ao-blouse-lua-trang', 'Áo blouse lụa trắng', 'Mới về', 1850000, NULL, '👚', 4.8, 124, 'new', 'ao', ARRAY['XS','S','M','L','XL'], true, 'Áo blouse lụa trắng tinh khôi, thiết kế tay phồng nhẹ nhàng phù hợp cho mọi dịp.', ARRAY['100% lụa tự nhiên','Tay phồng nhẹ nhàng','Có thể phối cùng chân váy hoặc quần tây']),
  ('vay-midi-hoa-nhi', 'Váy midi hoa nhí', 'Bán chạy', 2450000, 3200000, '👗', 4.9, 289, 'sale', 'vay-dam', ARRAY['XS','S','M','L'], true, 'Váy midi hoa nhí phong cách vintage, chất liệu voan mềm mại bay bổng.', ARRAY['Voan cao cấp','Có lớp lót','Phong cách vintage','Phù hợp đi chơi, du lịch']),
  ('quan-ong-rong-linen', 'Quần ống rộng linen', 'Xu hướng', 1650000, NULL, '👖', 4.7, 98, NULL, 'quan', ARRAY['S','M','L','XL'], true, 'Quần ống rộng chất liệu linen thoáng mát, phù hợp thời tiết nóng.', ARRAY['100% linen','Ống rộng thoải mái','Cạp cao tôn dáng']),
  ('ao-khoac-blazer-den', 'Áo khoác blazer đen', 'Cổ điển', 3980000, 4900000, '🧥', 5.0, 67, 'sale', 'ao', ARRAY['XS','S','M','L','XL'], true, 'Blazer đen cổ điển, thiết kế oversized hiện đại.', ARRAY['Vải tweed cao cấp','Oversized fit','Lót satin bên trong','2 túi ẩn']),
  ('dam-wrap-xanh-sage', 'Đầm wrap xanh sage', 'Nổi bật', 2890000, NULL, '💚', 4.8, 156, 'new', 'vay-dam', ARRAY['XS','S','M','L'], true, 'Đầm wrap xanh sage nữ tính, tôn dáng hoàn hảo.', ARRAY['Chất liệu satin','Kiểu wrap ôm eo','Phù hợp đi tiệc','Có thể mặc 2 kiểu']),
  ('set-crop-chan-vay', 'Set bộ crop + chân váy', 'Mới về', 3450000, NULL, '✨', 4.9, 203, 'new', 'vay-dam', ARRAY['XS','S','M','L','XL'], true, 'Set bộ crop top kết hợp chân váy midi, phong cách trẻ trung.', ARRAY['Bộ 2 món','Crop top + chân váy midi','Chất liệu tweed','Phù hợp đi làm, đi chơi']),
  ('ao-co-tru-satin-den', 'Áo cổ trụ satin đen', 'Luxury', 2190000, 2800000, '🖤', 4.6, 87, 'sale', 'ao', ARRAY['XS','S','M','L'], true, 'Áo cổ trụ satin đen sang trọng, thiết kế tối giản.', ARRAY['100% satin','Cổ trụ thanh lịch','Tay dài','Phù hợp đi làm, đi tiệc']),
  ('dam-dai-print-hoa', 'Đầm dài print hoa', 'Mùa hè', 2650000, NULL, '🌸', 4.8, 178, NULL, 'vay-dam', ARRAY['XS','S','M','L','XL'], true, 'Đầm dài print hoa tươi tắn, phù hợp mùa hè.', ARRAY['Chiffon mềm mại','Print hoa độc quyền','Có lớp lót','Phù hợp du lịch, dạo phố']),
  ('dam-da-hoi-noir-silk', 'Đầm dạ hội Noir Silk', 'Độc quyền 2025', 6800000, 9200000, '✨', 5.0, 34, 'sale', 'vay-dam', ARRAY['XS','S','M','L','XL'], true, 'Được chế tác từ lụa tự nhiên 100% nhập khẩu từ Ý, mỗi đường may là một tuyên ngôn về sự tinh tế. Thiết kế tay bồng lãng mạn, phù hợp cho những buổi tiệc sang trọng.', ARRAY['100% lụa tự nhiên nhập khẩu Ý','Đường may thủ công tinh tế','Có lớp lót thoáng mát','Giặt khô hoặc giặt tay nhẹ'])
ON CONFLICT (slug) DO NOTHING;

-- Categories
INSERT INTO categories (slug, name, count, emoji, aspect_tall) VALUES
  ('vay-dam', 'Đầm & Váy', 86, '👗', true),
  ('ao', 'Áo', 124, '👔', false),
  ('phu-kien', 'Phụ kiện', 58, '👜', false),
  ('giay', 'Giày', 73, '👠', false)
ON CONFLICT (slug) DO NOTHING;

-- Reviews
INSERT INTO reviews (author, avatar, rating, text, date, verified) VALUES
  ('Trần Phương Linh', '🌸', 5, 'Chất lượng vải tuyệt vời, đường may tinh tế đến từng chi tiết. Đây là lần thứ ba tôi mua và chưa bao giờ thất vọng.', '15 tháng 3, 2025', true),
  ('Nguyễn Hà My', '🎭', 5, 'Đặt hàng tối, sáng hôm sau đã nhận được. Đóng gói đẹp như quà tặng. Sản phẩm vượt xa kỳ vọng của tôi.', '8 tháng 3, 2025', true),
  ('Lê Thùy Dương', '💎', 5, 'Mặc chiếc đầm này đến tiệc cưới và nhận được hàng chục lời khen. Cắt may rất tốt, vừa vặn hoàn hảo.', '1 tháng 3, 2025', true);

-- Promo Codes
INSERT INTO promo_codes (code, type, value, min_order, is_active) VALUES
  ('MAISON15', 'percent', 15, 1000000, true),
  ('WELCOME10', 'percent', 10, 500000, true),
  ('FREESHIP', 'fixed', 50000, 2000000, true)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- Done! Verify:
-- =============================================
SELECT 'products' as "table", count(*) as "rows" FROM products
UNION ALL
SELECT 'categories', count(*) FROM categories
UNION ALL
SELECT 'reviews', count(*) FROM reviews
UNION ALL
SELECT 'promo_codes', count(*) FROM promo_codes;
