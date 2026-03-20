'use client'
import { useAuth } from '@/store/auth'
import AdminLayout from './AdminLayout'
import ManagerDashboard from './dashboards/ManagerDashboard'
import CustomerDashboard from './dashboards/CustomerDashboard'
import WorkshopDashboard from './dashboards/WorkshopDashboard'

export default function AdminPage() {
  const { profile } = useAuth()

  return (
    <AdminLayout>
      {profile?.role === 'manager' && <ManagerDashboard />}
      {profile?.role === 'customer' && <CustomerDashboard />}
      {profile?.role === 'workshop' && <WorkshopDashboard />}
      {!profile?.role && (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted">Dang tai...</p>
        </div>
      )}
    </AdminLayout>
  )
}
