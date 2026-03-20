'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'
import type { UserRole } from '@/types/database'

type Mode = 'login' | 'register'

export default function AdminLoginPage() {
  const router = useRouter()
  const { user, profile, loading, initialize, login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('customer')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { initialize() }, [initialize])

  useEffect(() => {
    if (user && profile) {
      router.push('/admin')
    }
  }, [user, profile, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (mode === 'login') {
      const res = await login(email, password)
      if (res.error) setError(res.error)
    } else {
      if (!fullName.trim()) {
        setError('Vui long nhap ho ten')
        setSubmitting(false)
        return
      }
      const res = await register(email, password, fullName, role)
      if (res.error) setError(res.error)
    }

    setSubmitting(false)
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
            {mode === 'login' ? 'Dang nhap he thong' : 'Tao tai khoan moi'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#131210] border border-white/7 rounded-lg p-8">
          {/* Mode toggle */}
          <div className="flex mb-8 bg-[#0b0a08] rounded-lg p-1">
            <button
              type="button"
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-2.5 text-[12px] tracking-[0.1em] uppercase rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-[#c8a96e] text-[#0b0a08] font-medium'
                  : 'text-muted hover:text-[#f0ede6]'
              }`}
            >
              Dang nhap
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 py-2.5 text-[12px] tracking-[0.1em] uppercase rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-[#c8a96e] text-[#0b0a08] font-medium'
                  : 'text-muted hover:text-[#f0ede6]'
              }`}
            >
              Dang ky
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded text-red-300 text-[12px]">
              {error}
            </div>
          )}

          {/* Name (register only) */}
          {mode === 'register' && (
            <div className="mb-4">
              <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Ho va ten</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e] transition-colors placeholder:text-muted/30"
                placeholder="Nguyen Van A"
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e] transition-colors placeholder:text-muted/30"
              placeholder="email@example.com"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Mat khau</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e] transition-colors placeholder:text-muted/30"
              placeholder="••••••••"
            />
          </div>

          {/* Role selector (register only) */}
          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Vai tro</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'customer' as UserRole, label: 'Khach hang', icon: '👤' },
                  { value: 'manager' as UserRole, label: 'Quan ly', icon: '👔' },
                  { value: 'workshop' as UserRole, label: 'Xuong SX', icon: '🏭' },
                ]).map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`py-3 rounded text-center transition-all border ${
                      role === r.value
                        ? 'bg-[#c8a96e]/10 border-[#c8a96e]/40 text-[#c8a96e]'
                        : 'border-white/7 text-muted hover:text-[#f0ede6] hover:border-white/13'
                    }`}
                  >
                    <span className="text-lg block mb-1">{r.icon}</span>
                    <span className="text-[10px] tracking-[0.05em]">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[12px] font-medium tracking-[0.15em] uppercase py-4 rounded transition-colors disabled:opacity-50"
          >
            {submitting
              ? 'Dang xu ly...'
              : mode === 'login'
                ? 'Dang nhap'
                : 'Tao tai khoan'
            }
          </button>
        </form>

        {/* Quick login buttons */}
        {mode === 'login' && (
          <div className="mt-6 bg-[#131210] border border-white/7 rounded-lg p-4">
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-3 text-center">Dang nhap nhanh</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Quan ly', icon: '👔', email: 'manager@maison.com', color: '#c8a96e' },
                { label: 'Khach hang', icon: '👤', email: 'customer@maison.com', color: '#68b5a0' },
                { label: 'Xuong SX', icon: '🏭', email: 'workshop@maison.com', color: '#a0c8e8' },
              ].map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword('maison123'); setError('') }}
                  className="py-3 rounded border border-white/7 hover:border-current text-center transition-all"
                  style={{ color: acc.color }}
                >
                  <span className="text-lg block mb-1">{acc.icon}</span>
                  <span className="text-[10px] tracking-[0.05em] block">{acc.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Back to home */}
        <div className="text-center mt-6">
          <a href="/" className="text-[12px] text-muted hover:text-[#c8a96e] transition-colors">
            ← Ve trang chu
          </a>
        </div>
      </div>
    </div>
  )
}
