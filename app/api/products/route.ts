import { NextResponse } from 'next/server'
import { products as staticProducts } from '@/lib/products'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { normalizeProduct } from '@/lib/productRow'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (!isSupabaseConfigured()) {
    const filtered = category
      ? staticProducts.filter(p => p.category === category)
      : staticProducts
    return NextResponse.json(filtered)
  }

  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    const filtered = category
      ? staticProducts.filter(p => p.category === category)
      : staticProducts
    return NextResponse.json(filtered)
  }

  const normalized = (data ?? []).map(normalizeProduct)

  return NextResponse.json(normalized)
}
