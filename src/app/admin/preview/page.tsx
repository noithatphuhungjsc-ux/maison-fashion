'use client'
import { useState } from 'react'
import { useAuth } from '@/store/auth'
import AdminLayout from '../AdminLayout'

type PreviewDevice = 'mobile' | 'tablet' | 'desktop'

const DEVICES: Record<PreviewDevice, { w: string; label: string }> = {
  mobile: { w: '375px', label: '📱 iPhone (375px)' },
  tablet: { w: '768px', label: '📱 iPad (768px)' },
  desktop: { w: '100%', label: '🖥 Desktop (100%)' },
}

const PAGES = [
  { url: '/', label: 'Trang chu' },
  { url: '/products', label: 'San pham' },
  { url: '/products?filter=sale', label: 'Khuyen mai' },
  { url: '/cart', label: 'Gio hang' },
]

export default function PreviewPage() {
  const { profile } = useAuth()
  const [previewUrl, setPreviewUrl] = useState('/')

  if (profile?.role !== 'manager') {
    return <AdminLayout><p className="text-muted p-6">Khong co quyen truy cap</p></AdminLayout>
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-[24px] md:text-[28px] font-normal">Preview</h1>
          <select
            value={previewUrl}
            onChange={e => setPreviewUrl(e.target.value)}
            className="bg-[#1a1916] border border-white/13 text-[12px] px-3 py-2 rounded text-[#f0ede6] outline-none"
          >
            {PAGES.map(p => <option key={p.url} value={p.url}>{p.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[375px_1fr] gap-6">
          {/* Mobile */}
          <div>
            <p className="text-[11px] tracking-[0.1em] uppercase text-[#c8a96e] mb-3">📱 Mobile (375px)</p>
            <div className="bg-[#1a1916] border border-white/13 rounded-xl overflow-hidden" style={{ width: '375px' }}>
              <div className="bg-[#0b0a08] h-6 flex items-center justify-center">
                <div className="w-24 h-3 bg-[#1a1916] rounded-full" />
              </div>
              <iframe src={previewUrl} className="w-full bg-white" style={{ height: '667px' }} title="Mobile preview" />
              <div className="bg-[#0b0a08] h-5 flex items-center justify-center">
                <div className="w-28 h-1 bg-white/20 rounded-full" />
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden xl:block">
            <p className="text-[11px] tracking-[0.1em] uppercase text-[#c8a96e] mb-3">🖥 Desktop</p>
            <div className="bg-[#1a1916] border border-white/13 rounded-lg overflow-hidden">
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
              <iframe src={previewUrl} className="w-full bg-white" style={{ height: '700px' }} title="Desktop preview" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
