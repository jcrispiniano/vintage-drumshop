import { NextResponse } from 'next/server'
import { products as staticProducts, sortForShop, toShopCard } from '@/lib/products'
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

  // Sem abas, galeria e vídeos (só a página do produto usa): a lista fica ~40% menor
  const normalized = (data ?? []).map(normalizeProduct).map(p => toShopCard(p, null))

  // O navegador pede esta lista a cada visita: o cache do Vercel evita refazer a consulta ao banco toda vez
  return NextResponse.json(sortForShop(normalized), {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600' },
  })
}
