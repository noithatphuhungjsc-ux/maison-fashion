'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/store/auth'
import AdminLayout from '../AdminLayout'
import type { OrderRow } from '@/types/database'

const ORDER_STATUSES = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'] as const

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Cho xac nhan', color: 'bg-yellow-900/30 text-yellow-300' },
  confirmed: { label: 'Da xac nhan', color: 'bg-blue-900/30 text-blue-300' },
  shipping: { label: 'Dang giao', color: 'bg-purple-900/30 text-purple-300' },
  delivered: { label: 'Da giao', color: 'bg-green-900/30 text-green-300' },
  cancelled: { label: 'Da huy', color: 'bg-red-900/30 text-red-300' },
}

const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chua TT', color: 'text-yellow-300' },
  paid: { label: 'Da TT', color: 'text-green-300' },
  refunded: { label: 'Hoan tien', color: 'text-red-300' },
}

export default function OrdersPage() {
  const { profile } = useAuth()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    setOrders((data || []) as OrderRow[])
    setLoading(false)
  }

  async function updateOrderStatus(orderId: string, status: string) {
    setUpdating(orderId)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    await loadOrders()
    setUpdating(null)
  }

  async function updatePaymentStatus(orderId: string, paymentStatus: string) {
    setUpdating(orderId)
    const updates: Record<string, string> = { payment_status: paymentStatus }
    if (paymentStatus === 'paid') {
      updates.paid_at = new Date().toISOString()
    }
    await supabase.from('orders').update(updates).eq('id', orderId)
    await loadOrders()
    setUpdating(null)
  }

  const filtered = orders.filter(o => !filterStatus || o.status === filterStatus)
  const totalRevenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0)

  if (profile?.role !== 'manager') {
    return <AdminLayout><p className="text-muted p-6">Khong co quyen truy cap</p></AdminLayout>
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-[24px] md:text-[28px] font-normal">Quan ly don hang</h1>
            <p className="text-[12px] text-muted mt-1">
              {orders.length} don | Doanh thu: <span className="text-[#c8a96e]">{formatPrice(totalRevenue)}</span>
            </p>
          </div>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterStatus('')}
            className={`px-3 py-1.5 text-[11px] rounded transition-colors ${
              !filterStatus ? 'bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/20' : 'text-muted border border-transparent hover:text-[#f0ede6]'
            }`}
          >
            Tat ca ({orders.length})
          </button>
          {ORDER_STATUSES.map(s => {
            const count = orders.filter(o => o.status === s).length
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 text-[11px] rounded transition-colors ${
                  filterStatus === s ? 'bg-[#c8a96e]/10 text-[#c8a96e] border border-[#c8a96e]/20' : 'text-muted border border-transparent hover:text-[#f0ede6]'
                }`}
              >
                {STATUS_CONFIG[s].label} ({count})
              </button>
            )
          })}
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="text-center py-12 text-muted animate-pulse">Dang tai...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#1a1916] border border-white/7 rounded p-12 text-center">
            <span className="text-4xl block mb-4">📦</span>
            <p className="text-[14px] text-muted">Khong co don hang nao</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const status = STATUS_CONFIG[order.status] || { label: order.status, color: 'bg-white/5 text-muted' }
              const payment = PAYMENT_CONFIG[order.payment_status] || PAYMENT_CONFIG.pending
              const expanded = expandedId === order.id
              const addr = order.shipping_addr as Record<string, string> | null

              return (
                <div key={order.id} className="bg-[#1a1916] border border-white/7 rounded overflow-hidden">
                  {/* Order header */}
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[14px] font-medium font-mono">{order.order_number}</p>
                        <p className="text-[11px] text-muted">
                          {new Date(order.created_at).toLocaleDateString('vi-VN', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] ${payment.color}`}>{payment.label}</span>
                      <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="font-mono text-[14px] text-[#c8a96e]">{formatPrice(order.total)}</span>
                      <span className="text-muted text-xs">{expanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expanded && (
                    <div className="border-t border-white/5 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Order info */}
                        <div>
                          <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Chi tiet don</p>
                          <div className="space-y-1 text-[12px]">
                            <p>Tam tinh: <span className="font-mono">{formatPrice(order.subtotal)}</span></p>
                            <p>Ship: <span className="font-mono">{formatPrice(order.shipping_fee)}</span></p>
                            {order.discount > 0 && (
                              <p>Giam: <span className="font-mono text-red-300">-{formatPrice(order.discount)}</span></p>
                            )}
                            <p className="font-medium">Tong: <span className="font-mono text-[#c8a96e]">{formatPrice(order.total)}</span></p>
                            {order.promo_code && <p className="text-muted">Ma KM: {order.promo_code}</p>}
                            {order.payment_method && <p className="text-muted">TT: {order.payment_method.toUpperCase()}</p>}
                          </div>
                        </div>

                        {/* Shipping */}
                        <div>
                          <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Dia chi giao</p>
                          {addr ? (
                            <div className="text-[12px] space-y-1">
                              <p className="font-medium">{addr.name}</p>
                              <p className="text-muted">{addr.phone}</p>
                              <p className="text-muted">{addr.address}</p>
                              <p className="text-muted">{addr.city}</p>
                            </div>
                          ) : (
                            <p className="text-[12px] text-muted">Chua co</p>
                          )}
                          {order.notes && (
                            <p className="text-[11px] text-muted/70 mt-2">Ghi chu: {order.notes}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div>
                          <p className="text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Cap nhat</p>

                          {/* Status update */}
                          <div className="mb-3">
                            <label className="block text-[10px] text-muted mb-1">Trang thai don</label>
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value)}
                              disabled={updating === order.id}
                              className="w-full bg-[#0b0a08] border border-white/10 rounded px-3 py-2 text-[12px] text-[#f0ede6] outline-none"
                            >
                              {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                              ))}
                            </select>
                          </div>

                          {/* Payment update */}
                          <div>
                            <label className="block text-[10px] text-muted mb-1">Thanh toan</label>
                            <select
                              value={order.payment_status}
                              onChange={e => updatePaymentStatus(order.id, e.target.value)}
                              disabled={updating === order.id}
                              className="w-full bg-[#0b0a08] border border-white/10 rounded px-3 py-2 text-[12px] text-[#f0ede6] outline-none"
                            >
                              <option value="pending">Chua thanh toan</option>
                              <option value="paid">Da thanh toan</option>
                              <option value="refunded">Hoan tien</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
