import { products as staticProducts, Product } from '@/lib/products'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

function normalize(row: Record<string, unknown>): Product {
  return {
    id: row.id as number,
    name: row.name as string,
    category: row.category as string,
    brand: row.brand as string,
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : undefined,
    image: row.image as string,
    images: (row.images as string[]) ?? undefined,
    badge: (row.badge as string) ?? undefined,
    description: row.description as string,
    featured: (row.featured as boolean) ?? false,
    soldOut: (row.sold_out as boolean) ?? false,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return staticProducts

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error || !data?.length) return staticProducts
  return data.map(normalize)
}

export async function getProductById(id: number): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return staticProducts.find(p => p.id === id) ?? null
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('active', true)
    .single()

  if (error || !data) return staticProducts.find(p => p.id === id) ?? null
  return normalize(data)
}

export async function getAllProductIds(): Promise<number[]> {
  if (!isSupabaseConfigured()) return staticProducts.map(p => p.id)

  const { data } = await supabase
    .from('products')
    .select('id')
    .eq('active', true)

  if (!data?.length) return staticProducts.map(p => p.id)
  return data.map((r: { id: number }) => r.id)
}
