import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import ContactWidget from '@/components/layout/ContactWidget'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'MAISON — Thời trang cao cấp', template: '%s | MAISON' },
  description: 'Thời trang được chế tác từ những chất liệu cao cấp nhất — nơi phong cách gặp gỡ sự tinh tế.',
  keywords: ['thời trang', 'cao cấp', 'đầm', 'áo', 'váy', 'luxury fashion', 'vietnam'],
  openGraph: {
    title: 'MAISON — Thời trang cao cấp',
    description: 'Bộ sưu tập 2025 — Vẻ đẹp trong từng chi tiết',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body>
        {children}
        <ContactWidget />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#2a2825',
              border: '1px solid rgba(255,255,255,0.13)',
              color: '#f0ede6',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
