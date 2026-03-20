import Link from 'next/link'

const LINKS = {
  'Mua sắm': [
    { label: 'Tất cả sản phẩm', href: '/products' },
    { label: 'Bộ sưu tập mới', href: '/products?filter=new' },
    { label: 'Khuyến mãi', href: '/products?filter=sale' },
    { label: 'Outfit of the day', href: '/lookbook' },
    { label: 'Lookbook 2025', href: '/lookbook' },
  ],
  'Hỗ trợ': [
    { label: 'Hướng dẫn chọn size', href: '/size-guide' },
    { label: 'Chính sách đổi trả', href: '/returns' },
    { label: 'Theo dõi đơn hàng', href: '/track' },
    { label: 'Câu hỏi thường gặp', href: '/faq' },
    { label: 'Liên hệ', href: '/contact' },
  ],
  'Công ty': [
    { label: 'Về MAISON', href: '/about' },
    { label: 'Tuyển dụng', href: '/careers' },
    { label: 'Phát triển bền vững', href: '/sustainability' },
    { label: 'Báo chí', href: '/press' },
    { label: 'Đại lý', href: '/wholesale' },
  ],
}

const SOCIALS = [
  { label: 'ig', href: '#' },
  { label: 'fb', href: '#' },
  { label: 'tt', href: '#' },
  { label: 'yt', href: '#' },
]

const PAYMENTS = ['VISA', 'MC', 'MOMO', 'VNPay', 'COD']

export default function Footer() {
  return (
    <footer className="px-12 pt-20 pb-10 border-t border-white/7">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-14 mb-16">
        {/* Brand */}
        <div>
          <p className="font-serif text-[28px] font-medium tracking-[0.15em] mb-4">MAISON</p>
          <p className="text-[13px] text-muted leading-[1.8] mb-7 max-w-[280px]">
            Thời trang cao cấp được chế tác từ chất liệu bền vững, mang tính nghệ thuật và phong cách riêng biệt từ năm 2012.
          </p>
          <div className="flex gap-3">
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href}
                className="w-[38px] h-[38px] border border-white/13 hover:border-[#c8a96e] flex items-center justify-center text-[13px] text-muted hover:text-[#c8a96e] transition-all">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([title, links]) => (
          <div key={title}>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#c8a96e] mb-5">{title}</p>
            <ul className="space-y-2.5">
              {links.map(l => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="text-[13px] text-muted hover:text-[#f0ede6] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/7 pt-8 flex items-center justify-between">
        <p className="text-[12px] text-muted/50">© 2025 MAISON. Bảo lưu mọi quyền.</p>
        <div className="flex gap-2">
          {PAYMENTS.map(p => (
            <div key={p}
              className="bg-[#1f1e1b] border border-white/7 px-2.5 py-1 text-[10px] tracking-[0.08em] text-muted/60 font-mono">
              {p}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted/50">Thiết kế tại Việt Nam 🇻🇳</p>
      </div>
    </footer>
  )
}
