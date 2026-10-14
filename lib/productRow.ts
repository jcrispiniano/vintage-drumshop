import type { Product } from '@/lib/products'

export function normalizeProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as number,
    name: row.name as string,
    category: row.category as string,
    brand: row.brand as string,
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : undefined,
    image: row.image as string,
    images: (row.images as string[]) ?? undefined,
    badge: (row.badge as string) ?? undefined,
    description: row.description as string,
    featured: (row.featured as boolean) ?? false,
    soldOut: (row.sold_out as boolean) ?? false,
  }
}

type DbRow = Record<string, unknown>

/**
 * Converte o corpo da requisição (camelCase) para colunas do banco.
 * Com `partial`, só inclui os campos enviados — evita sobrescrever colunas
 * (ex.: sold_out) quando o painel envia apenas { active }.
 */
export function toDbRow(body: Record<string, unknown>, partial = false): { row: DbRow; error?: string } {
  const row: DbRow = {}
  const has = (k: string) => !partial || body[k] !== undefined

  for (const field of ['name', 'category', 'brand', 'image', 'description'] as const) {
    if (!has(field)) continue
    const value = typeof body[field] === 'string' ? (body[field] as string).trim() : ''
    if (!value) return { row, error: `Campo obrigatório: ${field}` }
    row[field] = value
  }

  if (has('price')) {
    const price = Number(body.price)
    if (!Number.isFinite(price) || price < 0) return { row, error: 'Preço inválido' }
    row.price = price
  }

  if (has('oldPrice')) {
    const oldPrice = body.oldPrice ? Number(body.oldPrice) : null
    if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < 0)) {
      return { row, error: 'Preço antigo inválido' }
    }
    row.old_price = oldPrice
  }

  if (has('images')) row.images = Array.isArray(body.images) ? body.images : null
  if (has('badge')) row.badge = body.badge || null
  if (has('featured')) row.featured = body.featured ?? false
  if (has('active')) row.active = body.active ?? true
  if (has('soldOut')) row.sold_out = body.soldOut ?? false

  return { row }
}
