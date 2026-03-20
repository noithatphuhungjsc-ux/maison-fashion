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
  const [mobileOpen, setMobileOpen] = useState(false)
  const count = useCart(s => s.count())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openCart = () => window.dispatchEvent(new CustomEvent('maison:open-cart'))

  return (
    <>
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-12 h-[60px] md:h-[72px] transition-all duration-300',
        scrolled && 'bg-[#0b0a08]/92 backdrop-blur-xl border-b border-white/7'
      )}>
        {/* Logo */}
        <Link href="/" className="font-serif text-[18px] md:text-[22px] font-medium tracking-[0.25em] text-[#f0ede6] hover:text-[#c8a96e] transition-colors">
          MAISON
        </Link>

        {/* Nav links — desktop */}
        <ul className="hidden md:flex gap-9 list-none">
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
        <div className="flex items-center gap-4 md:gap-5">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="hidden md:block bg-transparent border-b border-white/7 focus:border-[#c8a96e] text-[12px] tracking-[0.05em] placeholder:text-muted text-[#f0ede6] px-2 py-1 w-36 outline-none transition-colors font-sans"
          />
          <button onClick={openCart} className="relative text-muted hover:text-[#f0ede6] text-lg transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] bg-[#c8a96e] rounded-full text-[9px] flex items-center justify-center text-[#0b0a08] font-bold font-mono">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>
          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-muted hover:text-[#f0ede6] text-xl transition-colors">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[60px] bg-[#0b0a08]/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 md:hidden">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
              className="font-serif text-[24px] font-light text-[#f0ede6] hover:text-[#c8a96e] transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/products" onClick={() => setMobileOpen(false)}
            className="mt-4 bg-[#c8a96e] text-[#0b0a08] text-[11px] tracking-[0.15em] uppercase font-medium px-8 py-3">
            Tất cả sản phẩm
          </Link>
        </div>
      )}
    </>
  )
}
