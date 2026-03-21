'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'

const ACCOUNTS = [
  { label: 'Quan ly', icon: '👔', email: 'manager@maison.com', password: 'maison123', color: '#c8a96e' },
  { label: 'Khach hang', icon: '👤', email: 'customer@maison.com', password: 'maison123', color: '#68b5a0' },
  { label: 'Xuong SX', icon: '🏭', email: 'workshop@maison.com', password: 'maison123', color: '#a0c8e8' },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, profile, loading, initialize, login } = useAuth()
  const [error, setError] = useState('')
  const [loggingIn, setLoggingIn] = useState('')

  useEffect(() => { initialize() }, [initialize])

  useEffect(() => {
    if (user && profile) {
      router.push('/admin')
    }
  }, [user, profile, router])

  async function quickLogin(acc: typeof ACCOUNTS[0]) {
    setError('')
    setLoggingIn(acc.email)
    const res = await login(acc.email, acc.password)
    if (res.error) {
      setError(res.error)
      setLoggingIn('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0a08] flex items-center justify-center">
        <div className="text-[#c8a96e] text-lg animate-pulse">MAISON...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0a08] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-[36px] font-normal text-[#f0ede6] tracking-[0.15em]">MAISON</h1>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#c8a96e] mt-2">
            Chon vai tro de truy cap
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded text-red-300 text-[12px] text-center">
            {error}
          </div>
        )}

        {/* Role buttons */}
        <div className="space-y-3">
          {ACCOUNTS.map(acc => (
            <button
              key={acc.email}
              onClick={() => quickLogin(acc)}
              disabled={!!loggingIn}
              className="w-full bg-[#131210] border border-white/7 hover:border-current rounded-lg p-5 flex items-center gap-4 transition-all disabled:opacity-50"
              style={{ color: acc.color }}
            >
              <span className="text-3xl">{acc.icon}</span>
              <div className="text-left flex-1">
                <p className="text-[15px] font-medium">{acc.label}</p>
                <p className="text-[11px] text-muted">{acc.email}</p>
              </div>
              {loggingIn === acc.email ? (
                <span className="text-[12px] animate-pulse">Dang nhap...</span>
              ) : (
                <span className="text-[12px] text-muted">→</span>
              )}
            </button>
          ))}
        </div>

        {/* Back to home */}
        <div className="text-center mt-8">
          <a href="/" className="text-[12px] text-muted hover:text-[#c8a96e] transition-colors">
            ← Ve trang chu
          </a>
        </div>
      </div>
    </div>
  )
}
