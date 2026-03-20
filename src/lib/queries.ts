import { supabase } from './supabase'
import { PRODUCTS, FEATURED_PRODUCT, CATEGORIES, REVIEWS } from './data'
import type { Product, Category, Review, ProductCategory, Size } from '@/types'
import type { ProductRow, CategoryRow, ReviewRow } from '@/types/database'

// ---------------------
// Mappers: Supabase Row → Frontend Type
// ---------------------

function mapProduct(row: ProductRow): Product {
  return {
    id: row.slug.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0),
    slug: row.slug,
    name: row.name,
    tag: row.tag ?? '',
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    emoji: row.emoji ?? '🛍',
    rating: Number(row.rating),
    reviewCount: row.review_count,
    badge: (row.badge as 'new' | 'sale') ?? null,
    category: row.category as ProductCategory,
    sizes: row.sizes as Size[],
    inStock: row.in_stock,
    description: row.description ?? undefined,
    details: row.details.length > 0 ? row.details : undefined,
  }
}

function mapCategory(row: CategoryRow): Category {
  return {
    slug: row.slug as ProductCategory,
    name: row.name,
    count: row.count,
    emoji: row.emoji ?? '',
    aspectTall: row.aspect_tall,
  }
}

function mapReview(row: ReviewRow): Review {
  return {
    id: Date.now() + Math.random(),
    author: row.author,
    avatar: row.avatar ?? '',
    rating: row.rating,
    text: row.text ?? '',
    date: row.date ?? '',
    verified: row.verified,
  }
}

// ---------------------
// Queries with fallback
// ---------------------

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data || data.length === 0) return PRODUCTS
    return (data as ProductRow[]).map(mapProduct)
  } catch {
    return PRODUCTS
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      const all = [FEATURED_PRODUCT, ...PRODUCTS]
      return all.find(p => p.slug === slug) ?? null
    }
    return mapProduct(data as ProductRow)
  } catch {
    const all = [FEATURED_PRODUCT, ...PRODUCTS]
    return all.find(p => p.slug === slug) ?? null
  }
}

export async function getFeaturedProduct(): Promise<Product> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', 'dam-da-hoi-noir-silk')
      .single()

    if (error || !data) return FEATURED_PRODUCT
    return mapProduct(data as ProductRow)
  } catch {
    return FEATURED_PRODUCT
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('count', { ascending: false })

    if (error || !data || data.length === 0) return CATEGORIES
    return (data as CategoryRow[]).map(mapCategory)
  } catch {
    return CATEGORIES
  }
}

export async function getReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)

    if (error || !data || data.length === 0) return REVIEWS
    return (data as ReviewRow[]).map(mapReview)
  } catch {
    return REVIEWS
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)

    if (error || !data) return PRODUCTS.filter(p => p.category === category)
    return (data as ProductRow[]).map(mapProduct)
  } catch {
    return PRODUCTS.filter(p => p.category === category)
  }
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')

    if (error || !data || data.length === 0) {
      return [FEATURED_PRODUCT, ...PRODUCTS].map(p => p.slug)
    }
    return (data as ProductRow[]).map(d => d.slug)
  } catch {
    return [FEATURED_PRODUCT, ...PRODUCTS].map(p => p.slug)
  }
}
