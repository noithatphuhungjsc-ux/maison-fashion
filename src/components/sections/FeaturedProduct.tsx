'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCart, useWishlist } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import SizePicker from '@/components/shop/SizePicker'
import type { Product, Size } from '@/types'

interface Props { product: Product }

export default function FeaturedProduct({ product }: Props) {
  const [size, setSize] = useState<Size | null>('M')
  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(product.id)

  function handleAdd() {
    if (!size) { toast.error('Vui lòng chọn size'); return }
    add({ productId: product.id, name: product.name, price: product.price, size, emoji: product.emoji })
    toast.success(`Đã thêm "${product.name}" size ${size}`)
  }

  return (
    <section id="featured" className="px-5 md:px-12 pb-16 md:pb-24">
      {/* Section header */}
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">Sản phẩm của tuần</p>
          <h2 className="font-serif text-[32px] md:text-[clamp(36px,4vw,56px)] font-light leading-[1.1]">
            Đầm dạ hội<br /><em className="not-italic text-[#e8d0a0]">Noir Silk</em>
          </h2>
        </div>
      </div>

      {/* 2-col layout — stacks on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/7">
        {/* Media */}
        <div className="bg-[#131210] aspect-square flex items-center justify-center relative overflow-hidden">
          <span className="text-[100px] md:text-[140px] opacity-60 select-none">{product.emoji}</span>
          <div className="absolute bottom-6 left-6 text-[11px] tracking-[0.2em] uppercase text-white/35">
            Silk · 100% cao cấp
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#0b0a08] px-5 py-10 md:px-20 md:py-20 flex flex-col justify-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-4">{product.tag}</p>
          <h3 className="font-serif text-[28px] md:text-[36px] font-light leading-[1.2] mb-4">
            {product.name}<br />
            <em className="not-italic text-muted text-[22px] md:text-[28px]">tay bồng</em>
          </h3>

          <p className="text-[14px] text-muted leading-[1.9] mb-7 max-w-[480px]">
            {product.description}
          </p>

          {/* Details */}
          {product.details && (
            <ul className="space-y-1.5 mb-8">
              {product.details.map(d => (
                <li key={d} className="flex items-center gap-2 text-[13px] text-muted">
                  <span className="text-[#c8a96e] text-[10px]">✦</span> {d}
                </li>
              ))}
            </ul>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="font-serif text-4xl md:text-5xl font-light text-[#c8a96e]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[18px] md:text-[20px] text-muted/60 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Size */}
          <p className="text-[12px] tracking-[0.1em] uppercase text-muted mb-2.5">Chọn size</p>
          <SizePicker sizes={product.sizes} value={size} onChange={setSize} />

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button onClick={handleAdd}
              className="flex-1 bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[12px] tracking-[0.18em] uppercase font-medium py-[18px] transition-colors">
              Thêm vào giỏ hàng
            </button>
            <button onClick={() => toggle(product.id)}
              className="w-14 border border-white/13 hover:border-[#c8a96e] flex items-center justify-center text-lg transition-all"
              style={{ color: wished ? '#c8a96e' : 'rgba(240,237,230,0.5)' }}
            >
              {wished ? '♥' : '♡'}
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex gap-6 mt-8 pt-8 border-t border-white/7">
            {[
              { icon: '🚚', label: 'Miễn phí vận chuyển' },
              { icon: '↩', label: 'Đổi trả 30 ngày' },
              { icon: '🛡', label: 'Bảo hành chính hãng' },
            ].map(b => (
              <div key={b.label} className="text-center">
                <div className="text-xl mb-1.5">{b.icon}</div>
                <div className="text-[10px] tracking-[0.1em] uppercase text-muted/60">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
