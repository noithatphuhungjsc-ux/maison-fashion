'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCart, useWishlist } from '@/store/cart'
import { formatPrice, cn } from '@/lib/utils'
import type { Product } from '@/types'

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const { add } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(product.id)

  function handleAdd() {
    add({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: 'M',
      emoji: product.emoji,
    })
    toast.success(`Đã thêm "${product.name}"`, {
      icon: '✓',
      description: 'Size M — đổi size trong giỏ hàng',
    })
  }

  function handleWish(e: React.MouseEvent) {
    e.stopPropagation()
    toggle(product.id)
    toast(wished ? 'Đã xóa khỏi yêu thích' : 'Đã thêm vào yêu thích', {
      icon: wished ? '♡' : '♥',
    })
  }

  return (
    <div
      className="bg-[#0b0a08] relative overflow-hidden group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badges */}
      {product.badge === 'sale' && (
        <div className="absolute top-4 left-4 z-10 bg-[#c0392b] text-white text-[9px] tracking-[0.12em] uppercase px-2 py-1">SALE</div>
      )}
      {product.badge === 'new' && (
        <div className="absolute top-4 left-4 z-10 bg-[#2a2825] text-[#c8a96e] border border-[#8a6e3d] text-[9px] tracking-[0.12em] uppercase px-2 py-1">NEW</div>
      )}

      {/* Wishlist */}
      <button
        onClick={handleWish}
        className={cn(
          'absolute top-4 right-4 z-10 w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm transition-all',
          'bg-black/50 hover:bg-[#c8a96e]/20',
          wished ? 'text-[#c8a96e]' : 'text-muted hover:text-[#c8a96e]'
        )}
      >
        {wished ? '♥' : '♡'}
      </button>

      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden relative bg-[#131210]">
        <div className={cn(
          'w-full h-full flex items-center justify-center text-[60px] transition-transform duration-700',
          'cubic-bezier(0.25,0.46,0.45,0.94)',
          hovered && 'scale-[1.04]'
        )}>
          {product.emoji}
        </div>

        {/* Hover overlay */}
        <div className={cn(
          'absolute inset-0 bg-black/45 flex items-center justify-center transition-opacity duration-300',
          hovered ? 'opacity-100' : 'opacity-0'
        )}>
          <button
            onClick={handleAdd}
            className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] tracking-[0.15em] uppercase px-7 py-3 font-medium transition-colors"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96e] mb-1.5">{product.tag}</p>
        <h3 className="font-serif text-[20px] font-light leading-tight">{product.name}</h3>
        <div className="flex items-center justify-between mt-2.5">
          <div className="text-[14px] font-medium">
            {product.originalPrice && (
              <span className="text-muted/60 text-[12px] line-through mr-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {formatPrice(product.price)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted/60">
            <span className="text-[#c8a96e] text-[12px]">★</span>
            {product.rating} ({product.reviewCount})
          </div>
        </div>
      </div>
    </div>
  )
}
