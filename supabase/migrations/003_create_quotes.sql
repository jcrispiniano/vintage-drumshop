-- ============================================================
-- Orçamentos (cotações) criados pelo painel /admin
--
-- Execute no SQL Editor do projeto Supabase. É idempotente.
-- Sem políticas de leitura: só o servidor (service_role) acessa.
-- ============================================================

create table if not exists public.quotes (
  id            bigserial primary key,
  client_name   text        not null,
  client_contact text,
  quote_date    date        not null default current_date,
  -- [{ description, price, payment, qty, gift }]
  items         jsonb       not null default '[]'::jsonb,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Reaproveita a função de supabase/schema.sql (recriada aqui por segurança)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quotes_updated_at on public.quotes;
create trigger quotes_updated_at
  before update on public.quotes
  for each row execute function public.set_updated_at();

create index if not exists quotes_created_at_idx on public.quotes (created_at desc);

alter table public.quotes enable row level security;

notify pgrst, 'reload schema';
