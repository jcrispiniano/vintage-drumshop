-- ============================================================
-- Clientes do painel /admin (base para orçamentos e, no futuro,
-- disparo de e-mails para quem aceitou receber).
--
-- Execute no SQL Editor do projeto Supabase. É idempotente.
-- Sem políticas de leitura: só o servidor (service_role) acessa.
-- ============================================================

create table if not exists public.customers (
  id                   bigserial primary key,
  name                 text        not null,
  email                text,                 -- sempre em minúsculas
  whatsapp             text,                 -- só dígitos, com DDI (ex.: 5511964405519)
  instagram            text,
  city                 text,
  notes                text,
  -- LGPD: e-mail marketing só para quem aceitou; guarda quando aceitou
  accepts_marketing    boolean     not null default false,
  marketing_consent_at timestamptz,
  -- 'manual' (cadastrado no painel) ou 'orcamento' (criado ao salvar um orçamento)
  source               text        not null default 'manual',
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- Um cliente por e-mail e por WhatsApp (é o que permite casar orçamento com cliente)
create unique index if not exists customers_email_key on public.customers (lower(email)) where email is not null;
create unique index if not exists customers_whatsapp_key on public.customers (whatsapp) where whatsapp is not null;
create index if not exists customers_name_idx on public.customers (lower(name));

-- Reaproveita a função de supabase/schema.sql (recriada aqui por segurança)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists customers_updated_at on public.customers;
create trigger customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

alter table public.customers enable row level security;

-- Orçamento ligado ao cliente (apagar o cliente não apaga os orçamentos)
alter table public.quotes add column if not exists customer_id bigint references public.customers (id) on delete set null;
create index if not exists quotes_customer_id_idx on public.quotes (customer_id);

-- Os orçamentos que já existem são ligados pelo botão "Importar dos orçamentos"
-- na aba Clientes do painel, com a mesma regra usada ao salvar um orçamento.

select pg_notify('pgrst', 'reload schema');
