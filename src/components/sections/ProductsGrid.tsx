import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types'

interface Props { products: Product[] }

export default function ProductsGrid({ products }: Props) {
  return (
    <section id="products" className="px-12 py-24">
      {/* Header */}
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">Mới nhất</p>
          <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-light leading-[1.1]">
            Bộ sưu tập<br />nổi bật
          </h2>
        </div>
        <button className="text-[12px] tracking-[0.12em] uppercase text-muted hover:text-[#c8a96e] transition-colors flex items-center gap-2 group">
          Xem tất cả
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* Grid — 4 cols, 1px gap via background trick */}
      <div className="grid grid-cols-4 gap-px bg-white/7">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
