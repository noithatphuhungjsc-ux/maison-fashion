'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/store/auth'
import AdminLayout from '../AdminLayout'
import type { ProductRow } from '@/types/database'

type EditMode = 'list' | 'edit' | 'create'

const EMPTY_PRODUCT: Partial<ProductRow> = {
  name: '', slug: '', description: '', tag: '', price: 0, original_price: null,
  category: 'ao', badge: null, sizes: ['S', 'M', 'L'], emoji: '🛍',
  in_stock: true, rating: 0, review_count: 0, details: [],
}

export default function ProductsPage() {
  const { profile } = useAuth()
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<EditMode>('list')
  const [editProduct, setEditProduct] = useState<Partial<ProductRow>>(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts((data || []) as ProductRow[])
    setLoading(false)
  }

  async function saveProduct() {
    setSaving(true)
    try {
      if (mode === 'create') {
        const slug = editProduct.name?.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 60) || `product-${Date.now()}`

        await supabase.from('products').insert({
          ...editProduct,
          slug,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      } else {
        await supabase.from('products')
          .update({ ...editProduct, updated_at: new Date().toISOString() })
          .eq('id', editProduct.id)
      }
      await loadProducts()
      setMode('list')
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Xac nhan xoa san pham nay?')) return
    await supabase.from('products').delete().eq('id', id)
    await loadProducts()
  }

  function startEdit(p: ProductRow) {
    setEditProduct({ ...p })
    setMode('edit')
  }

  function startCreate() {
    setEditProduct({ ...EMPTY_PRODUCT })
    setMode('create')
  }

  // Filter
  const filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterCategory && p.category !== filterCategory) return false
    return true
  })

  const categories = [...new Set(products.map(p => p.category))]

  if (profile?.role !== 'manager') {
    return <AdminLayout><p className="text-muted p-6">Khong co quyen truy cap</p></AdminLayout>
  }

  return (
    <AdminLayout>
      {mode === 'list' ? (
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-[24px] md:text-[28px] font-normal">Quan ly san pham</h1>
              <p className="text-[12px] text-muted mt-1">{products.length} san pham</p>
            </div>
            <button
              onClick={startCreate}
              className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] font-medium tracking-[0.1em] uppercase px-5 py-3 rounded transition-colors"
            >
              + Them san pham
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tim kiem san pham..."
              className="flex-1 bg-[#1a1916] border border-white/10 rounded px-4 py-2.5 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e] transition-colors placeholder:text-muted/30"
            />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="bg-[#1a1916] border border-white/10 rounded px-4 py-2.5 text-[12px] text-[#f0ede6] outline-none"
            >
              <option value="">Tat ca danh muc</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Product table */}
          {loading ? (
            <div className="text-center py-12 text-muted animate-pulse">Dang tai...</div>
          ) : (
            <div className="bg-[#1a1916] border border-white/7 rounded overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/7 text-[10px] tracking-[0.15em] uppercase text-muted">
                    <th className="text-left px-4 py-3">San pham</th>
                    <th className="text-left px-4 py-3">Danh muc</th>
                    <th className="text-right px-4 py-3">Gia</th>
                    <th className="text-center px-4 py-3">Trang thai</th>
                    <th className="text-right px-4 py-3">Thao tac</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{p.emoji}</span>
                          <div>
                            <p className="text-[13px] font-medium">{p.name}</p>
                            <p className="text-[10px] text-muted">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-muted">{p.category}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-mono text-[13px] text-[#c8a96e]">{formatPrice(p.price)}</span>
                        {p.original_price && (
                          <span className="font-mono text-[11px] text-muted line-through ml-2">
                            {formatPrice(p.original_price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {p.badge && (
                            <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded ${
                              p.badge === 'sale' ? 'bg-red-900/30 text-red-300' : 'bg-[#c8a96e]/10 text-[#c8a96e]'
                            }`}>{p.badge}</span>
                          )}
                          <span className={`text-[9px] tracking-[0.1em] uppercase ${p.in_stock ? 'text-green-400' : 'text-red-400'}`}>
                            {p.in_stock ? 'Con hang' : 'Het'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(p)}
                            className="text-[11px] text-[#c8a96e] hover:text-[#e8d0a0] transition-colors"
                          >
                            Sua
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-[11px] text-red-400/60 hover:text-red-400 transition-colors"
                          >
                            Xoa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Edit / Create form */
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setMode('list')} className="text-muted hover:text-[#f0ede6] text-[13px]">
              ← Quay lai
            </button>
            <h1 className="font-serif text-[24px] font-normal">
              {mode === 'create' ? 'Them san pham moi' : 'Sua san pham'}
            </h1>
          </div>

          <div className="bg-[#1a1916] border border-white/7 rounded p-6 max-w-2xl">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Ten san pham *</label>
                <input
                  type="text"
                  value={editProduct.name || ''}
                  onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e]"
                />
              </div>

              {/* Price + Original price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Gia (VND) *</label>
                  <input
                    type="number"
                    value={editProduct.price || 0}
                    onChange={e => setEditProduct(p => ({ ...p, price: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Gia goc (neu giam gia)</label>
                  <input
                    type="number"
                    value={editProduct.original_price || ''}
                    onChange={e => setEditProduct(p => ({ ...p, original_price: parseInt(e.target.value) || null }))}
                    className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e]"
                  />
                </div>
              </div>

              {/* Category + Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Danh muc</label>
                  <select
                    value={editProduct.category || 'ao'}
                    onChange={e => setEditProduct(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none"
                  >
                    <option value="ao">Ao</option>
                    <option value="vay-dam">Vay & Dam</option>
                    <option value="quan">Quan</option>
                    <option value="phu-kien">Phu kien</option>
                    <option value="giay">Giay</option>
                    <option value="tui">Tui xach</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Badge</label>
                  <select
                    value={editProduct.badge || ''}
                    onChange={e => setEditProduct(p => ({ ...p, badge: e.target.value || null }))}
                    className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none"
                  >
                    <option value="">Khong co</option>
                    <option value="new">Moi</option>
                    <option value="sale">Giam gia</option>
                  </select>
                </div>
              </div>

              {/* Tag + Emoji */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Tag</label>
                  <input
                    type="text"
                    value={editProduct.tag || ''}
                    onChange={e => setEditProduct(p => ({ ...p, tag: e.target.value }))}
                    placeholder="Moi ve, Ban chay..."
                    className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e] placeholder:text-muted/30"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Emoji</label>
                  <input
                    type="text"
                    value={editProduct.emoji || ''}
                    onChange={e => setEditProduct(p => ({ ...p, emoji: e.target.value }))}
                    className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Mo ta</label>
                <textarea
                  value={editProduct.description || ''}
                  onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-[#0b0a08] border border-white/10 rounded px-4 py-3 text-[13px] text-[#f0ede6] outline-none focus:border-[#c8a96e] resize-none"
                />
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-muted mb-2">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const sizes = editProduct.sizes || []
                        setEditProduct(p => ({
                          ...p,
                          sizes: sizes.includes(size) ? sizes.filter(s => s !== size) : [...sizes, size],
                        }))
                      }}
                      className={`px-3 py-1.5 text-[11px] rounded border transition-colors ${
                        (editProduct.sizes || []).includes(size)
                          ? 'bg-[#c8a96e]/10 border-[#c8a96e]/30 text-[#c8a96e]'
                          : 'border-white/10 text-muted hover:border-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editProduct.in_stock ?? true}
                  onChange={e => setEditProduct(p => ({ ...p, in_stock: e.target.checked }))}
                  className="w-4 h-4 accent-[#c8a96e]"
                />
                <span className="text-[13px]">Con hang</span>
              </label>

              {/* Save */}
              <div className="flex gap-3 pt-4 border-t border-white/7">
                <button
                  onClick={saveProduct}
                  disabled={saving || !editProduct.name}
                  className="bg-[#c8a96e] hover:bg-[#e8d0a0] text-[#0b0a08] text-[11px] font-medium tracking-[0.1em] uppercase px-6 py-3 rounded transition-colors disabled:opacity-50"
                >
                  {saving ? 'Dang luu...' : mode === 'create' ? 'Tao san pham' : 'Cap nhat'}
                </button>
                <button
                  onClick={() => setMode('list')}
                  className="text-[11px] text-muted hover:text-[#f0ede6] px-4 py-3 transition-colors"
                >
                  Huy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
