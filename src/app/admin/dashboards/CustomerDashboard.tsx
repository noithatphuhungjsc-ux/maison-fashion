'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/store/auth'
import type { OrderRow } from '@/types/database'

export default function CustomerDashboard() {
  const { profile } = useAuth()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      setOrders((data || []) as OrderRow[])
    } catch {
      // fallback
    } finally {
      setLoading(false)
    }
  }

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Cho xac nhan', color: 'bg-yellow-900/30 text-yellow-300' },
    confirmed: { label: 'Da xac nhan', color: 'bg-blue-900/30 text-blue-300' },
    shipping: { label: 'Dang giao', color: 'bg-purple-900/30 text-purple-300' },
    delivered: { label: 'Da giao', color: 'bg-green-900/30 text-green-300' },
    cancelled: { label: 'Da huy', color: 'bg-red-900/30 text-red-300' },
  }

  const totalSpent = orders.reduce((s, o) => s + (o.payment_status === 'paid' ? o.total : 0), 0)
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status)).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#68b5a0] animate-pulse">Dang tai...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-serif text-[24px] md:text-[28px] font-normal">
          Xin chao, {profile?.full_name || 'Khach hang'}
        </h1>
        <p className="text-[13px] text-muted mt-1">Quan ly don hang va tai khoan cua ban</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Tong don', value: orders.length.toString(), color: '#68b5a0', icon: '📦' },
          { label: 'Dang xu ly', value: activeOrders.toString(), color: '#e8c0a0', icon: '⏳' },
          { label: 'Da chi', value: formatPrice(totalSpent), color: '#c8a96e', icon: '💰' },
          { label: 'Yeu thich', value: '—', color: '#e8a0c8', icon: '❤️' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#1a1916] border border-white/7 p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <span>{stat.icon}</span>
              <p className="text-[10px] tracking-[0.12em] uppercase text-muted">{stat.label}</p>
            </div>
            <p className="font-serif text-[22px] font-normal" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Orders */}
      <h2 className="text-[13px] tracking-[0.1em] uppercase text-[#68b5a0] mb-3">Don hang cua ban</h2>
      <div className="bg-[#1a1916] border border-white/7 rounded overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-4">📦</span>
            <p className="text-[14px] text-muted mb-2">Ban chua co don hang nao</p>
            <a href="/products" className="text-[12px] text-[#c8a96e] hover:text-[#e8d0a0] transition-colors">
              Mua sam ngay →
            </a>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {orders.map(order => {
              const status = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-white/5 text-muted' }
              return (
                <div key={order.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-medium font-mono">{order.order_number}</p>
                      <p className="text-[11px] text-muted mt-1">
                        {new Date(order.created_at).toLocaleDateString('vi-VN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                      {order.notes && (
                        <p className="text-[11px] text-muted/70 mt-1">Ghi chu: {order.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[14px] text-[#c8a96e]">{formatPrice(order.total)}</p>
                      <span className={`inline-block mt-1 text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Order progress bar */}
                  <div className="mt-3 flex items-center gap-1">
                    {['pending', 'confirmed', 'shipping', 'delivered'].map((step, i) => {
                      const steps = ['pending', 'confirmed', 'shipping', 'delivered']
                      const currentIdx = steps.indexOf(order.status)
                      const isCompleted = i <= currentIdx
                      const isCancelled = order.status === 'cancelled'
                      return (
                        <div key={step} className="flex-1">
                          <div className={`h-1.5 rounded-full ${
                            isCancelled ? 'bg-red-900/30'
                            : isCompleted ? 'bg-[#68b5a0]'
                            : 'bg-white/5'
                          }`} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
