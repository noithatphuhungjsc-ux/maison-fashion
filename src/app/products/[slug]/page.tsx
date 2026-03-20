import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PRODUCTS, FEATURED_PRODUCT } from '@/lib/data'
import ProductDetailClient from './ProductDetailClient'

const ALL_PRODUCTS = [FEATURED_PRODUCT, ...PRODUCTS]

export function generateStaticParams() {
  return ALL_PRODUCTS.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = ALL_PRODUCTS.find(p => p.slug === params.slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description ?? `Mua ${product.name} tại MAISON`,
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = ALL_PRODUCTS.find(p => p.slug === params.slug)
  if (!product) notFound()

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  return <ProductDetailClient product={product} related={related} />
}
