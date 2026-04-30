import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  const body = await req.json()

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([toDbRow(body)])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

function toDbRow(body: Record<string, unknown>) {
  return {
    name: body.name,
    category: body.category,
    brand: body.brand,
    price: Number(body.price),
    old_price: body.oldPrice ? Number(body.oldPrice) : null,
    image: body.image,
    images: body.images ?? null,
    badge: body.badge || null,
    description: body.description,
    featured: body.featured ?? false,
    active: body.active ?? true,
    out_of_stock: body.outOfStock ?? false,
  }
}
