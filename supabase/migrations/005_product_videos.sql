-- ============================================================
-- Vídeos dos produtos (YouTube): links na ordem de exibição.
-- Aparecem na página do produto em "Ouça o som". Idempotente.
-- ============================================================
alter table public.products add column if not exists videos text[];
comment on column public.products.videos is 'Vídeos do produto no YouTube (links), na ordem de exibição';
select pg_notify('pgrst', 'reload schema');
