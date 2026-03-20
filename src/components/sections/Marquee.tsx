interface Props { items: string[] }

export default function Marquee({ items }: Props) {
  const all = [...items, ...items] // duplicate for seamless loop
  return (
    <div className="border-y border-white/7 py-4 overflow-hidden bg-[#131210]">
      <div className="flex animate-marquee whitespace-nowrap">
        {[0, 1].map(repeat => (
          <div key={repeat} className="flex shrink-0">
            {all.map((item, i) => (
              <span key={i} className="flex items-center gap-10 px-10 text-[11px] tracking-[0.2em] uppercase text-muted/60">
                {item}
                <span className="text-[#c8a96e] text-base">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
