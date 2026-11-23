-- Ordem manual dos produtos na loja. 1 aparece primeiro; NULL = ordem automática
-- (mais novos primeiro), depois dos produtos fixados. Idempotente.
alter table public.products add column if not exists sort_order integer;
comment on column public.products.sort_order is 'Ordem manual na loja: 1 aparece primeiro; NULL = ordem automática (mais novos primeiro), depois dos fixados';
create index if not exists products_category_sort_order_idx on public.products (category, sort_order);
select pg_notify('pgrst', 'reload schema');
