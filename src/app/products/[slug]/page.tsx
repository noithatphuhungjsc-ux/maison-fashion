import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getProducts, getAllSlugs } from '@/lib/queries'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description ?? `Mua ${product.name} tại MAISON`,
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const allProducts = await getProducts()
  const related = allProducts.filter(p => p.category === product.category && p.slug !== product.slug).slice(0, 4)

  return <ProductDetailClient product={product} related={related} />
}
