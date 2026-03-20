import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Size } from '@/types'

interface CartStore {
  items: CartItem[]
  add: (item: Omit<CartItem, 'qty'>) => void
  remove: (productId: number, size: Size) => void
  changeQty: (productId: number, size: Size, delta: number) => void
  clear: () => void
  total: () => number
  count: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      add(item) {
        set(state => {
          const idx = state.items.findIndex(
            i => i.productId === item.productId && i.size === item.size
          )
          if (idx >= 0) {
            const next = [...state.items]
            next[idx] = { ...next[idx], qty: next[idx].qty + 1 }
            return { items: next }
          }
          return { items: [...state.items, { ...item, qty: 1 }] }
        })
      },

      remove(productId, size) {
        set(state => ({
          items: state.items.filter(
            i => !(i.productId === productId && i.size === size)
          ),
        }))
      },

      changeQty(productId, size, delta) {
        set(state => {
          const next = state.items
            .map(i =>
              i.productId === productId && i.size === size
                ? { ...i, qty: i.qty + delta }
                : i
            )
            .filter(i => i.qty > 0)
          return { items: next }
        })
      },

      clear: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
    }),
    { name: 'maison-cart' }
  )
)

interface WishlistStore {
  ids: number[]
  toggle: (id: number) => void
  has: (id: number) => boolean
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set(s => ({
          ids: s.ids.includes(id) ? s.ids.filter(x => x !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    { name: 'maison-wishlist' }
  )
)
