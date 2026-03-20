import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0a08] via-[#1a1916] to-[#0b0a08]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a08] via-[#0b0a08]/80 to-transparent z-10" />

      {/* Decorative — right side, desktop only */}
      <div className="hidden md:flex absolute inset-y-0 right-0 w-[40%] items-center justify-center z-0">
        <span className="text-[120px] opacity-10 select-none">👗</span>
      </div>

      {/* Content */}
      <div className="relative z-20 px-5 md:px-12 pt-28 md:pt-36 pb-16 md:pb-20 max-w-[700px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-px bg-[#c8a96e]" />
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#c8a96e]">BST 2025</span>
        </div>

        <h1 className="font-serif text-[40px] md:text-[68px] font-normal leading-[1.15] mb-6">
          Vẻ đẹp<br />trong từng<br />
          <em className="not-italic text-[#e8d0a0]">chi tiết</em>
        </h1>

        <p className="text-[14px] text-muted leading-[1.8] max-w-[380px] mb-8">
          Thời trang được chế tác từ những chất liệu cao cấp nhất — nơi phong cách gặp gỡ sự tinh tế và bền vững.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link href="/#products"
            className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] font-medium tracking-[0.15em] uppercase px-9 py-4 transition-all text-center">
            Khám phá ngay
          </Link>
          <Link href="/#story"
            className="border border-white/13 hover:border-[#c8a96e] text-[#f0ede6] hover:text-[#c8a96e] text-[11px] font-medium tracking-[0.15em] uppercase px-9 py-[15px] transition-all text-center">
            Về chúng tôi
          </Link>
        </div>

        {/* Stats — below buttons */}
        <div className="flex gap-8 md:gap-12 pt-8 border-t border-white/7">
          {[
            { num: '12+', label: 'Năm kinh nghiệm' },
            { num: '8k+', label: 'Khách hàng' },
            { num: '200+', label: 'Thiết kế độc quyền' },
          ].map(s => (
            <div key={s.label}>
              <div className="font-serif text-[28px] md:text-[36px] font-normal text-[#c8a96e]">{s.num}</div>
              <div className="text-[10px] md:text-[11px] tracking-[0.12em] uppercase text-muted/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
