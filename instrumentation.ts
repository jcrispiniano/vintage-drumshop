export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (!process.env.DATABASE_URL) return

  const { default: postgres } = await import('postgres')
  const sql = postgres(process.env.DATABASE_URL, { max: 1 })

  try {
    await sql`
      ALTER TABLE public.products
        ADD COLUMN IF NOT EXISTS out_of_stock boolean NOT NULL DEFAULT false
    `
    console.log('[migrate] out_of_stock OK')
  } catch (err) {
    console.error('[migrate] erro:', err)
  } finally {
    await sql.end()
  }
}
