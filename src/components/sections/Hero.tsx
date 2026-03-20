import Link from 'next/link'

export default function Hero() {
  return (
    <section className="min-h-screen md:h-screen flex relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a08] via-[#0b0a08]/70 to-transparent z-10 pointer-events-none" />

      {/* Right: image placeholder */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[55%]">
        <div className="w-full h-full bg-gradient-to-br from-[#1a1916] via-[#2a2825] to-[#1f1e1b] flex items-center justify-center">
          <span className="text-[80px] md:text-[120px] opacity-15 select-none">👗</span>
        </div>
      </div>

      {/* Left: content */}
      <div className="relative z-20 flex flex-col justify-end pb-32 md:pb-16 px-5 md:pl-12 w-full md:w-[55%]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-px bg-[#c8a96e]" />
          <span className="text-[11px] tracking-[0.25em] uppercase text-[#c8a96e]">Bộ sưu tập 2025</span>
        </div>

        <h1 className="font-serif text-[42px] md:text-[clamp(56px,6vw,88px)] font-light leading-[1.0] tracking-[-0.01em] mb-8">
          Vẻ đẹp<br />trong từng<br />
          <em className="not-italic text-[#e8d0a0]">chi tiết</em>
        </h1>

        <p className="text-[14px] text-muted leading-[1.8] max-w-[380px] mb-10 md:mb-12">
          Thời trang được chế tác từ những chất liệu cao cấp nhất — nơi phong cách gặp gỡ sự tinh tế và bền vững.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <Link href="/#products"
            className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] font-medium tracking-[0.15em] uppercase px-9 py-4 transition-all hover:-translate-y-px text-center w-full sm:w-auto">
            Khám phá ngay
          </Link>
          <Link href="/#story"
            className="border border-white/13 hover:border-[#c8a96e] text-[#f0ede6] hover:text-[#c8a96e] text-[11px] font-medium tracking-[0.15em] uppercase px-9 py-[15px] transition-all text-center w-full sm:w-auto">
            Về chúng tôi
          </Link>
        </div>
      </div>

      {/* Stats — hidden on mobile */}
      <div className="hidden md:flex absolute bottom-12 left-12 z-20 gap-10">
        {[
          { num: '12+', label: 'Năm kinh nghiệm' },
          { num: '8k+', label: 'Khách hàng' },
          { num: '200+', label: 'Thiết kế độc quyền' },
        ].map(s => (
          <div key={s.label}>
            <div className="font-serif text-[36px] font-light text-[#c8a96e]">{s.num}</div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-muted/60">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator — hidden on mobile */}
      <div className="hidden md:flex absolute bottom-12 right-12 z-20 flex-col items-center gap-2">
        <div className="w-px h-12 bg-gradient-to-b from-[#c8a96e] to-transparent animate-[scroll-line_2s_ease-in-out_infinite]" />
        <span className="text-[10px] tracking-[0.2em] uppercase text-muted/50 [writing-mode:vertical-rl]">Cuộn xuống</span>
      </div>
    </section>
  )
}
