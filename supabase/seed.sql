-- =============================================
-- MAISON — Seed Data
-- Run this AFTER the migration
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
  ('dam-dai-print-hoa', 'Đầm dài print hoa', 'Mùa hè', 2650000, NULL, '🌸', 4.8, 178, NULL, 'vay-dam', ARRAY['XS','S','M','L','XL'], true, 'Đầm dài print hoa tươi tắn, phù hợp mùa hè.', ARRAY['Chiffon mềm mại','Print hoa độc quyền','Có lớp lót','Phù hợp du lịch, dạo phố']);

-- Featured Product
INSERT INTO products (slug, name, tag, price, original_price, emoji, rating, review_count, badge, category, sizes, in_stock, description, details) VALUES
  ('dam-da-hoi-noir-silk', 'Đầm dạ hội Noir Silk', 'Độc quyền 2025', 6800000, 9200000, '✨', 5.0, 34, 'sale', 'vay-dam', ARRAY['XS','S','M','L','XL'], true, 'Được chế tác từ lụa tự nhiên 100% nhập khẩu từ Ý, mỗi đường may là một tuyên ngôn về sự tinh tế. Thiết kế tay bồng lãng mạn, phù hợp cho những buổi tiệc sang trọng.', ARRAY['100% lụa tự nhiên nhập khẩu Ý','Đường may thủ công tinh tế','Có lớp lót thoáng mát','Giặt khô hoặc giặt tay nhẹ']);

-- Categories
INSERT INTO categories (slug, name, count, emoji, aspect_tall) VALUES
  ('vay-dam', 'Đầm & Váy', 86, '👗', true),
  ('ao', 'Áo', 124, '👔', false),
  ('phu-kien', 'Phụ kiện', 58, '👜', false),
  ('giay', 'Giày', 73, '👠', false);

-- Reviews
INSERT INTO reviews (author, avatar, rating, text, date, verified) VALUES
  ('Trần Phương Linh', '🌸', 5, 'Chất lượng vải tuyệt vời, đường may tinh tế đến từng chi tiết. Đây là lần thứ ba tôi mua và chưa bao giờ thất vọng.', '15 tháng 3, 2025', true),
  ('Nguyễn Hà My', '🎭', 5, 'Đặt hàng tối, sáng hôm sau đã nhận được. Đóng gói đẹp như quà tặng. Sản phẩm vượt xa kỳ vọng của tôi.', '8 tháng 3, 2025', true),
  ('Lê Thùy Dương', '💎', 5, 'Mặc chiếc đầm này đến tiệc cưới và nhận được hàng chục lời khen. Cắt may rất tốt, vừa vặn hoàn hảo.', '1 tháng 3, 2025', true);

-- Promo Codes
INSERT INTO promo_codes (code, type, value, min_order, is_active) VALUES
  ('MAISON15', 'percent', 15, 1000000, true),
  ('WELCOME10', 'percent', 10, 500000, true),
  ('FREESHIP', 'fixed', 50000, 2000000, true);
