'use client'
import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useCart, useWishlist } from '@/store/cart'
import { formatPrice, discount } from '@/lib/utils'
import SizePicker from '@/components/shop/SizePicker'
import ProductCard from '@/components/shop/ProductCard'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/layout/CartDrawer'
import CustomCursor from '@/components/layout/CustomCursor'
import Footer from '@/components/layout/Footer'
import type { Product, Size } from '@/types'

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product
  related: Product[]
}) {
  const [size, setSize] = useState<Size | null>(null)
  const [qty, setQty] = useState(1)
  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(product.id)

  function handleAdd() {
    if (!size) { toast.error('Vui lòng chọn size'); return }
    for (let i = 0; i < qty; i++) {
      add({ productId: product.id, name: product.name, price: product.price, size, emoji: product.emoji })
    }
    toast.success(`Đã thêm ${qty} × "${product.name}" size ${size}`)
  }

  return (
    <>
      <CustomCursor />
      <CartDrawer />
      <Navbar />

      <main className="pt-[60px] md:pt-[72px]">
        {/* Breadcrumb */}
        <div className="px-5 md:px-12 py-4 border-b border-white/7 flex items-center gap-2 text-[11px] tracking-[0.1em] text-muted/60">
          <Link href="/" className="hover:text-[#c8a96e] transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#c8a96e] transition-colors">Sản phẩm</Link>
          <span>/</span>
          <span className="text-[#f0ede6] truncate">{product.name}</span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/7 min-h-[50vh] md:min-h-[80vh]">
          {/* Gallery */}
          <div className="bg-[#131210] md:sticky md:top-[72px] md:self-start">
            <div className="aspect-square flex items-center justify-center">
              <span className="text-[100px] md:text-[160px] select-none opacity-60">{product.emoji}</span>
            </div>
            {/* Thumbnails strip */}
            <div className="flex gap-px border-t border-white/7">
              {[...Array(4)].map((_, i) => (
                <div key={i}
                  className={`flex-1 aspect-square bg-[#1a1916] flex items-center justify-center text-3xl md:text-5xl cursor-pointer transition-opacity ${i === 0 ? 'opacity-100 ring-1 ring-inset ring-[#c8a96e]' : 'opacity-40 hover:opacity-70'}`}>
                  {product.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-[#0b0a08] px-5 py-10 md:px-16 md:py-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">{product.tag}</p>
            <h1 className="font-serif text-[32px] md:text-[42px] font-light leading-[1.15] mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#c8a96e] text-sm tracking-[2px]">{'★'.repeat(Math.round(product.rating))}</span>
              <span className="text-[12px] text-muted">{product.rating} ({product.reviewCount} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 md:gap-4 mb-8 pb-8 border-b border-white/7 flex-wrap">
              <span className="font-serif text-4xl md:text-5xl font-light text-[#c8a96e]">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg md:text-xl text-muted/60 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-[11px] tracking-[0.1em] uppercase bg-red-900/40 text-red-300 border border-red-800/50 px-2 py-0.5">
                    -{discount(product.price, product.originalPrice)}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-[14px] md:text-[15px] text-muted leading-[1.9] mb-8">{product.description}</p>
            )}

            {/* Details */}
            {product.details && (
              <ul className="space-y-2 mb-8 pb-8 border-b border-white/7">
                {product.details.map(d => (
                  <li key={d} className="flex items-start gap-2 text-[13px] text-muted">
                    <span className="text-[#c8a96e] text-[10px] mt-1.5 flex-shrink-0">✦</span>
                    {d}
                  </li>
                ))}
              </ul>
            )}

            {/* Size */}
            <div className="mb-6">
              <p className="text-[12px] tracking-[0.1em] uppercase text-muted mb-3">Chọn size</p>
              <SizePicker sizes={product.sizes} value={size} onChange={setSize} />
            </div>

            {/* Qty */}
            <div className="mb-8">
              <p className="text-[12px] tracking-[0.1em] uppercase text-muted mb-3">Số lượng</p>
              <div className="flex items-center border border-white/13 w-fit">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-muted hover:text-[#c8a96e] transition-colors text-xl">
                  −
                </button>
                <span className="w-10 text-center font-mono text-[15px]">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-muted hover:text-[#c8a96e] transition-colors text-xl">
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-10">
              <button onClick={handleAdd}
                className="flex-1 bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[12px] tracking-[0.18em] uppercase font-medium py-5 transition-colors">
                Thêm vào giỏ hàng
              </button>
              <button onClick={() => toggle(product.id)}
                className="w-14 border border-white/13 hover:border-[#c8a96e] flex items-center justify-center text-xl transition-all"
                style={{ color: wished ? '#c8a96e' : 'rgba(240,237,230,0.5)' }}>
                {wished ? '♥' : '♡'}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/7">
              {[
                { icon: '🚚', title: 'Miễn phí vận chuyển', sub: 'Đơn hàng trên 2tr' },
                { icon: '↩', title: 'Đổi trả 30 ngày', sub: 'Hoàn tiền 100%' },
                { icon: '🛡', title: 'Bảo hành', sub: 'Chính hãng 1 năm' },
              ].map(b => (
                <div key={b.title} className="text-center">
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <p className="text-[11px] md:text-[12px] font-medium">{b.title}</p>
                  <p className="text-[10px] md:text-[11px] text-muted/60 mt-0.5">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="px-5 md:px-12 py-14 md:py-20">
            <div className="mb-10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">Có thể bạn thích</p>
              <h2 className="font-serif text-[28px] md:text-[36px] font-light">Sản phẩm tương tự</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/7">
              {related.map(p => <ProductCard key={p.slug} product={p} />)}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
