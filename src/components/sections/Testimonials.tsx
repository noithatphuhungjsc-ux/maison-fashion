import type { Review } from '@/types'

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  return (
    <section id="reviews" className="px-5 md:px-12 py-16 md:py-24 bg-[#0b0a08]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-3">Khách hàng nói gì</p>
          <h2 className="font-serif text-[32px] md:text-[clamp(36px,4vw,56px)] font-light leading-[1.1]">
            Đánh giá<br />thực tế
          </h2>
        </div>
        <div className="text-[13px] text-muted">
          <span className="font-serif text-[32px] md:text-[40px] text-[#c8a96e] font-light">4.9</span>
          &nbsp;/ 5 &nbsp;·&nbsp; 2.847 đánh giá
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/7">
        {reviews.map(r => (
          <div key={r.id} className="bg-[#0b0a08] px-6 py-8 md:px-10 md:py-12">
            <div className="text-[#c8a96e] text-base tracking-[2px] mb-5">
              {'★'.repeat(r.rating)}
            </div>
            <blockquote className="font-serif text-[18px] md:text-[20px] font-light italic leading-[1.65] mb-8">
              &ldquo;{r.text}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#2a2825] flex items-center justify-center text-base">
                {r.avatar}
              </div>
              <div>
                <p className="text-[13px] font-medium">{r.author}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] text-muted/60">{r.date}</p>
                  {r.verified && (
                    <span className="text-[9px] tracking-[0.1em] uppercase text-[#c8a96e] bg-[#c8a96e]/10 px-1.5 py-0.5 rounded">✓ Đã mua</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
