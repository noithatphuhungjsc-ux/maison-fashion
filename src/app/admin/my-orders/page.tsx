'use client'
import AdminLayout from '../AdminLayout'
import CustomerDashboard from '../dashboards/CustomerDashboard'

export default function MyOrdersPage() {
  return (
    <AdminLayout>
      <CustomerDashboard />
    </AdminLayout>
  )
}
