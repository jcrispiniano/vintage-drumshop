import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  // Lista todos os blobs já enviados
  const { blobs } = await list({ prefix: 'produtos/' })

  if (!blobs.length) {
    return NextResponse.json({ error: 'Nenhum blob encontrado. Verifique o Vercel Blob.' }, { status: 404 })
  }

  // Para cada blob, a path local equivalente é "/<pathname>"
  // Ex: blob.pathname = "produtos/pratos/ride-22.jpg" → local = "/produtos/pratos/ride-22.jpg"
  let updated = 0
  const errors: string[] = []

  for (const blob of blobs) {
    const localPath = `/${blob.pathname}`

    const { error } = await supabaseAdmin
      .from('products')
      .update({ image: blob.url })
      .eq('image', localPath)

    if (error) {
      errors.push(`${localPath}: ${error.message}`)
    } else {
      updated++
    }
  }

  // Verifica quantos produtos ainda têm caminhos locais
  const { count } = await supabaseAdmin
    .from('products')
    .select('id', { count: 'exact', head: true })
    .like('image', '/%')

  return NextResponse.json({
    blobsFound: blobs.length,
    updated,
    errors,
    stillLocal: count ?? 0,
  })
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  const { blobs } = await list({ prefix: 'produtos/' })

  const { data: localProducts } = await supabaseAdmin
    .from('products')
    .select('id, name, image')
    .like('image', '/%')

  return NextResponse.json({
    blobsInVercel: blobs.length,
    productsWithLocalUrl: localProducts?.length ?? 0,
    products: localProducts,
  })
}
