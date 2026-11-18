import { NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

type Params = { params: Promise<{ id: string }> }

/**
 * Cria uma cópia do produto (fotos, descrição, vídeos, abas...) fora do site,
 * para virar outra configuração/cor sem cadastrar tudo de novo.
 */
export async function POST(_req: Request, { params }: Params) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }
  const { id } = await params
  const { data: original, error } = await supabaseAdmin.from('products').select('*').eq('id', id).single()
  if (error || !original) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- campos que o banco gera de novo
  const { id: _id, created_at, updated_at, ...copy } = original
  const { data, error: insertError } = await supabaseAdmin
    .from('products')
    .insert([{ ...copy, name: `${original.name} (cópia)`, active: false, featured: false }])
    .select()
    .single()

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
