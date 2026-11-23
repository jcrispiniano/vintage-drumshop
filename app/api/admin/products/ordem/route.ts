import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

/**
 * Salva a ordem manual de uma categoria: `ids` são os produtos fixados no topo, na ordem em que
 * devem aparecer (1º, 2º, 3º...). Todo o resto da categoria volta para a ordem automática.
 */
export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  const body = await req.json().catch(() => null)
  const category = typeof body?.category === 'string' ? body.category.trim() : ''
  const ids: unknown = body?.ids
  if (!category || !Array.isArray(ids) || ids.length > 500 || !ids.every(id => Number.isInteger(id))) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }
  const pinned = ids as number[]
  if (new Set(pinned).size !== pinned.length) {
    return NextResponse.json({ error: 'Produto repetido na lista' }, { status: 400 })
  }

  // Só mexe em produtos da própria categoria
  const { data: inCategory, error: readError } = await supabaseAdmin.from('products').select('id').eq('category', category)
  if (readError) return NextResponse.json({ error: readError.message }, { status: 500 })
  const valid = new Set((inCategory ?? []).map(r => r.id as number))
  if (pinned.some(id => !valid.has(id))) {
    return NextResponse.json({ error: 'Há produto de outra categoria na lista' }, { status: 400 })
  }

  // Quem saiu da lista volta para a ordem automática; depois numera os fixados
  let clear = supabaseAdmin.from('products').update({ sort_order: null }).eq('category', category)
  if (pinned.length) clear = clear.not('id', 'in', `(${pinned.join(',')})`)
  const { error: clearError } = await clear
  if (clearError) {
    const missing = clearError.code === 'PGRST204' || /sort_order/.test(clearError.message)
    return NextResponse.json(
      { error: missing ? 'Falta rodar a migração 007 (coluna sort_order) no banco.' : clearError.message },
      { status: 500 }
    )
  }

  const results = await Promise.all(
    pinned.map((id, i) => supabaseAdmin.from('products').update({ sort_order: i + 1 }).eq('id', id))
  )
  const failed = results.find(r => r.error)
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 })

  // A loja renderiza no servidor: atualiza as páginas já para o cliente ver a nova ordem
  try { revalidatePath('/', 'layout') } catch { /* fora do contexto de renderização */ }

  return NextResponse.json({ ok: true, pinned: pinned.length })
}
