// src/types/index.ts

export interface Product {
  id: number
  slug: string
  name: string
  tag: string
  price: number
  originalPrice?: number
  emoji: string
  rating: number
  reviewCount: number
  badge?: 'new' | 'sale' | null
  category: ProductCategory
  sizes: Size[]
  description?: string
  details?: string[]
  inStock: boolean
}

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type ProductCategory = 'ao' | 'vay-dam' | 'quan' | 'phu-kien' | 'giay' | 'tui'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  ao: 'Áo',
  'vay-dam': 'Váy & Đầm',
  quan: 'Quần',
  'phu-kien': 'Phụ kiện',
  giay: 'Giày',
  tui: 'Túi xách',
}

export interface CartItem {
  productId: number
  name: string
  price: number
  size: Size
  qty: number
  emoji: string
}

export interface Category {
  slug: ProductCategory
  name: string
  count: number
  emoji: string
  aspectTall?: boolean
}

export interface Review {
  id: number
  author: string
  avatar: string
  rating: number
  text: string
  date: string
  verified: boolean
}
