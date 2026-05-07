import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(toDbRow(body))
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
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
    sold_out: body.soldOut ?? false,
  }
}
