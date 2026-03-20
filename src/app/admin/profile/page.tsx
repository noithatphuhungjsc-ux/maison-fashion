'use client'
import { useState } from 'react'
import { useAuth } from '@/store/auth'
import AdminLayout from '../AdminLayout'

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [workshopName, setWorkshopName] = useState(profile?.workshop_name || '')
  const [workshopAddress, setWorkshopAddress] = useState(profile?.workshop_address || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSave() {
    setSaving(true)
    setMessage('')
    const updates: Record<string, string> = { full_name: fullName, phone }
    if (profile?.role === 'workshop') {
      updates.workshop_name = workshopName
      updates.workshop_address = workshopAddress
    }
    const { error } = await updateProfile(updates)
    setSaving(false)
    setMessage(error || 'Da cap nhat thanh cong!')
  }

  return (
    <AdminLayout>
      <div className="max-w-lg">
        <h1 className="font-serif text-[24px] md:text-[28px] font-normal mb-6">Ho so ca nhan</h1>

        <div className="bg-[#1a1916] border border-white/7 rounded p-6 space-y-4">
          {/* Email (read-only) */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Email</label>
            <p className="text-[13px] text-muted bg-[#0b0a08] border border-white/5 rounded px-4 py-3">{profile?.email}</p>
          </div>

          {/* Role (read-only) */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Vai tro</label>
            <p className="text-[13px] text-[#c8a96e] bg-[#0b0a08] border border-white/5 rounded px-4 py-3">
              {profile?.role === 'manager' ? 'Quan ly' : profile?.role === 'workshop' ? 'Xuong SX' : 'Khach hang'}
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Ho va ten</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">So dien thoai</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e]"
            />
          </div>

          {/* Workshop fields */}
          {profile?.role === 'workshop' && (
            <>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Ten xuong</label>
                <input
                  type="text"
                  value={workshopName}
                  onChange={e => setWorkshopName(e.target.value)}
                  className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e]"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Dia chi xuong</label>
                <input
                  type="text"
                  value={workshopAddress}
                  onChange={e => setWorkshopAddress(e.target.value)}
                  className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e]"
                />
              </div>
            </>
          )}

          {/* Message */}
          {message && (
            <p className={`text-[12px] ${message.includes('loi') || message.includes('error') ? 'text-red-300' : 'text-green-300'}`}>
              {message}
            </p>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] font-medium tracking-[0.1em] uppercase px-6 py-3 rounded transition-colors disabled:opacity-50"
          >
            {saving ? 'Dang luu...' : 'Cap nhat ho so'}
          </button>
        </div>

        {/* Account info */}
        <div className="mt-6 bg-[#1a1916] border border-white/7 rounded p-6">
          <h3 className="text-[12px] tracking-[0.1em] uppercase text-muted mb-3">Thong tin tai khoan</h3>
          <div className="space-y-2 text-[12px]">
            <p className="text-muted">Ngay tao: {profile ? new Date(profile.created_at).toLocaleDateString('vi-VN') : '—'}</p>
            <p className="text-muted">Lan cap nhat cuoi: {profile ? new Date(profile.updated_at).toLocaleDateString('vi-VN') : '—'}</p>
            <p className={profile?.is_active ? 'text-green-400' : 'text-red-400'}>
              Trang thai: {profile?.is_active ? 'Hoat dong' : 'Bi khoa'}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
