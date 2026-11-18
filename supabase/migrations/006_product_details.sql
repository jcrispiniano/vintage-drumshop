-- Conteúdo estruturado da página do produto (abas): características, ficha técnica,
-- configurações com foto, tambores avulsos e acabamentos. Opcional: produtos sem
-- detalhes continuam com a página simples.
alter table public.products
  add column if not exists details jsonb;
