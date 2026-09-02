import type { PostgrestSingleResponse } from '@supabase/supabase-js'

export type ProductRow = Record<string, unknown>

/** Converte o payload do formulário do admin para uma linha da tabela `products`. */
export function toDbRow(body: Record<string, unknown>): ProductRow {
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

/**
 * Colunas que podem não existir em bases criadas antes das migrações de
 * `supabase/schema.sql`. Se o PostgREST reclamar de uma delas, a gravação é
 * refeita sem a coluna em vez de falhar o salvamento inteiro.
 */
const OPTIONAL_COLUMNS = ['sold_out', 'images']

/** PGRST204 = "Could not find the 'x' column of 'products' in the schema cache". */
function missingColumn(error: { code?: string; message?: string } | null) {
  if (!error || error.code !== 'PGRST204') return null
  const column = error.message?.match(/'([^']+)' column/)?.[1]
  return column && OPTIONAL_COLUMNS.includes(column) ? column : null
}

/**
 * Executa a gravação e, se a base ainda não tiver alguma coluna opcional,
 * tenta de novo sem ela. Rode `supabase/schema.sql` para deixar a base em dia.
 */
export async function writeProductRow<T>(
  write: (row: ProductRow) => PromiseLike<PostgrestSingleResponse<T>>,
  row: ProductRow
): Promise<PostgrestSingleResponse<T>> {
  let current = row

  for (let attempt = 0; attempt <= OPTIONAL_COLUMNS.length; attempt++) {
    const result = await write(current)
    const column = missingColumn(result.error)
    if (!column) return result

    console.warn(
      `[products] coluna "${column}" não existe na base — salvando sem ela. ` +
        'Execute supabase/schema.sql para aplicar a migração.'
    )
    const { [column]: _dropped, ...rest } = current
    current = rest
  }

  return write(current)
}
