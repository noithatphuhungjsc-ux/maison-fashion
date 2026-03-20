import Navbar from '@/components/layout/Navbar'
import CustomCursor from '@/components/layout/CustomCursor'
import CartDrawer from '@/components/layout/CartDrawer'
import Hero from '@/components/sections/Hero'
import Marquee from '@/components/sections/Marquee'
import ProductsGrid from '@/components/sections/ProductsGrid'
import FeaturedProduct from '@/components/sections/FeaturedProduct'
import Categories from '@/components/sections/Categories'
import BrandStory from '@/components/sections/BrandStory'
import Testimonials from '@/components/sections/Testimonials'
import Newsletter from '@/components/sections/Newsletter'
import Footer from '@/components/layout/Footer'
import PromoBar from '@/components/layout/PromoBar'

import { PRODUCTS, FEATURED_PRODUCT, CATEGORIES, REVIEWS } from '@/lib/data'

export default function HomePage() {
  return (
    <>
      <CustomCursor />
      <CartDrawer />
      <PromoBar message="Miễn phí vận chuyển cho đơn hàng trên 2.000.000đ · Dùng mã MAISON15 giảm 15%" />
      <Navbar />

      <main>
        <Hero />
        <Marquee items={['Bộ sưu tập Xuân Hè 2025','Thiết kế độc quyền','Chất liệu cao cấp','Giao hàng toàn quốc','Đổi trả miễn phí 30 ngày']} />
        <ProductsGrid products={PRODUCTS} />
        <FeaturedProduct product={FEATURED_PRODUCT} />
        <Categories categories={CATEGORIES} />
        <BrandStory />
        <Testimonials reviews={REVIEWS} />
        <Newsletter />
      </main>

      <Footer />
    </>
  )
}
