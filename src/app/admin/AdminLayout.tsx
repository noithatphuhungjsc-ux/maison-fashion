'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/store/auth'
import type { UserRole } from '@/types/database'

interface NavItem {
  key: string
  icon: string
  label: string
  href: string
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  manager: [
    { key: 'overview', icon: '📊', label: 'Tong quan', href: '/admin' },
    { key: 'products', icon: '🏷', label: 'San pham', href: '/admin/products' },
    { key: 'orders', icon: '📦', label: 'Don hang', href: '/admin/orders' },
    { key: 'workshops', icon: '🏭', label: 'Xuong SX', href: '/admin/workshops' },
    { key: 'users', icon: '👥', label: 'Nguoi dung', href: '/admin/users' },
    { key: 'preview', icon: '👁', label: 'Preview', href: '/admin/preview' },
  ],
  customer: [
    { key: 'overview', icon: '🏠', label: 'Tong quan', href: '/admin' },
    { key: 'orders', icon: '📦', label: 'Don hang', href: '/admin/my-orders' },
    { key: 'wishlist', icon: '❤️', label: 'Yeu thich', href: '/admin/wishlist' },
    { key: 'profile', icon: '👤', label: 'Ho so', href: '/admin/profile' },
  ],
  workshop: [
    { key: 'overview', icon: '🏭', label: 'Tong quan', href: '/admin' },
    { key: 'tasks', icon: '📋', label: 'Cong viec', href: '/admin/tasks' },
    { key: 'history', icon: '📊', label: 'Lich su', href: '/admin/task-history' },
    { key: 'profile', icon: '👤', label: 'Ho so', href: '/admin/profile' },
  ],
}

const ROLE_COLORS: Record<UserRole, string> = {
  manager: '#c8a96e',
  customer: '#68b5a0',
  workshop: '#a0c8e8',
}

const ROLE_BADGES: Record<UserRole, string> = {
  manager: 'QUAN LY',
  customer: 'KHACH HANG',
  workshop: 'XUONG SX',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, loading, initialized, initialize, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => { initialize() }, [initialize])

  useEffect(() => {
    if (initialized && !loading && !user) {
      router.push('/admin/login')
    }
  }, [initialized, loading, user, router])

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-[#0f0e0c] flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-[28px] text-[#c8a96e] mb-3 animate-pulse">MAISON</div>
          <p className="text-[11px] text-muted tracking-[0.15em] uppercase">Dang tai...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) return null

  const role = profile.role
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.customer
  const roleColor = ROLE_COLORS[role]

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    await logout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0f0e0c] text-[#f0ede6]">
      {/* Top bar */}
      <header className="bg-[#1a1916] border-b border-white/7 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* Mobile toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-muted hover:text-[#f0ede6] text-lg"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>

          <span className="font-serif text-[18px] md:text-[20px] font-medium tracking-[0.2em]">MAISON</span>
          <span
            className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 font-medium rounded"
            style={{ backgroundColor: roleColor, color: '#0b0a08' }}
          >
            {ROLE_BADGES[role]}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* User info */}
          <div className="hidden md:block text-right">
            <p className="text-[12px] font-medium">{profile.full_name || profile.email}</p>
            <p className="text-[10px] text-muted">{profile.email}</p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-[11px] text-muted hover:text-red-400 transition-colors tracking-[0.1em] uppercase"
          >
            Dang xuat
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-40 w-56 bg-[#131210] border-r border-white/7 min-h-[calc(100vh-49px)] p-4 transition-transform`}>
          {/* Role indicator */}
          <div className="mb-6 p-3 rounded-lg border border-white/5 bg-white/[0.02]">
            <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-1">Vai tro</p>
            <p className="text-[13px] font-medium" style={{ color: roleColor }}>
              {ROLE_BADGES[role]}
            </p>
            {role === 'workshop' && profile.workshop_name && (
              <p className="text-[11px] text-muted mt-1">{profile.workshop_name}</p>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map(item => (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  router.push(item.href)
                  if (window.innerWidth < 768) setSidebarOpen(false)
                }}
                className={`w-full text-left px-4 py-3 text-[13px] rounded transition-colors flex items-center gap-3 ${
                  isActive(item.href)
                    ? 'bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/20'
                    : 'text-muted hover:text-[#f0ede6] hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Quick link */}
          <div className="mt-8 pt-4 border-t border-white/5">
            <a
              href="/"
              className="flex items-center gap-2 text-[11px] text-muted hover:text-[#c8a96e] transition-colors px-4 py-2"
            >
              ← Ve trang chu
            </a>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 min-h-[calc(100vh-49px)] md:ml-0">
          {children}
        </main>
      </div>
    </div>
  )
}
