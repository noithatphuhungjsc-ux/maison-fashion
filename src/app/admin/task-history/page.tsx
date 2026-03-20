'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/store/auth'
import AdminLayout from '../AdminLayout'
import type { WorkshopOrderRow, WorkshopOrderStatus } from '@/types/database'

const STATUS_CONFIG: Record<WorkshopOrderStatus, { label: string; color: string }> = {
  pending: { label: 'Cho xu ly', color: 'bg-yellow-900/30 text-yellow-300' },
  cutting: { label: 'Dang cat', color: 'bg-orange-900/30 text-orange-300' },
  sewing: { label: 'Dang may', color: 'bg-blue-900/30 text-blue-300' },
  finishing: { label: 'Hoan thien', color: 'bg-purple-900/30 text-purple-300' },
  quality_check: { label: 'Kiem tra CL', color: 'bg-cyan-900/30 text-cyan-300' },
  completed: { label: 'Hoan thanh', color: 'bg-green-900/30 text-green-300' },
  rejected: { label: 'Tu choi', color: 'bg-red-900/30 text-red-300' },
}

export default function TaskHistoryPage() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<WorkshopOrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('workshop_orders')
      .select('*')
      .eq('workshop_id', user.id)
      .in('status', ['completed', 'rejected'])
      .order('completed_at', { ascending: false })
      .then(({ data }) => {
        setTasks((data || []) as WorkshopOrderRow[])
        setLoading(false)
      })
  }, [user])

  const completed = tasks.filter(t => t.status === 'completed').length
  const rejected = tasks.filter(t => t.status === 'rejected').length

  return (
    <AdminLayout>
      <div>
        <h1 className="font-serif text-[24px] md:text-[28px] font-normal mb-2">Lich su cong viec</h1>
        <p className="text-[12px] text-muted mb-6">
          {completed} hoan thanh | {rejected} tu choi | {tasks.length} tong
        </p>

        {loading ? (
          <div className="text-center py-12 text-muted animate-pulse">Dang tai...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-[#1a1916] border border-white/7 rounded p-12 text-center">
            <span className="text-4xl block mb-4">📊</span>
            <p className="text-[14px] text-muted">Chua co lich su</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => {
              const status = STATUS_CONFIG[task.status]
              const duration = task.started_at && task.completed_at
                ? Math.ceil((new Date(task.completed_at).getTime() - new Date(task.started_at).getTime()) / (1000 * 60 * 60 * 24))
                : null
              return (
                <div key={task.id} className="bg-[#1a1916] border border-white/7 rounded p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[14px] font-medium">{task.product_name}</h3>
                      <div className="flex items-center gap-4 text-[11px] text-muted mt-1">
                        <span>SL: {task.quantity}</span>
                        {task.size && <span>Size: {task.size}</span>}
                        {duration !== null && <span>{duration} ngay</span>}
                      </div>
                    </div>
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2 text-[10px] text-muted/50">
                    {task.started_at && <span>Bat dau: {new Date(task.started_at).toLocaleDateString('vi-VN')}</span>}
                    {task.completed_at && <span>Xong: {new Date(task.completed_at).toLocaleDateString('vi-VN')}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
