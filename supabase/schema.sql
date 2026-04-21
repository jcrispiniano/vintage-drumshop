-- ============================================================
-- Vintage Drum Shop — Schema Supabase
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- ============================================================

-- Tabela de produtos
create table if not exists public.products (
  id          bigserial primary key,
  name        text        not null,
  category    text        not null,
  brand       text        not null,
  price       numeric(10, 2) not null,
  old_price   numeric(10, 2),
  image       text        not null,
  images      text[],
  badge       text,
  description text        not null,
  featured    boolean     not null default false,
  active      boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger para atualizar updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Índices para buscas rápidas por categoria e marca
create index if not exists products_category_idx on public.products (category);
create index if not exists products_brand_idx    on public.products (brand);
create index if not exists products_active_idx   on public.products (active);

-- ============================================================
-- Row Level Security (RLS)
-- Leitura pública; escrita apenas via service_role (servidor)
-- ============================================================
alter table public.products enable row level security;

create policy "Qualquer pessoa pode ler produtos ativos"
  on public.products for select
  using (active = true);

-- ============================================================
-- Storage: bucket público para imagens de produtos
-- ============================================================

-- 1. Crie o bucket manualmente em: Storage > New bucket
--    Nome: produtos | Public bucket: ON
--
-- 2. Execute as policies abaixo para liberar acesso público de leitura:

create policy "Imagens de produtos são públicas"
  on storage.objects for select
  using (bucket_id = 'produtos');

create policy "Service role pode fazer upload"
  on storage.objects for insert
  with check (bucket_id = 'produtos');

create policy "Service role pode deletar imagens"
  on storage.objects for delete
  using (bucket_id = 'produtos');

-- ============================================================
-- Variáveis de ambiente necessárias no Vercel
-- ============================================================
-- NEXT_PUBLIC_SUPABASE_URL      → Configurações > API > Project URL
-- NEXT_PUBLIC_SUPABASE_ANON_KEY → Configurações > API > anon public
-- SUPABASE_SERVICE_ROLE_KEY     → Configurações > API > service_role (secret)
-- ADMIN_PASSWORD                → Senha de acesso ao painel /admin (ex: MinhaS3nh@)
