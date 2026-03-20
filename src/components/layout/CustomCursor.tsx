'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0, rx: 0, ry: 0 })

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      dot.style.left = `${e.clientX}px`
      dot.style.top  = `${e.clientY}px`
    }

    const onEnter = () => ring.classList.add('scale-150', '!border-[#c8a96e]')
    const onLeave = () => ring.classList.remove('scale-150', '!border-[#c8a96e]')

    let raf: number
    const animate = () => {
      pos.current.rx += (pos.current.x - pos.current.rx) * 0.12
      pos.current.ry += (pos.current.y - pos.current.ry) * 0.12
      ring.style.left = `${pos.current.rx}px`
      ring.style.top  = `${pos.current.ry}px`
      raf = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    animate()

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200"
        style={{ left: 0, top: 0 }}
      />
      <div ref={ringRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference w-9 h-9 border border-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
        style={{ left: 0, top: 0 }}
      />
    </>
  )
}
