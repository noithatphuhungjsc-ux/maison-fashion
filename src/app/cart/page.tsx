'use client'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import type { Size } from '@/types'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/layout/CartDrawer'
import CustomCursor from '@/components/layout/CustomCursor'
import Footer from '@/components/layout/Footer'

export default function CartPage() {
  const { items, remove, changeQty, total, count } = useCart()

  if (items.length === 0) {
    return (
      <>
        <CustomCursor /><CartDrawer /><Navbar />
        <main className="pt-[72px] min-h-screen flex flex-col items-center justify-center gap-6">
          <span className="text-8xl opacity-20">🛍</span>
          <h1 className="font-serif text-4xl font-light">Giỏ hàng trống</h1>
          <p className="text-muted text-[15px]">Hãy khám phá bộ sưu tập của chúng tôi</p>
          <Link href="/#products"
            className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] tracking-[0.18em] uppercase font-medium px-10 py-4 transition-colors">
            Mua sắm ngay
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const subtotal = total()
  const shipping = subtotal >= 2_000_000 ? 0 : 50_000
  const grandTotal = subtotal + shipping

  return (
    <>
      <CustomCursor /><CartDrawer /><Navbar />
      <main className="pt-[72px] px-12 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">Giỏ hàng của bạn</p>
          <h1 className="font-serif text-[48px] font-light">{count()} sản phẩm</h1>
        </div>

        <div className="grid grid-cols-[1fr_380px] gap-12 items-start">
          {/* Items */}
          <div className="space-y-px bg-white/7">
            {/* Table head */}
            <div className="grid grid-cols-[1fr_100px_140px_100px_40px] gap-4 items-center bg-[#131210] px-6 py-3 text-[10px] tracking-[0.2em] uppercase text-muted/60">
              <span>Sản phẩm</span>
              <span className="text-center">Đơn giá</span>
              <span className="text-center">Số lượng</span>
              <span className="text-right">Thành tiền</span>
              <span />
            </div>

            {items.map(item => (
              <div key={`${item.productId}-${item.size}`}
                className="grid grid-cols-[1fr_100px_140px_100px_40px] gap-4 items-center bg-[#0b0a08] px-6 py-5">
                {/* Product */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-[#131210] flex items-center justify-center text-3xl flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div>
                    <p className="font-serif text-[17px] font-light leading-tight">{item.name}</p>
                    <p className="text-[11px] text-muted/60 tracking-[0.1em] mt-1">Size: {item.size}</p>
                  </div>
                </div>
                {/* Unit price */}
                <p className="text-center text-[13px] font-mono text-muted">{formatPrice(item.price)}</p>
                {/* Qty */}
                <div className="flex items-center justify-center border border-white/13 w-fit mx-auto">
                  <button onClick={() => changeQty(item.productId, item.size as Size, -1)}
                    className="w-9 h-9 text-muted hover:text-[#c8a96e] transition-colors text-lg flex items-center justify-center">−</button>
                  <span className="w-8 text-center font-mono text-[13px]">{item.qty}</span>
                  <button onClick={() => changeQty(item.productId, item.size as Size, 1)}
                    className="w-9 h-9 text-muted hover:text-[#c8a96e] transition-colors text-lg flex items-center justify-center">+</button>
                </div>
                {/* Subtotal */}
                <p className="text-right font-mono text-[14px] font-medium text-[#c8a96e]">
                  {formatPrice(item.price * item.qty)}
                </p>
                {/* Remove */}
                <button onClick={() => remove(item.productId, item.size as Size)}
                  className="text-muted/40 hover:text-red-400 transition-colors text-lg flex items-center justify-center">
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-[#131210] border border-white/7 p-8 sticky top-24">
            <h2 className="font-serif text-2xl font-light mb-7">Tóm tắt đơn hàng</h2>
            <div className="space-y-3 pb-6 border-b border-white/7">
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Tạm tính ({count()} sp)</span>
                <span className="font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-muted">Phí vận chuyển</span>
                <span className={`font-mono ${shipping === 0 ? 'text-green-400' : ''}`}>
                  {shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-[11px] text-muted/50">
                  Mua thêm {formatPrice(2_000_000 - subtotal)} để được miễn phí ship
                </p>
              )}
            </div>
            <div className="flex justify-between items-baseline py-5">
              <span className="text-[13px] tracking-[0.1em] uppercase text-muted">Tổng cộng</span>
              <span className="font-serif text-3xl text-[#c8a96e]">{formatPrice(grandTotal)}</span>
            </div>

            {/* Promo code */}
            <div className="flex gap-0 mb-6 border border-white/13">
              <input type="text" placeholder="Mã ưu đãi"
                className="flex-1 bg-transparent px-4 py-3 text-[12px] outline-none placeholder:text-muted/50" />
              <button className="px-5 text-[11px] tracking-[0.12em] uppercase text-[#c8a96e] hover:text-[#e8d0a0] transition-colors border-l border-white/13">
                Áp dụng
              </button>
            </div>

            <button className="w-full bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] py-5 text-[12px] tracking-[0.18em] uppercase font-medium transition-colors mb-3">
              Tiến hành thanh toán →
            </button>
            <Link href="/"
              className="block text-center text-[11px] tracking-[0.15em] uppercase text-muted hover:text-[#f0ede6] transition-colors py-3 border border-white/13 hover:border-white/30">
              Tiếp tục mua sắm
            </Link>

            {/* Payment icons */}
            <div className="flex gap-2 justify-center mt-5">
              {['VISA','MC','MOMO','VNPay'].map(p => (
                <div key={p} className="bg-[#1f1e1b] border border-white/7 px-2 py-1 text-[9px] tracking-[0.1em] text-muted/50 font-mono">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
