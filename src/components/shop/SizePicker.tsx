'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Size } from '@/types'

interface Props {
  sizes: Size[]
  value: Size | null
  onChange: (s: Size) => void
}

export default function SizePicker({ sizes, value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {sizes.map(s => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={cn(
            'w-11 h-11 border text-[12px] font-mono transition-all flex items-center justify-center',
            value === s
              ? 'border-[#c8a96e] text-[#c8a96e] bg-[#c8a96e]/8'
              : 'border-white/13 text-muted hover:border-[#c8a96e]/50 hover:text-[#c8a96e]'
          )}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
