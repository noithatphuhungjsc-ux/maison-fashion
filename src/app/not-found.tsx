import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center pt-[72px] px-12 text-center gap-8">
        <div className="font-mono text-[120px] font-light text-[#c8a96e]/20 leading-none">404</div>
        <div>
          <h1 className="font-serif text-[48px] font-light leading-[1.1] mb-4">
            Trang không tồn tại
          </h1>
          <p className="text-[15px] text-muted max-w-md leading-[1.8]">
            Trang bạn đang tìm kiếm có thể đã bị xóa hoặc địa chỉ URL không chính xác.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/"
            className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] tracking-[0.18em] uppercase font-medium px-9 py-4 transition-colors">
            Về trang chủ
          </Link>
          <Link href="/products"
            className="border border-white/13 hover:border-[#c8a96e] text-muted hover:text-[#c8a96e] text-[11px] tracking-[0.15em] uppercase px-9 py-[15px] transition-all">
            Xem sản phẩm
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
