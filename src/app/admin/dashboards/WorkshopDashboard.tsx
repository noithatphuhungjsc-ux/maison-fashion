'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/store/auth'
import type { WorkshopOrderRow, WorkshopOrderStatus } from '@/types/database'

const STATUS_FLOW: WorkshopOrderStatus[] = [
  'pending', 'cutting', 'sewing', 'finishing', 'quality_check', 'completed'
]

const STATUS_CONFIG: Record<WorkshopOrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Cho xu ly', color: 'text-yellow-300', bg: 'bg-yellow-900/30' },
  cutting: { label: 'Dang cat', color: 'text-orange-300', bg: 'bg-orange-900/30' },
  sewing: { label: 'Dang may', color: 'text-blue-300', bg: 'bg-blue-900/30' },
  finishing: { label: 'Hoan thien', color: 'text-purple-300', bg: 'bg-purple-900/30' },
  quality_check: { label: 'Kiem tra CL', color: 'text-cyan-300', bg: 'bg-cyan-900/30' },
  completed: { label: 'Hoan thanh', color: 'text-green-300', bg: 'bg-green-900/30' },
  rejected: { label: 'Tu choi', color: 'text-red-300', bg: 'bg-red-900/30' },
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: 'Thap', color: 'text-muted' },
  normal: { label: 'Binh thuong', color: 'text-[#f0ede6]' },
  high: { label: 'Cao', color: 'text-orange-300' },
  urgent: { label: 'Khan cap', color: 'text-red-300' },
}

