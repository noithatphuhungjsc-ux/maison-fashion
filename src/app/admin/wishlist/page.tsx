'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { useWishlist } from '@/store/cart'
import AdminLayout from '../AdminLayout'
import type { ProductRow } from '@/types/database'

export default function WishlistPage() {
  const { ids, toggle } = useWishlist()
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      setProducts((data || []) as ProductRow[])
      setLoading(false)
    })
  }, [])

  // Match wishlist ids by slug hash
  function hashSlug(slug: string) {
    return slug.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)
  }

  const wishlistProducts = products.filter(p => ids.includes(hashSlug(p.slug)))

  return (
    <AdminLayout>
      <div>
        <h1 className="font-serif text-[24px] md:text-[28px] font-normal mb-6">San pham yeu thich</h1>

        {loading ? (
          <div className="text-center py-12 text-muted animate-pulse">Dang tai...</div>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-[#1a1916] border border-white/7 rounded p-12 text-center">
            <span className="text-4xl block mb-4">❤️</span>
            <p className="text-[14px] text-muted mb-2">Chua co san pham yeu thich</p>
            <a href="/products" className="text-[12px] text-[#c8a96e] hover:text-[#e8d0a0] transition-colors">
              Kham pha san pham →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map(p => (
              <div key={p.id} className="bg-[#1a1916] border border-white/7 rounded overflow-hidden">
                <div className="aspect-[4/3] bg-[#131210] flex items-center justify-center">
                  <span className="text-[50px] opacity-60">{p.emoji}</span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#c8a96e] mb-1">{p.tag}</p>
                  <h3 className="font-serif text-[16px] font-normal mb-2">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[14px] text-[#c8a96e]">{formatPrice(p.price)}</span>
                    <button
                      onClick={() => toggle(hashSlug(p.slug))}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      ❤️ Bo yeu thich
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
