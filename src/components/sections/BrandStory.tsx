export default function BrandStory() {
  return (
    <section id="story" className="bg-[#131210] px-5 md:px-12 py-16 md:py-28">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        {/* Media */}
        <div className="relative">
          <div className="w-full aspect-[3/4] bg-[#1a1916] flex items-center justify-center">
            <span className="text-[80px] md:text-[100px] opacity-30 select-none">🪡</span>
          </div>
          {/* Accent border */}
          <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-[60%] h-[60%] border border-[#c8a96e] pointer-events-none" />
        </div>

        {/* Text */}
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#c8a96e] mb-5">Câu chuyện của chúng tôi</p>
          <h2 className="font-serif text-[32px] md:text-[48px] font-light leading-[1.15] mb-7">
            Thời trang không chỉ là trang phục — đó là ngôn ngữ
          </h2>
          <p className="text-[14px] md:text-[15px] text-muted leading-[1.9] mb-6">
            Được thành lập năm 2012 tại Hà Nội, MAISON ra đời từ niềm đam mê với thời trang bền vững và nghề may thủ công truyền thống Việt Nam. Mỗi sản phẩm của chúng tôi là sự kết hợp giữa kỹ thuật hiện đại và hồn cốt dân tộc.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted leading-[1.9] mb-10">
            Chúng tôi tin rằng người mặc xứng đáng được mặc những gì tốt nhất — không phải vì thương hiệu, mà vì chất liệu thật sự, đường may thật sự, và cảm giác thật sự.
          </p>
          <p className="font-serif italic text-[24px] md:text-[28px] text-[#c8a96e]">Nguyễn Minh Châu</p>
          <p className="text-[11px] tracking-[0.15em] uppercase text-muted/60 mt-1">
            Nhà sáng lập & Creative Director
          </p>
        </div>
      </div>
    </section>
  )
}
