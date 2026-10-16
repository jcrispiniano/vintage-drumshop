-- ============================================================
-- Áudio opcional por produto ("Ouça antes de comprar")
--
-- Execute no SQL Editor do projeto Supabase. É idempotente.
-- Até rodar, o painel salva os produtos normalmente, só sem o áudio.
-- ============================================================

alter table public.products
  add column if not exists audio text;

notify pgrst, 'reload schema';
