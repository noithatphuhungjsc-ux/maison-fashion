export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: ProductRow
        Insert: Partial<ProductRow>
        Update: Partial<ProductRow>
      }
      categories: {
        Row: CategoryRow
        Insert: Partial<CategoryRow>
        Update: Partial<CategoryRow>
      }
      reviews: {
        Row: ReviewRow
        Insert: Partial<ReviewRow>
        Update: Partial<ReviewRow>
      }
      promo_codes: {
        Row: PromoCodeRow
        Insert: Partial<PromoCodeRow>
        Update: Partial<PromoCodeRow>
      }
      orders: {
        Row: OrderRow
        Insert: Partial<OrderRow>
        Update: Partial<OrderRow>
      }
      order_items: {
        Row: OrderItemRow
        Insert: Partial<OrderItemRow>
        Update: Partial<OrderItemRow>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface ProductRow {
  id: string
  slug: string
  name: string
  description: string | null
  tag: string | null
  price: number
  original_price: number | null
  category: string
  badge: string | null
  sizes: string[]
  images: string[]
  emoji: string | null
  in_stock: boolean
  rating: number
  review_count: number
  details: string[]
  created_at: string
  updated_at: string
}

export interface CategoryRow {
  id: string
  slug: string
  name: string
  count: number
  emoji: string | null
  aspect_tall: boolean
}

export interface ReviewRow {
  id: string
  product_id: string | null
  author: string
  avatar: string | null
  rating: number
  text: string | null
  date: string | null
  verified: boolean
  created_at: string
}

export interface PromoCodeRow {
  id: string
  code: string
  type: string
  value: number
  min_order: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
}

export interface OrderRow {
  id: string
  order_number: string
  status: string
  subtotal: number
  shipping_fee: number
  discount: number
  total: number
  shipping_addr: Record<string, string> | null
  promo_code: string | null
  payment_method: string | null
  payment_status: string
  paid_at: string | null
  notes: string | null
  created_at: string
}

export interface OrderItemRow {
  id: string
  order_id: string
  product_id: string
  product_name: string
  price: number
  size: string
  qty: number
  image_url: string | null
}
