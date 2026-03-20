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

import { getProducts, getFeaturedProduct, getCategories, getReviews } from '@/lib/queries'

export const revalidate = 60 // ISR: revalidate every 60s

export default async function HomePage() {
  const [products, featured, categories, reviews] = await Promise.all([
    getProducts(),
    getFeaturedProduct(),
    getCategories(),
    getReviews(),
  ])

  return (
    <>
      <CustomCursor />
      <CartDrawer />
      <PromoBar message="Miễn phí vận chuyển cho đơn hàng trên 2.000.000đ · Dùng mã MAISON15 giảm 15%" />
      <Navbar />

      <main>
        <Hero />
        <Marquee items={['Bộ sưu tập Xuân Hè 2025','Thiết kế độc quyền','Chất liệu cao cấp','Giao hàng toàn quốc','Đổi trả miễn phí 30 ngày']} />
        <ProductsGrid products={products} />
        <FeaturedProduct product={featured} />
        <Categories categories={categories} />
        <BrandStory />
        <Testimonials reviews={reviews} />
        <Newsletter />
      </main>

      <Footer />
    </>
  )
}
