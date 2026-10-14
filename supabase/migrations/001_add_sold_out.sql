-- ============================================================
-- Corrige: "Could not find the 'sold_out' column of 'products'
--           in the schema cache" ao salvar um produto no /admin
--
-- Execute no SQL Editor do projeto Supabase. É idempotente.
-- ============================================================

alter table public.products
  add column if not exists sold_out boolean not null default false;

alter table public.products
  add column if not exists images text[];

-- Sem isso a API (PostgREST) continua servindo o cache antigo de schema
notify pgrst, 'reload schema';
