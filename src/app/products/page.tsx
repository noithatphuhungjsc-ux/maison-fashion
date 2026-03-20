import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/layout/CartDrawer'
import CustomCursor from '@/components/layout/CustomCursor'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/shop/ProductCard'
import { getProducts } from '@/lib/queries'
import { CATEGORY_LABELS } from '@/types'
import type { ProductCategory } from '@/types'

export const metadata: Metadata = { title: 'Tất cả sản phẩm' }
export const revalidate = 60

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; filter?: string; sort?: string }
}) {
  const { category, filter, sort } = searchParams

  const allProducts = await getProducts()
  let products = [...allProducts]

  if (category) products = products.filter(p => p.category === category)
  if (filter === 'new') products = products.filter(p => p.badge === 'new')
  if (filter === 'sale') products = products.filter(p => p.badge === 'sale')

  if (sort === 'price-asc') products.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price)
  else if (sort === 'rating') products.sort((a, b) => b.rating - a.rating)

  const categories = Object.entries(CATEGORY_LABELS) as [ProductCategory, string][]
  const counts = Object.fromEntries(
    categories.map(([cat]) => [cat, allProducts.filter(p => p.category === cat).length])
  )

  return (
    <>
      <CustomCursor /><CartDrawer /><Navbar />
      <main className="pt-[60px] md:pt-[72px]">
        {/* Header */}
        <div className="px-5 md:px-12 py-10 md:py-16 border-b border-white/7 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">
              {category ? CATEGORY_LABELS[category as ProductCategory] : 'Tất cả'}
            </p>
            <h1 className="font-serif text-[36px] md:text-[56px] font-light leading-[1.05]">
              {filter === 'sale' ? 'Khuyến mãi' : filter === 'new' ? 'Hàng mới về' : 'Bộ sưu tập'}
            </h1>
          </div>
          <p className="text-muted text-[13px]">{products.length} sản phẩm</p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Sidebar filters — hidden on mobile, shown as horizontal on small */}
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/7 px-5 md:px-8 py-6 md:py-10 flex-shrink-0">
            {/* Mobile: horizontal scroll filters */}
            <div className="flex md:flex-col gap-6 md:gap-0 overflow-x-auto md:overflow-visible">
              <div className="md:mb-10 flex-shrink-0">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] mb-3 md:mb-5">Danh mục</p>
                <ul className="flex md:flex-col gap-2 md:gap-2.5">
                  <li>
                    <a href="/products" className={`text-[13px] transition-colors whitespace-nowrap ${!category ? 'text-[#c8a96e]' : 'text-muted hover:text-[#f0ede6]'}`}>
                      Tất cả ({allProducts.length})
                    </a>
                  </li>
                  {categories.map(([slug, label]) => (
                    <li key={slug}>
                      <a href={`/products?category=${slug}`}
                        className={`text-[13px] transition-colors flex justify-between whitespace-nowrap gap-2 ${category === slug ? 'text-[#c8a96e]' : 'text-muted hover:text-[#f0ede6]'}`}>
                        {label}
                        <span className="text-muted/50 hidden md:inline">{counts[slug] ?? 0}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:mb-10 flex-shrink-0">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] mb-3 md:mb-5">Lọc theo</p>
                <div className="flex md:flex-col gap-2">
                  {[
                    { value: 'new', label: 'Hàng mới về' },
                    { value: 'sale', label: 'Đang giảm giá' },
                  ].map(f => (
                    <a key={f.value} href={`/products?filter=${f.value}`}
                      className={`flex items-center gap-2 text-[13px] transition-colors whitespace-nowrap ${filter === f.value ? 'text-[#c8a96e]' : 'text-muted hover:text-[#f0ede6]'}`}>
                      <span className={`w-3.5 h-3.5 border ${filter === f.value ? 'border-[#c8a96e] bg-[#c8a96e]/20' : 'border-white/20'} flex items-center justify-center text-[8px]`}>
                        {filter === f.value ? '✓' : ''}
                      </span>
                      {f.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] mb-3 md:mb-5">Sắp xếp</p>
                <ul className="flex md:flex-col gap-2 md:gap-2.5">
                  {[
                    { value: '', label: 'Mặc định' },
                    { value: 'price-asc', label: 'Giá tăng dần' },
                    { value: 'price-desc', label: 'Giá giảm dần' },
                    { value: 'rating', label: 'Đánh giá cao nhất' },
                  ].map(s => (
                    <li key={s.value}>
                      <a href={`/products${s.value ? `?sort=${s.value}` : ''}`}
                        className={`text-[13px] transition-colors whitespace-nowrap ${sort === s.value || (!sort && !s.value) ? 'text-[#c8a96e]' : 'text-muted hover:text-[#f0ede6]'}`}>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 p-4 md:p-8">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <p className="font-serif text-2xl font-light text-muted">Không tìm thấy sản phẩm</p>
                <a href="/products" className="text-[12px] tracking-[0.12em] uppercase text-[#c8a96e] hover:underline">
                  Xem tất cả →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/7">
                {products.map(p => <ProductCard key={p.slug} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
