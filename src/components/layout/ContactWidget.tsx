'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const CHANNELS = [
  {
    name: 'Zalo',
    icon: '💬',
    color: '#0068FF',
    href: 'https://zalo.me/0901234567',
  },
  {
    name: 'Messenger',
    icon: '💙',
    color: '#0084FF',
    href: 'https://m.me/maison.fashion',
  },
  {
    name: 'WhatsApp',
    icon: '💚',
    color: '#25D366',
    href: 'https://wa.me/84901234567?text=Xin%20ch%C3%A0o%20MAISON',
  },
  {
    name: 'Gọi điện',
    icon: '📞',
    color: '#c8a96e',
    href: 'tel:18006868',
  },
]

export default function ContactWidget() {
  const [open, setOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: 'Xin chào! Tôi là trợ lý MAISON. Tôi có thể giúp gì cho bạn?' },
  ])
  const [input, setInput] = useState('')

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setInput('')

    // Simple bot responses
    setTimeout(() => {
      let reply = 'Cảm ơn bạn! Nhân viên tư vấn sẽ liên hệ trong ít phút. Hoặc gọi hotline 1800-6868.'
      const lower = userMsg.toLowerCase()
      if (lower.includes('size') || lower.includes('cỡ')) {
        reply = 'Bảng size MAISON: XS (76-80cm ngực), S (80-84), M (84-88), L (88-92), XL (92-96). Bạn muốn tư vấn size cho sản phẩm nào?'
      } else if (lower.includes('ship') || lower.includes('giao')) {
        reply = 'MAISON miễn phí ship cho đơn trên 2 triệu. Giao toàn quốc trong 2-5 ngày.'
      } else if (lower.includes('giá') || lower.includes('bao nhiêu')) {
        reply = 'Giá sản phẩm từ 1.650.000đ - 6.800.000đ. Bạn quan tâm sản phẩm nào?'
      } else if (lower.includes('đổi') || lower.includes('trả')) {
        reply = 'MAISON hỗ trợ đổi trả miễn phí trong 30 ngày. Sản phẩm cần còn nguyên tag và chưa qua sử dụng.'
      }
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    }, 800)
  }

  return (
    <>
      {/* Chat window */}
      {chatOpen && (
        <div className="fixed bottom-24 right-5 md:right-8 z-[300] w-[340px] bg-[#131210] border border-white/13 rounded-xl shadow-2xl overflow-hidden">
          {/* Chat header */}
          <div className="bg-[#c8a96e] px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[#0b0a08] text-[13px] font-medium">MAISON Chat</p>
              <p className="text-[#0b0a08]/60 text-[10px]">Online - Trả lời ngay</p>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-[#0b0a08] text-lg">✕</button>
          </div>

          {/* Messages */}
          <div className="h-[300px] overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={cn(
                  'max-w-[80%] px-3 py-2 rounded-lg text-[13px] leading-[1.6]',
                  msg.role === 'user'
                    ? 'bg-[#c8a96e] text-[#0b0a08]'
                    : 'bg-[#1f1e1b] text-[#f0ede6]'
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="border-t border-white/7 flex">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-transparent px-4 py-3 text-[13px] outline-none placeholder:text-muted/50"
            />
            <button type="submit" className="px-4 text-[#c8a96e] hover:text-[#e8d0a0] transition-colors text-lg">
              ➤
            </button>
          </form>
        </div>
      )}

      {/* Contact channels popup */}
      {open && !chatOpen && (
        <div className="fixed bottom-24 right-5 md:right-8 z-[300] space-y-2">
          {CHANNELS.map(ch => (
            <a
              key={ch.name}
              href={ch.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#131210] border border-white/13 pl-4 pr-5 py-3 rounded-full shadow-lg hover:border-[#c8a96e] transition-colors"
            >
              <span className="text-xl">{ch.icon}</span>
              <span className="text-[13px] text-[#f0ede6]">{ch.name}</span>
            </a>
          ))}

          {/* Chatbot button - separated below */}
          <div className="pt-1 border-t border-white/7">
            <button
              onClick={() => { setChatOpen(true); setOpen(false) }}
              className="flex items-center gap-3 bg-[#1a1916] border border-[#c8a96e]/30 pl-4 pr-5 py-3 rounded-full shadow-lg hover:border-[#c8a96e] transition-colors w-full mt-2"
            >
              <span className="text-xl">🤖</span>
              <span className="text-[13px] text-[#c8a96e] font-medium">Chat với MAISON Bot</span>
            </button>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => { setOpen(!open); if (chatOpen) setChatOpen(false) }}
        className={cn(
          'fixed bottom-5 right-5 md:bottom-8 md:right-8 z-[301] w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all',
          open || chatOpen
            ? 'bg-[#1f1e1b] border border-white/13 rotate-45'
            : 'bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08]'
        )}
      >
        {open || chatOpen ? '✕' : '💬'}
      </button>
    </>
  )
}
