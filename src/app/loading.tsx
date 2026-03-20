export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b0a08] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="font-serif text-[28px] font-medium tracking-[0.25em] text-[#c8a96e] animate-pulse">
          MAISON
        </div>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#c8a96e] to-transparent animate-pulse" />
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#c8a96e]/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