export default function WorkshopDashboard() {
  const { user, profile } = useAuth()
  const [tasks, setTasks] = useState<WorkshopOrderRow[]>([])
  const [filter, setFilter] = useState<'active' | 'completed' | 'all'>('active')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    loadTasks()
  }, [user])

  async function loadTasks() {
    if (!user) return
    try {
      const { data } = await supabase
        .from('workshop_orders')
        .select('*')
        .eq('workshop_id', user.id)
        .order('created_at', { ascending: false })

      setTasks((data || []) as WorkshopOrderRow[])
    } catch {
      // fallback
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(taskId: string, newStatus: WorkshopOrderStatus) {
    setUpdating(taskId)
    try {
      const updates: Partial<WorkshopOrderRow> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      }

      if (newStatus === 'cutting' || newStatus === 'sewing') {
        updates.started_at = new Date().toISOString()
      }
      if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString()
      }

      await supabase
        .from('workshop_orders')
        .update(updates)
        .eq('id', taskId)

      await loadTasks()
    } catch (err) {
      console.error('Update error:', err)
    } finally {
      setUpdating(null)
    }
  }

  function getNextStatus(current: WorkshopOrderStatus): WorkshopOrderStatus | null {
    const idx = STATUS_FLOW.indexOf(current)
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null
    return STATUS_FLOW[idx + 1]
  }

  const activeTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'rejected')
  const completedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'rejected')
  const filteredTasks = filter === 'active' ? activeTasks : filter === 'completed' ? completedTasks : tasks

  const todayTasks = activeTasks.filter(t => {
    if (!t.due_date) return false
    return new Date(t.due_date).toDateString() === new Date().toDateString()
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#a0c8e8] animate-pulse">Dang tai...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-[24px] md:text-[28px] font-normal">
          {profile?.workshop_name || 'Xuong ve tinh'}
        </h1>
        <p className="text-[13px] text-muted mt-1">Quan ly cong viec san xuat</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Dang lam', value: activeTasks.length.toString(), color: '#a0c8e8', icon: '🔨' },
          { label: 'Hoan thanh', value: completedTasks.length.toString(), color: '#68b5a0', icon: '✅' },
          { label: 'Khan cap', value: activeTasks.filter(t => t.priority === 'urgent').length.toString(), color: '#e86868', icon: '🔴' },
          { label: 'Hom nay', value: todayTasks.length.toString(), color: '#e8d0a0', icon: '📅' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#1a1916] border border-white/7 p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <span>{stat.icon}</span>
              <p className="text-[10px] tracking-[0.12em] uppercase text-muted">{stat.label}</p>
            </div>
            <p className="font-serif text-[24px] font-normal" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {([
          { key: 'active' as const, label: `Dang lam (${activeTasks.length})` },
          { key: 'completed' as const, label: `Hoan thanh (${completedTasks.length})` },
          { key: 'all' as const, label: `Tat ca (${tasks.length})` },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-[12px] rounded transition-colors ${
              filter === tab.key
                ? 'bg-[#a0c8e8]/10 text-[#a0c8e8] border border-[#a0c8e8]/20'
                : 'text-muted hover:text-[#f0ede6] border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#1a1916] border border-white/7 rounded p-12 text-center">
            <span className="text-4xl block mb-4">📋</span>
            <p className="text-[14px] text-muted">Khong co cong viec nao</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const status = STATUS_CONFIG[task.status]
            const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.normal
            const nextStatus = getNextStatus(task.status)
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'

            return (
              <div key={task.id} className={`bg-[#1a1916] border rounded p-4 ${
                isOverdue ? 'border-red-500/30' : 'border-white/7'
              }`}>
                {/* Task header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-medium">{task.product_name}</h3>
                      {task.priority === 'urgent' && (
                        <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded bg-red-900/30 text-red-300">
                          KHAN CAP
                        </span>
                      )}
                      {task.priority === 'high' && (
                        <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded bg-orange-900/30 text-orange-300">
                          UU TIEN
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-muted">
                      <span>SL: {task.quantity}</span>
                      {task.size && <span>Size: {task.size}</span>}
                      {task.due_date && (
                        <span className={isOverdue ? 'text-red-400' : ''}>
                          Han: {new Date(task.due_date).toLocaleDateString('vi-VN')}
                          {isOverdue && ' (Tre han!)'}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 rounded ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-1 mb-3">
                  {STATUS_FLOW.map((step, i) => {
                    const currentIdx = STATUS_FLOW.indexOf(task.status)
                    const isCompleted = i <= currentIdx
                    return (
                      <div key={step} className="flex-1">
                        <div className={`h-1.5 rounded-full transition-colors ${
                          isCompleted ? 'bg-[#a0c8e8]' : 'bg-white/5'
                        }`} />
                      </div>
                    )
                  })}
                </div>

                {/* Notes */}
                {task.notes && (
                  <p className="text-[12px] text-muted/70 mb-3 bg-white/[0.02] rounded px-3 py-2">
                    📝 {task.notes}
                  </p>
                )}

                {/* Action */}
                {nextStatus && task.status !== 'rejected' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStatus(task.id, nextStatus)}
                      disabled={updating === task.id}
                      className="bg-[#a0c8e8]/10 hover:bg-[#a0c8e8]/20 text-[#a0c8e8] border border-[#a0c8e8]/20 px-4 py-2 rounded text-[11px] tracking-[0.05em] transition-colors disabled:opacity-50"
                    >
                      {updating === task.id ? 'Dang cap nhat...' : `→ ${STATUS_CONFIG[nextStatus].label}`}
                    </button>
                    {task.status !== 'pending' && (
                      <button
                        onClick={() => updateStatus(task.id, 'rejected')}
                        disabled={updating === task.id}
                        className="text-[11px] text-red-400/60 hover:text-red-400 transition-colors px-3 py-2"
                      >
                        Bao loi
                      </button>
                    )}
                  </div>
                )}

                {/* Timestamps */}
                <div className="flex gap-4 mt-3 pt-3 border-t border-white/5 text-[10px] text-muted/50">
                  {task.started_at && <span>Bat dau: {new Date(task.started_at).toLocaleDateString('vi-VN')}</span>}
                  {task.completed_at && <span>Hoan thanh: {new Date(task.completed_at).toLocaleDateString('vi-VN')}</span>}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
