interface Props { message: string }

export default function PromoBar({ message }: Props) {
  return (
    <div className="bg-[#c8a96e] py-2 md:py-2.5 text-center text-[9px] md:text-[11px] tracking-[0.12em] md:tracking-[0.2em] uppercase text-[#0b0a08] font-medium px-4">
      {message}
    </div>
  )
}
