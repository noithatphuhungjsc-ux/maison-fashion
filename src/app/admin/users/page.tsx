'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/store/auth'
import AdminLayout from '../AdminLayout'
import type { UserRow, UserRole } from '@/types/database'

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string; icon: string }> = {
  customer: { label: 'Khach hang', color: 'text-[#68b5a0]', bg: 'bg-[#68b5a0]/10', icon: '👤' },
  manager: { label: 'Quan ly', color: 'text-[#c8a96e]', bg: 'bg-[#c8a96e]/10', icon: '👔' },
  workshop: { label: 'Xuong SX', color: 'text-[#a0c8e8]', bg: 'bg-[#a0c8e8]/10', icon: '🏭' },
}

export default function UsersPage() {
  const { profile } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState<string>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<UserRow>>({})

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false })
    setUsers((data || []) as UserRow[])
    setLoading(false)
  }

  async function updateUser(userId: string) {
    await supabase.from('users')
      .update({ ...editData, updated_at: new Date().toISOString() })
      .eq('id', userId)
    setEditingId(null)
    await loadUsers()
  }

  async function toggleActive(user: UserRow) {
    await supabase.from('users')
      .update({ is_active: !user.is_active, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    await loadUsers()
  }

  const filtered = users.filter(u => !filterRole || u.role === filterRole)

  if (profile?.role !== 'manager') {
    return <AdminLayout><p className="text-muted p-6">Khong co quyen truy cap</p></AdminLayout>
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-[24px] md:text-[28px] font-normal">Quan ly nguoi dung</h1>
            <p className="text-[12px] text-muted mt-1">{users.length} nguoi dung</p>
          </div>
        </div>

        {/* Role stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(['customer', 'manager', 'workshop'] as UserRole[]).map(role => {
            const config = ROLE_CONFIG[role]
            const count = users.filter(u => u.role === role).length
            return (
              <button
                key={role}
                onClick={() => setFilterRole(filterRole === role ? '' : role)}
                className={`p-4 rounded border transition-colors text-left ${
                  filterRole === role ? `${config.bg} border-current ${config.color}` : 'bg-[#1a1916] border-white/7 hover:border-white/13'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{config.icon}</span>
                  <span className="text-[10px] tracking-[0.12em] uppercase text-muted">{config.label}</span>
                </div>
                <p className={`font-serif text-[28px] font-normal ${config.color}`}>{count}</p>
              </button>
            )
          })}
        </div>

        {/* Users table */}
        {loading ? (
          <div className="text-center py-12 text-muted animate-pulse">Dang tai...</div>
        ) : (
          <div className="bg-[#1a1916] border border-white/7 rounded overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-white/7 text-[10px] tracking-[0.15em] uppercase text-muted">
                  <th className="text-left px-4 py-3">Nguoi dung</th>
                  <th className="text-left px-4 py-3">Vai tro</th>
                  <th className="text-left px-4 py-3">Thong tin</th>
                  <th className="text-center px-4 py-3">Trang thai</th>
                  <th className="text-right px-4 py-3">Thao tac</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const role = ROLE_CONFIG[u.role]
                  const isEditing = editingId === u.id

                  return (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div>
                          {isEditing ? (
                            <input
                              value={editData.full_name || ''}
                              onChange={e => setEditData(d => ({ ...d, full_name: e.target.value }))}
                              className="bg-[#0b0a08] border border-white/10 rounded px-2 py-1 text-[13px] text-[#f0ede6] outline-none w-full mb-1"
                            />
                          ) : (
                            <p className="text-[13px] font-medium">{u.full_name || '(Chua co ten)'}</p>
                          )}
                          <p className="text-[11px] text-muted">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select
                            value={editData.role || u.role}
                            onChange={e => setEditData(d => ({ ...d, role: e.target.value as UserRole }))}
                            className="bg-[#0b0a08] border border-white/10 rounded px-2 py-1 text-[12px] text-[#f0ede6] outline-none"
                          >
                            <option value="customer">Khach hang</option>
                            <option value="manager">Quan ly</option>
                            <option value="workshop">Xuong SX</option>
                          </select>
                        ) : (
                          <span className={`text-[11px] ${role.color} ${role.bg} px-2 py-1 rounded`}>
                            {role.icon} {role.label}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing && (editData.role || u.role) === 'workshop' ? (
                          <div className="space-y-1">
                            <input
                              value={editData.workshop_name || ''}
                              onChange={e => setEditData(d => ({ ...d, workshop_name: e.target.value }))}
                              placeholder="Ten xuong"
                              className="bg-[#0b0a08] border border-white/10 rounded px-2 py-1 text-[12px] text-[#f0ede6] outline-none w-full placeholder:text-muted/30"
                            />
                            <input
                              value={editData.workshop_address || ''}
                              onChange={e => setEditData(d => ({ ...d, workshop_address: e.target.value }))}
                              placeholder="Dia chi"
                              className="bg-[#0b0a08] border border-white/10 rounded px-2 py-1 text-[12px] text-[#f0ede6] outline-none w-full placeholder:text-muted/30"
                            />
                          </div>
                        ) : (
                          <div className="text-[11px] text-muted">
                            {u.phone && <p>{u.phone}</p>}
                            {u.workshop_name && <p>{u.workshop_name}</p>}
                            {u.workshop_address && <p>{u.workshop_address}</p>}
                            <p>{new Date(u.created_at).toLocaleDateString('vi-VN')}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleActive(u)}
                          className={`text-[10px] ${u.is_active ? 'text-green-400' : 'text-red-400'} hover:opacity-80`}
                        >
                          {u.is_active ? '● Hoat dong' : '● Khoa'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => updateUser(u.id)}
                              className="text-[11px] text-[#c8a96e] hover:text-[#e8d0a0]"
                            >
                              Luu
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-[11px] text-muted hover:text-[#f0ede6]"
                            >
                              Huy
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(u.id)
                              setEditData({
                                full_name: u.full_name || '',
                                role: u.role,
                                workshop_name: u.workshop_name || '',
                                workshop_address: u.workshop_address || '',
                              })
                            }}
                            className="text-[11px] text-[#c8a96e] hover:text-[#e8d0a0]"
                          >
                            Sua
                          </button>
                        )}
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
