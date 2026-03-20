'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/cart'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/#products', label: 'Bộ sưu tập' },
  { href: '/#categories', label: 'Danh mục' },
  { href: '/#featured', label: 'Nổi bật' },
  { href: '/#story', label: 'Thương hiệu' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const count = useCart(s => s.count())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Communicate with CartDrawer via custom event
  const openCart = () => window.dispatchEvent(new CustomEvent('maison:open-cart'))

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-[72px] transition-all duration-300',
      scrolled && 'bg-[#0b0a08]/92 backdrop-blur-xl border-b border-white/7'
    )}>
      {/* Logo */}
      <Link href="/" className="font-serif text-[22px] font-medium tracking-[0.25em] text-[#f0ede6] hover:text-[#c8a96e] transition-colors">
        MAISON
      </Link>

      {/* Nav links */}
      <ul className="flex gap-9 list-none">
        {LINKS.map(l => (
          <li key={l.href}>
            <Link href={l.href}
              className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted hover:text-[#f0ede6] transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className="flex items-center gap-5">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="bg-transparent border-b border-white/7 focus:border-[#c8a96e] text-[12px] tracking-[0.05em] placeholder:text-muted text-[#f0ede6] px-2 py-1 w-36 outline-none transition-colors font-sans"
        />
        <button className="text-muted hover:text-[#f0ede6] text-lg transition-colors">
          ♡
        </button>
        <button onClick={openCart} className="relative text-muted hover:text-[#f0ede6] text-lg transition-colors">
          ☰
          {count > 0 && (
            <span className="absolute -top-1 -right-1 w-[14px] h-[14px] bg-[#c8a96e] rounded-full text-[9px] flex items-center justify-center text-[#0b0a08] font-bold font-mono">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
