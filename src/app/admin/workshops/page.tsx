'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/store/auth'
import AdminLayout from '../AdminLayout'
import type { UserRow, WorkshopOrderRow, WorkshopOrderStatus, WorkshopPriority } from '@/types/database'

const STATUS_CONFIG: Record<WorkshopOrderStatus, { label: string; color: string }> = {
  pending: { label: 'Cho xu ly', color: 'bg-yellow-900/30 text-yellow-300' },
  cutting: { label: 'Dang cat', color: 'bg-orange-900/30 text-orange-300' },
  sewing: { label: 'Dang may', color: 'bg-blue-900/30 text-blue-300' },
  finishing: { label: 'Hoan thien', color: 'bg-purple-900/30 text-purple-300' },
  quality_check: { label: 'Kiem tra CL', color: 'bg-cyan-900/30 text-cyan-300' },
  completed: { label: 'Hoan thanh', color: 'bg-green-900/30 text-green-300' },
  rejected: { label: 'Tu choi', color: 'bg-red-900/30 text-red-300' },
}

export default function WorkshopsPage() {
  const { profile, user } = useAuth()
  const [workshops, setWorkshops] = useState<UserRow[]>([])
  const [tasks, setTasks] = useState<WorkshopOrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  // New task form
  const [newTask, setNewTask] = useState({
    workshop_id: '',
    product_name: '',
    quantity: 1,
    size: '',
    priority: 'normal' as WorkshopPriority,
    notes: '',
    due_date: '',
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [wsRes, taskRes] = await Promise.all([
      supabase.from('users').select('*').eq('role', 'workshop'),
      supabase.from('workshop_orders').select('*').order('created_at', { ascending: false }),
    ])
    setWorkshops((wsRes.data || []) as UserRow[])
    setTasks((taskRes.data || []) as WorkshopOrderRow[])
    setLoading(false)
  }

  async function createTask() {
    if (!newTask.workshop_id || !newTask.product_name) return
    setCreating(true)

    await supabase.from('workshop_orders').insert({
      workshop_id: newTask.workshop_id,
      assigned_by: user?.id,
      product_name: newTask.product_name,
      quantity: newTask.quantity,
      size: newTask.size || null,
      priority: newTask.priority,
      notes: newTask.notes || null,
      due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null,
      status: 'pending',
    })

    setNewTask({ workshop_id: '', product_name: '', quantity: 1, size: '', priority: 'normal', notes: '', due_date: '' })
    setShowCreate(false)
    setCreating(false)
    await loadData()
  }

  async function deleteTask(id: string) {
    if (!confirm('Xac nhan xoa cong viec nay?')) return
    await supabase.from('workshop_orders').delete().eq('id', id)
    await loadData()
  }

  if (profile?.role !== 'manager') {
    return <AdminLayout><p className="text-muted p-6">Khong co quyen truy cap</p></AdminLayout>
  }

  const activeTasks = tasks.filter(t => t.status !== 'completed' && t.status !== 'rejected')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  function getWorkshopName(id: string | null) {
    if (!id) return 'N/A'
    const ws = workshops.find(w => w.id === id)
    return ws?.workshop_name || ws?.full_name || ws?.email || 'N/A'
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-[24px] md:text-[28px] font-normal">Quan ly Xuong san xuat</h1>
            <p className="text-[12px] text-muted mt-1">
              {workshops.length} xuong | {activeTasks.length} cong viec dang thuc hien
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] font-medium tracking-[0.1em] uppercase px-5 py-3 rounded transition-colors"
          >
            + Phan cong moi
          </button>
        </div>

        {/* Create task form */}
        {showCreate && (
          <div className="bg-[#1a1916] border border-[#c8a96e]/20 rounded p-6 mb-6">
            <h3 className="text-[14px] font-medium mb-4">Phan cong cong viec moi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Xuong san xuat *</label>
                <select
                  value={newTask.workshop_id}
                  onChange={e => setNewTask(t => ({ ...t, workshop_id: e.target.value }))}
                  className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none"
                >
                  <option value="">-- Chon xuong --</option>
                  {workshops.filter(w => w.is_active).map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.workshop_name || ws.full_name || ws.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">San pham *</label>
                <input
                  type="text"
                  value={newTask.product_name}
                  onChange={e => setNewTask(t => ({ ...t, product_name: e.target.value }))}
                  placeholder="Ten san pham can san xuat"
                  className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none placeholder:text-muted/30"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">So luong</label>
                  <input
                    type="number"
                    min={1}
                    value={newTask.quantity}
                    onChange={e => setNewTask(t => ({ ...t, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Size</label>
                  <input
                    type="text"
                    value={newTask.size}
                    onChange={e => setNewTask(t => ({ ...t, size: e.target.value }))}
                    placeholder="S, M, L..."
                    className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none placeholder:text-muted/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Uu tien</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask(t => ({ ...t, priority: e.target.value as WorkshopPriority }))}
                    className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none"
                  >
                    <option value="low">Thap</option>
                    <option value="normal">Binh thuong</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khan cap</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Han hoan thanh</label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={e => setNewTask(t => ({ ...t, due_date: e.target.value }))}
                  className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Ghi chu</label>
                <textarea
                  value={newTask.notes}
                  onChange={e => setNewTask(t => ({ ...t, notes: e.target.value }))}
                  rows={2}
                  placeholder="Yeu cau dac biet, chi tiet ky thuat..."
                  className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none resize-none placeholder:text-muted/30"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={createTask}
                disabled={creating || !newTask.workshop_id || !newTask.product_name}
                className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] font-medium tracking-[0.1em] uppercase px-6 py-3 rounded transition-colors disabled:opacity-50"
              >
                {creating ? 'Dang tao...' : 'Phan cong'}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="text-[11px] text-muted hover:text-[#f0ede6] px-4 py-3"
              >
                Huy
              </button>
            </div>
          </div>
        )}

        {/* Workshop overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {workshops.map(ws => {
            const wsTasks = tasks.filter(t => t.workshop_id === ws.id)
            const active = wsTasks.filter(t => t.status !== 'completed' && t.status !== 'rejected').length
            const done = wsTasks.filter(t => t.status === 'completed').length
            return (
              <div key={ws.id} className={`bg-[#1a1916] border rounded p-4 ${ws.is_active ? 'border-white/7' : 'border-red-500/20 opacity-60'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏭</span>
                    <div>
                      <p className="text-[13px] font-medium">{ws.workshop_name || ws.full_name || ws.email}</p>
                      <p className="text-[10px] text-muted">{ws.workshop_address || ws.email}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] ${ws.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {ws.is_active ? '● On' : '● Off'}
                  </span>
                </div>
                <div className="flex gap-4 pt-3 border-t border-white/5 text-[11px]">
                  <span className="text-[#a0c8e8]">{active} dang lam</span>
                  <span className="text-[#68b5a0]">{done} xong</span>
                  <span className="text-muted">{wsTasks.length} tong</span>
                </div>
              </div>
            )
          })}
          {workshops.length === 0 && (
            <div className="col-span-full bg-[#1a1916] border border-white/7 rounded p-8 text-center">
              <p className="text-muted text-[13px]">Chua co xuong nao. Them nguoi dung vai tro "Xuong SX" tai muc Nguoi dung.</p>
            </div>
          )}
        </div>

        {/* All tasks */}
        <h2 className="text-[13px] tracking-[0.1em] uppercase text-[#c8a96e] mb-3">
          Tat ca cong viec ({tasks.length})
        </h2>
        {loading ? (
          <div className="text-center py-12 text-muted animate-pulse">Dang tai...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-[#1a1916] border border-white/7 rounded p-12 text-center">
            <span className="text-4xl block mb-4">📋</span>
            <p className="text-[14px] text-muted">Chua co cong viec nao. Nhan "Phan cong moi" de bat dau.</p>
          </div>
        ) : (
          <div className="bg-[#1a1916] border border-white/7 rounded overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/7 text-[10px] tracking-[0.15em] uppercase text-muted">
                  <th className="text-left px-4 py-3">San pham</th>
                  <th className="text-left px-4 py-3">Xuong</th>
                  <th className="text-center px-4 py-3">SL</th>
                  <th className="text-center px-4 py-3">Uu tien</th>
                  <th className="text-center px-4 py-3">Trang thai</th>
                  <th className="text-center px-4 py-3">Han</th>
                  <th className="text-right px-4 py-3">Thao tac</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => {
                  const status = STATUS_CONFIG[task.status]
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
                  return (
                    <tr key={task.id} className={`border-b border-white/5 hover:bg-white/[0.02] ${isOverdue ? 'bg-red-900/5' : ''}`}>
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-medium">{task.product_name}</p>
                        {task.notes && <p className="text-[10px] text-muted/60 mt-0.5 truncate max-w-[200px]">{task.notes}</p>}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-muted">
                        {getWorkshopName(task.workshop_id)}
                      </td>
                      <td className="px-4 py-3 text-center text-[12px]">
                        {task.quantity} {task.size && <span className="text-muted">({task.size})</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] ${
                          task.priority === 'urgent' ? 'text-red-300' :
                          task.priority === 'high' ? 'text-orange-300' :
                          task.priority === 'normal' ? 'text-[#f0ede6]' : 'text-muted'
                        }`}>
                          {task.priority === 'urgent' ? '🔴' : task.priority === 'high' ? '🟠' : task.priority === 'normal' ? '🟢' : '⚪'} {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-1 rounded ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-[11px]">
                        {task.due_date ? (
                          <span className={isOverdue ? 'text-red-400' : 'text-muted'}>
                            {new Date(task.due_date).toLocaleDateString('vi-VN')}
                            {isOverdue && ' ⚠️'}
                          </span>
                        ) : (
                          <span className="text-muted/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-[11px] text-red-400/60 hover:text-red-400 transition-colors"
                        >
                          Xoa
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
