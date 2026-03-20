import type { Product, Category, Review } from '@/types'

export const PRODUCTS: Product[] = [
  { id:1, slug:'ao-blouse-lua-trang', name:'Áo blouse lụa trắng', tag:'Mới về', price:1_850_000, emoji:'👚', rating:4.8, reviewCount:124, badge:'new', category:'ao', sizes:['XS','S','M','L','XL'], inStock:true },
  { id:2, slug:'vay-midi-hoa-nhi', name:'Váy midi hoa nhí', tag:'Bán chạy', price:2_450_000, originalPrice:3_200_000, emoji:'👗', rating:4.9, reviewCount:289, badge:'sale', category:'vay-dam', sizes:['XS','S','M','L'], inStock:true },
  { id:3, slug:'quan-ong-rong-linen', name:'Quần ống rộng linen', tag:'Xu hướng', price:1_650_000, emoji:'👖', rating:4.7, reviewCount:98, category:'quan', sizes:['S','M','L','XL'], inStock:true },
  { id:4, slug:'ao-khoac-blazer-den', name:'Áo khoác blazer đen', tag:'Cổ điển', price:3_980_000, originalPrice:4_900_000, emoji:'🧥', rating:5.0, reviewCount:67, badge:'sale', category:'ao', sizes:['XS','S','M','L','XL'], inStock:true },
  { id:5, slug:'dam-wrap-xanh-sage', name:'Đầm wrap xanh sage', tag:'Nổi bật', price:2_890_000, emoji:'💚', rating:4.8, reviewCount:156, badge:'new', category:'vay-dam', sizes:['XS','S','M','L'], inStock:true },
  { id:6, slug:'set-crop-chan-vay', name:'Set bộ crop + chân váy', tag:'Mới về', price:3_450_000, emoji:'✨', rating:4.9, reviewCount:203, badge:'new', category:'vay-dam', sizes:['XS','S','M','L','XL'], inStock:true },
  { id:7, slug:'ao-co-tru-satin-den', name:'Áo cổ trụ satin đen', tag:'Luxury', price:2_190_000, originalPrice:2_800_000, emoji:'🖤', rating:4.6, reviewCount:87, badge:'sale', category:'ao', sizes:['XS','S','M','L'], inStock:true },
  { id:8, slug:'dam-dai-print-hoa', name:'Đầm dài print hoa', tag:'Mùa hè', price:2_650_000, emoji:'🌸', rating:4.8, reviewCount:178, category:'vay-dam', sizes:['XS','S','M','L','XL'], inStock:true },
]

export const FEATURED_PRODUCT: Product = {
  id:0, slug:'dam-da-hoi-noir-silk', name:'Đầm dạ hội Noir Silk', tag:'Độc quyền 2025',
  price:6_800_000, originalPrice:9_200_000, emoji:'✨',
  rating:5.0, reviewCount:34, badge:'sale', category:'vay-dam',
  sizes:['XS','S','M','L','XL'], inStock:true,
  description:'Được chế tác từ lụa tự nhiên 100% nhập khẩu từ Ý, mỗi đường may là một tuyên ngôn về sự tinh tế. Thiết kế tay bồng lãng mạn, phù hợp cho những buổi tiệc sang trọng.',
  details:['100% lụa tự nhiên nhập khẩu Ý','Đường may thủ công tinh tế','Có lớp lót thoáng mát','Giặt khô hoặc giặt tay nhẹ'],
}

export const CATEGORIES: Category[] = [
  { slug:'vay-dam', name:'Đầm & Váy', count:86, emoji:'👗', aspectTall:true },
  { slug:'ao', name:'Áo', count:124, emoji:'👔' },
  { slug:'phu-kien', name:'Phụ kiện', count:58, emoji:'👜' },
  { slug:'giay', name:'Giày', count:73, emoji:'👠' },
]

export const REVIEWS: Review[] = [
  { id:1, author:'Trần Phương Linh', avatar:'🌸', rating:5, text:'Chất lượng vải tuyệt vời, đường may tinh tế đến từng chi tiết. Đây là lần thứ ba tôi mua và chưa bao giờ thất vọng.', date:'15 tháng 3, 2025', verified:true },
  { id:2, author:'Nguyễn Hà My', avatar:'🎭', rating:5, text:'Đặt hàng tối, sáng hôm sau đã nhận được. Đóng gói đẹp như quà tặng. Sản phẩm vượt xa kỳ vọng của tôi.', date:'8 tháng 3, 2025', verified:true },
  { id:3, author:'Lê Thùy Dương', avatar:'💎', rating:5, text:'Mặc chiếc đầm này đến tiệc cưới và nhận được hàng chục lời khen. Cắt may rất tốt, vừa vặn hoàn hảo.', date:'1 tháng 3, 2025', verified:true },
]

export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + 'đ'
}
