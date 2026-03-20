import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'

interface Props { products: Product[] }

export default function ProductsGrid({ products }: Props) {
  return (
    <section id="products" className="px-5 md:px-12 py-16 md:py-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">Mới nhất</p>
          <h2 className="font-serif text-[32px] md:text-[clamp(36px,4vw,56px)] font-light leading-[1.1]">
            Bộ sưu tập<br />nổi bật
          </h2>
        </div>
        <a href="/products" className="text-[12px] tracking-[0.12em] uppercase text-muted hover:text-[#c8a96e] transition-colors flex items-center gap-2 group">
          Xem tất cả
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      {/* Grid — responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/7">
        {products.map(p => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  )
}
