'use client'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    toast.success('Đăng ký thành công! Cảm ơn bạn.', { icon: '✓' })
    setEmail('')
    setLoading(false)
  }

  return (
    <section className="px-12 py-24 bg-[#131210] border-t border-white/7">
      <div className="max-w-[620px] mx-auto text-center">
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">Tham gia cộng đồng</p>
        <h2 className="font-serif text-[clamp(36px,5vw,56px)] font-light leading-[1.1] mb-4">
          Nhận ưu đãi<br />độc quyền
        </h2>
        <p className="text-[14px] text-muted leading-[1.8] mb-12">
          Đăng ký để nhận thông tin bộ sưu tập mới, ưu đãi thành viên và nội dung hậu trường độc quyền từ đội ngũ thiết kế.
        </p>
        <form onSubmit={handleSubmit} className="flex border border-white/13 max-w-[480px] mx-auto">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="flex-1 bg-transparent px-5 py-4 text-[13px] text-[#f0ede6] placeholder:text-muted/60 outline-none font-sans"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#c8a96e] hover:bg-[#e8d0a0] disabled:opacity-60 text-[#0b0a08] px-7 text-[11px] tracking-[0.15em] uppercase font-medium transition-colors whitespace-nowrap"
          >
            {loading ? '...' : 'Đăng ký'}
          </button>
        </form>
        <p className="text-[11px] text-muted/50 mt-4 tracking-[0.05em]">
          Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất kỳ lúc nào.
        </p>
      </div>
    </section>
  )
}
