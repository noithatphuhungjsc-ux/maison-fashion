import type { Category } from '@/types'

export default function Categories({ categories }: { categories: Category[] }) {
  return (
    <section id="categories" className="px-5 md:px-12 pb-16 md:pb-24">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">Danh mục</p>
          <h2 className="font-serif text-[32px] md:text-[clamp(36px,4vw,56px)] font-light leading-[1.1]">
            Phong cách<br />của bạn
          </h2>
        </div>
        <a href="/products" className="text-[12px] tracking-[0.12em] uppercase text-muted hover:text-[#c8a96e] transition-colors flex items-center gap-2 group">
          Khám phá tất cả
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-0.5">
        {categories.map(cat => (
          <a
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className={`relative overflow-hidden cursor-pointer group block ${cat.aspectTall ? 'md:row-span-2' : ''}`}
          >
            <div className={`w-full bg-[#131210] flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-[1.05] ${cat.aspectTall ? 'h-[250px] md:h-full md:min-h-[500px]' : 'aspect-square'}`}>
              <span className="text-[60px] md:text-[80px] opacity-50 group-hover:opacity-70 transition-opacity select-none">
                {cat.emoji}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-7 md:right-7">
              <p className="font-serif text-[22px] md:text-[28px] font-light">{cat.name}</p>
              <p className="text-[11px] tracking-[0.15em] uppercase text-white/50 mt-1">{cat.count} sản phẩm</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
