'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import type { ProductRow, OrderRow, UserRow, WorkshopOrderRow } from '@/types/database'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalWorkshops: number
  pendingOrders: number
  workshopTasks: number
  completedTasks: number
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalUsers: 0,
    totalWorkshops: 0, pendingOrders: 0, workshopTasks: 0, completedTasks: 0,
  })
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([])
  const [recentProducts, setRecentProducts] = useState<ProductRow[]>([])
  const [workshopStatus, setWorkshopStatus] = useState<WorkshopOrderRow[]>([])
  const [workshops, setWorkshops] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const [productsRes, ordersRes, usersRes, workshopOrdersRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('users').select('*'),
        supabase.from('workshop_orders').select('*').order('created_at', { ascending: false }).limit(10),
      ])

      const products = (productsRes.data || []) as ProductRow[]
      const orders = (ordersRes.data || []) as OrderRow[]
      const users = (usersRes.data || []) as UserRow[]
      const wOrders = (workshopOrdersRes.data || []) as WorkshopOrderRow[]

      // Count all products
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })

      setStats({
        totalProducts: productCount || products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((s, o) => s + o.total, 0),
        totalUsers: users.filter(u => u.role === 'customer').length,
        totalWorkshops: users.filter(u => u.role === 'workshop').length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        workshopTasks: wOrders.filter(w => w.status !== 'completed' && w.status !== 'rejected').length,
        completedTasks: wOrders.filter(w => w.status === 'completed').length,
      })

      setRecentProducts(products)
      setRecentOrders(orders)
      setWorkshopStatus(wOrders)
      setWorkshops(users.filter(u => u.role === 'workshop'))
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#c8a96e] animate-pulse">Dang tai du lieu...</div>
      </div>
    )
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-900/30 text-yellow-300',
    confirmed: 'bg-blue-900/30 text-blue-300',
    shipping: 'bg-purple-900/30 text-purple-300',
    delivered: 'bg-green-900/30 text-green-300',
    cancelled: 'bg-red-900/30 text-red-300',
  }

  const WORKSHOP_STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-900/30 text-yellow-300',
    cutting: 'bg-orange-900/30 text-orange-300',
    sewing: 'bg-blue-900/30 text-blue-300',
    finishing: 'bg-purple-900/30 text-purple-300',
    quality_check: 'bg-cyan-900/30 text-cyan-300',
    completed: 'bg-green-900/30 text-green-300',
    rejected: 'bg-red-900/30 text-red-300',
  }

  return (
    <div>
      <h1 className="font-serif text-[24px] md:text-[28px] font-normal mb-6">Tong quan Quan ly</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        {[
          { label: 'San pham', value: stats.totalProducts.toString(), color: '#c8a96e', icon: '🏷' },
          { label: 'Don hang', value: stats.totalOrders.toString(), color: '#68b5a0', icon: '📦' },
          { label: 'Doanh thu', value: formatPrice(stats.totalRevenue), color: '#e8d0a0', icon: '💰' },
          { label: 'Khach hang', value: stats.totalUsers.toString(), color: '#a0c8e8', icon: '👥' },
          { label: 'Xuong SX', value: stats.totalWorkshops.toString(), color: '#c8a0e8', icon: '🏭' },
          { label: 'Don cho xu ly', value: stats.pendingOrders.toString(), color: '#e8c0a0', icon: '⏳' },
          { label: 'CV dang lam', value: stats.workshopTasks.toString(), color: '#a0e8c8', icon: '🔨' },
          { label: 'CV hoan thanh', value: stats.completedTasks.toString(), color: '#68b5a0', icon: '✅' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#1a1916] border border-white/7 p-4 md:p-5 rounded">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{stat.icon}</span>
              <p className="text-[10px] tracking-[0.12em] uppercase text-muted">{stat.label}</p>
            </div>
            <p className="font-serif text-[22px] md:text-[28px] font-normal" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div>
          <h2 className="text-[13px] tracking-[0.1em] uppercase text-[#c8a96e] mb-3">Don hang gan day</h2>
          <div className="bg-[#1a1916] border border-white/7 rounded overflow-hidden">
            {recentOrders.length === 0 ? (
              <p className="text-[13px] text-muted p-6 text-center">Chua co don hang nao</p>
            ) : (
              <div className="divide-y divide-white/5">
                {recentOrders.slice(0, 5).map(order => (
                  <div key={order.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02]">
                    <div>
                      <p className="text-[13px] font-medium font-mono">{order.order_number}</p>
                      <p className="text-[11px] text-muted">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <span className="font-mono text-[13px] text-[#c8a96e]">{formatPrice(order.total)}</span>
                      <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded ${STATUS_COLORS[order.status] || 'bg-white/5 text-muted'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Workshop status */}
        <div>
          <h2 className="text-[13px] tracking-[0.1em] uppercase text-[#c8a96e] mb-3">Trang thai xuong SX</h2>
          <div className="bg-[#1a1916] border border-white/7 rounded overflow-hidden">
            {workshopStatus.length === 0 ? (
              <p className="text-[13px] text-muted p-6 text-center">Chua co cong viec nao</p>
            ) : (
              <div className="divide-y divide-white/5">
                {workshopStatus.slice(0, 5).map(task => (
                  <div key={task.id} className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02]">
                    <div>
                      <p className="text-[13px] font-medium">{task.product_name}</p>
                      <p className="text-[11px] text-muted">SL: {task.quantity} | {task.size || 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded ${WORKSHOP_STATUS_COLORS[task.status]}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent products */}
      <div className="mt-6">
        <h2 className="text-[13px] tracking-[0.1em] uppercase text-[#c8a96e] mb-3">San pham gan day</h2>
        <div className="bg-[#1a1916] border border-white/7 rounded overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-white/7 text-[10px] tracking-[0.15em] uppercase text-muted">
                <th className="text-left px-4 py-3">San pham</th>
                <th className="text-left px-4 py-3">Danh muc</th>
                <th className="text-right px-4 py-3">Gia</th>
                <th className="text-center px-4 py-3">Danh gia</th>
                <th className="text-center px-4 py-3">Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map(p => (
                <tr key={p.slug} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.emoji}</span>
                      <div>
                        <p className="text-[13px] font-medium">{p.name}</p>
                        <p className="text-[11px] text-muted">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted">{p.category}</td>
                  <td className="px-4 py-3 text-[13px] text-right font-mono text-[#c8a96e]">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-[12px]">★ {p.rating}</span>
                    <span className="text-[11px] text-muted ml-1">({p.review_count})</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.in_stock ? (
                      <span className="text-[9px] tracking-[0.1em] uppercase text-green-400">Con hang</span>
                    ) : (
                      <span className="text-[9px] tracking-[0.1em] uppercase text-red-400">Het hang</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workshops list */}
      {workshops.length > 0 && (
        <div className="mt-6">
          <h2 className="text-[13px] tracking-[0.1em] uppercase text-[#c8a96e] mb-3">Cac xuong ve tinh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {workshops.map(ws => (
              <div key={ws.id} className="bg-[#1a1916] border border-white/7 rounded p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏭</span>
                  <div>
                    <p className="text-[13px] font-medium">{ws.workshop_name || ws.full_name || ws.email}</p>
                    <p className="text-[10px] text-muted">{ws.workshop_address || ws.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <span className={`text-[10px] ${ws.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {ws.is_active ? '● Hoat dong' : '● Ngung'}
                  </span>
                  <span className="text-[10px] text-muted">
                    Tham gia: {new Date(ws.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
