import type { Metadata } from 'next'
import { getProducts, getCategories, getReviews } from '@/lib/queries'
import AdminDashboard from './AdminDashboard'

export const metadata: Metadata = { title: 'Admin Dashboard' }
export const revalidate = 0 // always fresh

export default async function AdminPage() {
  const [products, categories, reviews] = await Promise.all([
    getProducts(),
    getCategories(),
    getReviews(),
  ])

  return (
    <AdminDashboard
      products={products}
      categories={categories}
      reviews={reviews}
    />
  )
}
