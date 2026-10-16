import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// Funções da Vercel aceitam no máximo 4,5MB de corpo na requisição
const MAX_SIZE_MB = 4

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const category =
    String(formData.get('category') ?? '').toLowerCase().replace(/[^a-z0-9-]/g, '') || 'outros'

  if (!file) {
    return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 })
  }

  const isAudio = file.type.startsWith('audio/')
  if (!file.type.startsWith('image/') && !isAudio) {
    return NextResponse.json({ error: 'Envie uma imagem ou um áudio (MP3, M4A)' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `Tamanho máximo: ${MAX_SIZE_MB}MB` }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const safeName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40)
  const pathname = `${isAudio ? 'audios' : 'produtos'}/${category}/${safeName}-${Date.now()}.${ext}`

  const blob = await put(pathname, file, {
    access: 'public',
    contentType: file.type,
  })

  return NextResponse.json({ url: blob.url })
}
