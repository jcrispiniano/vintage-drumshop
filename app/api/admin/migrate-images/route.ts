import { NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const PUBLIC_DIR = path.join(process.cwd(), 'public')

function mimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', webp: 'image/webp', gif: 'image/gif',
  }
  return map[ext ?? ''] ?? 'image/jpeg'
}

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  // 1. Busca todos os produtos com imagens locais (começam com /)
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name, image')
    .like('image', '/%')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!products?.length) {
    return NextResponse.json({ message: 'Nenhuma imagem local para migrar.', migrated: 0 })
  }

  // 2. Busca imagens já enviadas para o Blob para não duplicar
  const { blobs: existing } = await list({ prefix: 'produtos/' })
  const existingPaths = new Set(existing.map(b => b.pathname))

  const results: { id: number; name: string; old: string; new: string; status: string }[] = []

  for (const product of products) {
    const localPath = path.join(PUBLIC_DIR, product.image)

    if (!existsSync(localPath)) {
      results.push({ id: product.id, name: product.name, old: product.image, new: '', status: 'arquivo não encontrado' })
      continue
    }

    // Blob path: remove a barra inicial → "produtos/pratos/clap-stack-set.jpg"
    const blobPathname = product.image.replace(/^\//, '')

    // Já existe no Blob? Só atualiza o banco
    const alreadyUploaded = existing.find(b => b.pathname === blobPathname)

    let blobUrl: string

    if (alreadyUploaded) {
      blobUrl = alreadyUploaded.url
    } else {
      const buffer = await readFile(localPath)
      const mime = mimeType(localPath)
      const blob = await put(blobPathname, buffer, { access: 'public', contentType: mime })
      blobUrl = blob.url
    }

    // Atualiza o produto no Supabase com o novo URL
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ image: blobUrl })
      .eq('id', product.id)

    results.push({
      id: product.id,
      name: product.name,
      old: product.image,
      new: blobUrl,
      status: alreadyUploaded ? 'já existia no blob, URL atualizado' : 'migrado',
    })
  }

  const migrated = results.filter(r => r.status === 'migrado').length
  const updated = results.filter(r => r.status.includes('atualizado')).length
  const failed = results.filter(r => r.status === 'arquivo não encontrado').length

  return NextResponse.json({ migrated, updated, failed, results })
}

// GET: prévia — mostra o que seria migrado sem fazer nada
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase não configurado' }, { status: 503 })
  }

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name, image')
    .like('image', '/%')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const preview = (products ?? []).map(p => ({
    id: p.id,
    name: p.name,
    localPath: p.image,
    exists: existsSync(path.join(PUBLIC_DIR, p.image)),
  }))

  return NextResponse.json({
    total: preview.length,
    found: preview.filter(p => p.exists).length,
    missing: preview.filter(p => !p.exists).length,
    preview,
  })
}
