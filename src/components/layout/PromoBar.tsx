interface Props { message: string }

export default function PromoBar({ message }: Props) {
  return (
    <div className="bg-[#c8a96e] py-2.5 text-center text-[11px] tracking-[0.2em] uppercase text-[#0b0a08] font-medium">
      {message}
    </div>
  )
}
