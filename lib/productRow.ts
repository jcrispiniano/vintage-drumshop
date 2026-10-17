import type { PostgrestSingleResponse } from '@supabase/supabase-js'
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
    audio: (row.audio as string) || undefined,
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
  if (has('audio')) row.audio = typeof body.audio === 'string' && body.audio.trim() ? body.audio.trim() : null

  return { row }
}

/**
 * Colunas que podem não existir em bases criadas antes das migrações de
 * `supabase/schema.sql`. Se o PostgREST reclamar de uma delas, a gravação é
 * refeita sem a coluna em vez de falhar o salvamento inteiro.
 */
const OPTIONAL_COLUMNS = ['sold_out', 'images', 'audio']

/** PGRST204 = "Could not find the 'x' column of 'products' in the schema cache". */
function missingColumn(error: { code?: string; message?: string } | null) {
  if (!error || error.code !== 'PGRST204') return null
  const column = error.message?.match(/'([^']+)' column/)?.[1]
  return column && OPTIONAL_COLUMNS.includes(column) ? column : null
}

/**
 * Executa a gravação e, se a base ainda não tiver alguma coluna opcional,
 * tenta de novo sem ela. Rode as migrações de `supabase/migrations/`
 * para deixar a base em dia.
 */
export async function writeProductRow<T>(
  write: (row: DbRow) => PromiseLike<PostgrestSingleResponse<T>>,
  row: DbRow
): Promise<PostgrestSingleResponse<T>> {
  let current = row

  for (let attempt = 0; attempt < OPTIONAL_COLUMNS.length; attempt++) {
    const result = await write(current)
    const column = missingColumn(result.error)
    if (!column) return result

    console.warn(
      `[products] coluna "${column}" não existe na base — salvando sem ela. ` +
        'Execute as migrações em supabase/migrations/.'
    )
    const rest = { ...current }
    delete rest[column]
    current = rest
  }

  return write(current)
}
