import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { toDbRow, writeProductRow } from '@/lib/productRow'

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
  const { row, error: validationError } = toDbRow(body)
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

  const { data, error } = await writeProductRow(
    r => supabaseAdmin.from('products').insert([r]).select().single(),
    row
  )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
