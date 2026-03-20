'use client'
import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Size } from '@/types'

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { items, remove, changeQty, total, count } = useCart()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('maison:open-cart', handler)
    return () => window.removeEventListener('maison:open-cart', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          'fixed inset-0 bg-black/50 z-[199] transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />

      {/* Drawer */}
      <aside className={cn(
        'fixed top-0 right-0 w-full sm:w-[400px] md:w-[440px] h-screen bg-[#131210] border-l border-white/7 z-[200] flex flex-col transition-transform duration-[400ms]',
        'cubic-bezier(0.25,0.46,0.45,0.94)',
        open ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-white/7">
          <div>
            <h2 className="font-serif text-2xl font-light">Giỏ hàng</h2>
            <p className="text-[12px] text-muted font-mono mt-0.5">
              {count()} sản phẩm
            </p>
          </div>
          <button onClick={() => setOpen(false)}
            className="text-muted hover:text-[#f0ede6] text-xl transition-colors leading-none">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <span className="text-6xl opacity-20">🛍</span>
              <p className="font-serif text-xl font-light text-muted">Giỏ hàng trống</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <CartItem
                key={`${item.productId}-${item.size}`}
                item={item}
                onRemove={() => remove(item.productId, item.size as Size)}
                onQty={(d) => changeQty(item.productId, item.size as Size, d)}
                last={idx === items.length - 1}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-white/7 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] tracking-[0.12em] uppercase text-muted">Tạm tính</span>
              <span className="font-serif text-3xl font-light text-[#c8a96e]">
                {formatPrice(total())}
              </span>
            </div>
            <p className="text-[11px] text-muted/60">Phí vận chuyển tính lúc thanh toán</p>
            <button className="w-full bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[12px] tracking-[0.18em] uppercase font-medium py-[18px] transition-colors">
              Thanh toán ngay →
            </button>
            <button onClick={() => setOpen(false)}
              className="w-full border border-white/13 text-muted hover:border-white/40 hover:text-[#f0ede6] text-[11px] tracking-[0.15em] uppercase py-3.5 transition-all">
              Tiếp tục mua sắm
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

function CartItem({ item, onRemove, onQty, last }: {
  item: { name: string; price: number; size: string; qty: number; emoji: string }
  onRemove: () => void
  onQty: (d: number) => void
  last: boolean
}) {
  return (
    <div className={cn('flex gap-4 py-5', !last && 'border-b border-white/7')}>
      <div className="w-20 h-24 bg-[#1a1916] flex items-center justify-center text-3xl flex-shrink-0">
        {item.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif text-[17px] font-light leading-tight">{item.name}</p>
        <p className="text-[11px] text-faint tracking-[0.1em] mt-1">Size: {item.size}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-white/13">
            <button onClick={() => onQty(-1)}
              className="w-[30px] h-[30px] flex items-center justify-center text-muted hover:text-[#c8a96e] transition-colors text-lg">
              −
            </button>
            <span className="w-8 text-center text-[13px] font-mono">{item.qty}</span>
            <button onClick={() => onQty(1)}
              className="w-[30px] h-[30px] flex items-center justify-center text-muted hover:text-[#c8a96e] transition-colors text-lg">
              +
            </button>
          </div>
          <span className="text-[14px] font-medium text-[#c8a96e] font-mono">
            {formatPrice(item.price * item.qty)}
          </span>
        </div>
        <button onClick={onRemove}
          className="text-[11px] text-muted/50 hover:text-red-400 transition-colors uppercase tracking-[0.1em] mt-2 block">
          Xóa
        </button>
      </div>
    </div>
  )
}
