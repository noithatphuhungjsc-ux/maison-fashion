'use client'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import type { Product, Category, Review } from '@/types'

type Tab = 'overview' | 'products' | 'preview'
type PreviewDevice = 'mobile' | 'tablet' | 'desktop'

interface Props {
  products: Product[]
  categories: Category[]
  reviews: Review[]
}

export default function AdminDashboard({ products, categories, reviews }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop')
  const [previewUrl, setPreviewUrl] = useState('/')

  const totalRevenue = products.reduce((s, p) => s + p.price * p.reviewCount, 0)
  const totalProducts = products.length
  const avgRating = (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1)
  const totalReviews = products.reduce((s, p) => s + p.reviewCount, 0)

  const deviceSizes: Record<PreviewDevice, { w: string; label: string }> = {
    mobile: { w: '375px', label: '📱 iPhone (375px)' },
    tablet: { w: '768px', label: '📱 iPad (768px)' },
    desktop: { w: '100%', label: '🖥 Desktop (100%)' },
  }

  const pages = [
    { url: '/', label: 'Trang chủ' },
    { url: '/products', label: 'Sản phẩm' },
    { url: '/products?filter=sale', label: 'Khuyến mãi' },
    { url: '/cart', label: 'Giỏ hàng' },
  ]

  return (
    <div className="min-h-screen bg-[#0f0e0c] text-[#f0ede6]">
      {/* Top bar */}
      <header className="bg-[#1a1916] border-b border-white/7 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-serif text-[20px] font-medium tracking-[0.2em]">MAISON</span>
          <span className="text-[10px] tracking-[0.15em] uppercase bg-[#c8a96e] text-[#0b0a08] px-2 py-0.5 font-medium">ADMIN</span>
        </div>
        <a href="/" className="text-[12px] text-muted hover:text-[#c8a96e] transition-colors">
          ← Về trang chủ
        </a>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-[#131210] border-r border-white/7 min-h-[calc(100vh-57px)] p-4">
          <nav className="space-y-1">
            {([
              { key: 'overview', icon: '📊', label: 'Tổng quan' },
              { key: 'products', icon: '🏷', label: 'Sản phẩm' },
              { key: 'preview', icon: '👁', label: 'Preview' },
            ] as { key: Tab; icon: string; label: string }[]).map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`w-full text-left px-4 py-3 text-[13px] rounded transition-colors flex items-center gap-3 ${
                  tab === item.key
                    ? 'bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/20'
                    : 'text-muted hover:text-[#f0ede6] hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div>
              <h1 className="font-serif text-[28px] font-normal mb-6">Tổng quan</h1>

              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Sản phẩm', value: totalProducts.toString(), color: '#c8a96e' },
                  { label: 'Danh mục', value: categories.length.toString(), color: '#68b5a0' },
                  { label: 'Đánh giá TB', value: `${avgRating} ★`, color: '#e8d0a0' },
                  { label: 'Tổng đánh giá', value: totalReviews.toLocaleString(), color: '#a0c8e8' },
                ].map(stat => (
                  <div key={stat.label} className="bg-[#1a1916] border border-white/7 p-5 rounded">
                    <p className="text-[11px] tracking-[0.15em] uppercase text-muted mb-2">{stat.label}</p>
                    <p className="font-serif text-[32px] font-normal" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent products */}
              <h2 className="text-[14px] tracking-[0.1em] uppercase text-[#c8a96e] mb-4">Sản phẩm gần đây</h2>
              <div className="bg-[#1a1916] border border-white/7 rounded overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/7 text-[10px] tracking-[0.15em] uppercase text-muted">
                      <th className="text-left px-4 py-3">Sản phẩm</th>
                      <th className="text-left px-4 py-3">Danh mục</th>
                      <th className="text-right px-4 py-3">Giá</th>
                      <th className="text-center px-4 py-3">Đánh giá</th>
                      <th className="text-center px-4 py-3">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.slug} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{p.emoji}</span>
                            <div>
                              <p className="text-[13px] font-medium">{p.name}</p>
                              <p className="text-[11px] text-muted">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-muted">{p.category}</td>
                        <td className="px-4 py-3 text-[13px] text-right font-mono text-[#c8a96e]">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[12px]">★ {p.rating}</span>
                          <span className="text-[11px] text-muted ml-1">({p.reviewCount})</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {p.badge && (
                            <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded ${
                              p.badge === 'sale' ? 'bg-red-900/30 text-red-300' : 'bg-[#c8a96e]/10 text-[#c8a96e]'
                            }`}>{p.badge}</span>
                          )}
                          {p.inStock ? (
                            <span className="text-[9px] tracking-[0.1em] uppercase text-green-400 ml-2">Còn hàng</span>
                          ) : (
                            <span className="text-[9px] tracking-[0.1em] uppercase text-red-400 ml-2">Hết hàng</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Reviews */}
              <h2 className="text-[14px] tracking-[0.1em] uppercase text-[#c8a96e] mb-4 mt-8">Đánh giá gần đây</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reviews.map(r => (
                  <div key={r.id} className="bg-[#1a1916] border border-white/7 p-5 rounded">
                    <div className="text-[#c8a96e] text-sm mb-2">{'★'.repeat(r.rating)}</div>
                    <p className="text-[13px] text-muted leading-[1.6] mb-3 line-clamp-3">{r.text}</p>
                    <p className="text-[12px] font-medium">{r.author}</p>
                    <p className="text-[10px] text-muted/50">{r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-serif text-[28px] font-normal">Quản lý sản phẩm</h1>
                <span className="text-[12px] text-muted">{products.length} sản phẩm</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                  <div key={p.slug} className="bg-[#1a1916] border border-white/7 rounded overflow-hidden group">
                    <div className="aspect-[4/3] bg-[#131210] flex items-center justify-center">
                      <span className="text-[60px] opacity-60">{p.emoji}</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] tracking-[0.15em] uppercase text-[#c8a96e]">{p.tag}</p>
                        {p.badge && (
                          <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded ${
                            p.badge === 'sale' ? 'bg-red-900/30 text-red-300' : 'bg-[#c8a96e]/10 text-[#c8a96e]'
                          }`}>{p.badge}</span>
                        )}
                      </div>
                      <h3 className="font-serif text-[18px] font-normal mb-1">{p.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[14px] text-[#c8a96e]">{formatPrice(p.price)}</span>
                        <span className="text-[11px] text-muted">★ {p.rating} ({p.reviewCount})</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <span className="text-[10px] text-muted bg-white/5 px-2 py-1 rounded">{p.category}</span>
                        <span className="text-[10px] text-muted bg-white/5 px-2 py-1 rounded">{p.sizes.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREVIEW TAB — 2 screens */}
          {tab === 'preview' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-serif text-[28px] font-normal">Preview</h1>
                <div className="flex items-center gap-3">
                  {/* Page selector */}
                  <select
                    value={previewUrl}
                    onChange={e => setPreviewUrl(e.target.value)}
                    className="bg-[#1a1916] border border-white/13 text-[12px] px-3 py-2 rounded text-[#f0ede6] outline-none"
                  >
                    {pages.map(p => (
                      <option key={p.url} value={p.url}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Device toggles */}
              <div className="flex gap-2 mb-6">
                {(Object.keys(deviceSizes) as PreviewDevice[]).map(device => (
                  <button
                    key={device}
                    onClick={() => setPreviewDevice(device)}
                    className={`px-4 py-2 text-[12px] rounded transition-colors ${
                      previewDevice === device
                        ? 'bg-[#c8a96e] text-[#0b0a08] font-medium'
                        : 'bg-[#1a1916] text-muted hover:text-[#f0ede6] border border-white/7'
                    }`}
                  >
                    {deviceSizes[device].label}
                  </button>
                ))}
              </div>

              {/* Dual preview: Mobile + Desktop side by side */}
              <div className="grid grid-cols-1 xl:grid-cols-[375px_1fr] gap-6">
                {/* Mobile preview */}
                <div>
                  <p className="text-[11px] tracking-[0.1em] uppercase text-[#c8a96e] mb-3">📱 Mobile (375px)</p>
                  <div className="bg-[#1a1916] border border-white/13 rounded-xl overflow-hidden" style={{ width: '375px' }}>
                    {/* Phone notch */}
                    <div className="bg-[#0b0a08] h-6 flex items-center justify-center">
                      <div className="w-24 h-3 bg-[#1a1916] rounded-full" />
                    </div>
                    <iframe
                      src={previewUrl}
                      className="w-full bg-white"
                      style={{ height: '667px' }}
                      title="Mobile preview"
                    />
                    {/* Phone home bar */}
                    <div className="bg-[#0b0a08] h-5 flex items-center justify-center">
                      <div className="w-28 h-1 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Desktop preview */}
                <div>
                  <p className="text-[11px] tracking-[0.1em] uppercase text-[#c8a96e] mb-3">🖥 Desktop</p>
                  <div className="bg-[#1a1916] border border-white/13 rounded-lg overflow-hidden">
                    {/* Browser bar */}
                    <div className="bg-[#0b0a08] px-4 py-2 flex items-center gap-2 border-b border-white/7">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                        <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      </div>
                      <div className="flex-1 bg-[#1a1916] rounded px-3 py-1 text-[11px] text-muted ml-3">
                        maison-fashion.vercel.app{previewUrl}
                      </div>
                    </div>
                    <iframe
                      src={previewUrl}
                      className="w-full bg-white"
                      style={{ height: '700px' }}
                      title="Desktop preview"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
