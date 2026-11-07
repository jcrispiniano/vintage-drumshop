/**
 * Reduz uma foto no navegador antes do upload.
 *
 * Fotos de celular passam fácil de 4MB, e a Vercel recusa corpos acima de
 * 4,5MB. Redimensionar para no máximo 2000px e salvar em JPEG deixa a foto
 * com algumas centenas de KB, sem perda visível no site.
 */
const MAX_SIDE = 2000
const QUALITY = 0.85
/** Abaixo disso (e já em JPEG/WEBP pequeno) a foto vai como está. */
const SKIP_BELOW_BYTES = 1.5 * 1024 * 1024

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    // Formato que o navegador não decodifica (ex.: HEIC no Chrome): manda o original
    return file
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size <= SKIP_BELOW_BYTES) {
    bitmap.close()
    return file
  }

  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return file
  }
  // Fundo branco para PNGs com transparência (JPEG não tem canal alfa)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', QUALITY))
  if (!blob || blob.size >= file.size) return file

  const name = file.name.replace(/\.[^/.]+$/, '') + '.jpg'
  return new File([blob], name, { type: 'image/jpeg' })
}
