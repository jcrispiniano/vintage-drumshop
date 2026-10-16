'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

import { useProductsStore } from '@/lib/productsStore';
import { Product, contactInfo } from '@/lib/products';
import { TIMBRES, TimbreId, productSizeValue, productTimbres } from '@/lib/productText';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import CatalogGrid, { SORTS, SortKey } from '@/components/CatalogGrid';

type CymbalType = 'todos' | 'crash' | 'ride' | 'hihat' | 'effects';

function getCymbalType(name: string): Exclude<CymbalType, 'todos'> {
  const n = name.toLowerCase();
  if (n.includes('crash')) return 'crash';
  if (n.includes('ride')) return 'ride';
  if (n.includes('hi-hat') || n.includes('chimbal')) return 'hihat';
  return 'effects';
}

const TYPE_LABELS: Record<CymbalType, string> = {
  todos: 'Todos',
  crash: 'Crash',
  ride: 'Ride',
  hihat: 'Hi-Hat',
  effects: 'Efeitos e stacks',
};

const TYPES = ['crash', 'ride', 'hihat', 'effects'] as const;

const chip = (active: boolean, disabled = false) =>
  `flex h-11 flex-shrink-0 items-center rounded-full px-4 text-sm font-semibold tabular-nums transition ${
    active
      ? 'bg-ink text-white'
      : disabled
        ? 'cursor-not-allowed bg-paper text-ink-soft/60 ring-1 ring-line'
        : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
  }`;

type Filters = { type: CymbalType; timbre: TimbreId | null; size: number | null; sort: SortKey };

function PratosContent() {
  const products = useProductsStore(state => state.products);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filtros vêm da URL: voltar, recarregar ou compartilhar mantém a seleção
  const [filters, setFilters] = useState<Filters>(() => {
    const tipo = searchParams.get('tipo');
    const tamanho = Number(searchParams.get('tamanho'));
    const ordem = searchParams.get('ordem');
    return {
      type: (TYPES as readonly string[]).includes(tipo ?? '') ? (tipo as CymbalType) : 'todos',
      timbre: TIMBRES.find(t => t.id === searchParams.get('timbre'))?.id ?? null,
      size: Number.isFinite(tamanho) && tamanho > 0 ? tamanho : null,
      sort: SORTS.find(o => o.id === ordem)?.id ?? 'relevancia',
    };
  });
  const [panelOpen, setPanelOpen] = useState(false);

  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    const qs = new URLSearchParams();
    if (next.type !== 'todos') qs.set('tipo', next.type);
    if (next.timbre) qs.set('timbre', next.timbre);
    if (next.size !== null) qs.set('tamanho', String(next.size));
    if (next.sort !== 'relevancia') qs.set('ordem', next.sort);
    const query = qs.toString();
    router.replace(query ? `/pratos?${query}` : '/pratos', { scroll: false });
  };

  const allPratos = products.filter(p => p.category === 'pratos');
  const matches = (p: Product, f: Pick<Filters, 'type' | 'timbre' | 'size'>) =>
    (f.type === 'todos' || getCymbalType(p.name) === f.type) &&
    (!f.timbre || productTimbres(p.name).includes(f.timbre)) &&
    (f.size === null || productSizeValue(p.name) === f.size);

  const filtered = allPratos.filter(p => matches(p, filters));

  // Cada contagem já considera os outros filtros escolhidos: o número no chip é o resultado do clique,
  // e um chip que daria 0 fica desativado (sem becos sem saída)
  const countType = (type: CymbalType) => allPratos.filter(p => matches(p, { ...filters, type })).length;
  const countTimbre = (timbre: TimbreId) => allPratos.filter(p => matches(p, { ...filters, timbre })).length;
  const countSize = (size: number) => allPratos.filter(p => matches(p, { ...filters, size })).length;

  const sizes = [...new Set(allPratos.map(p => productSizeValue(p.name)).filter((v): v is number => v !== null))].sort((a, b) => a - b);
  const extraCount = (filters.timbre ? 1 : 0) + (filters.size !== null ? 1 : 0);

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="pratos" />

      <section className="category-hero category-hero--photo" style={{ '--hero-img': "url('/fotos/banner-pratos.jpg')" } as React.CSSProperties}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="category-hero__title">Pratos</h1>
          <p className="category-hero__lead">
            Istanbul Agop: artesanato turco feito à mão há gerações. Escolha pelo tipo ou pelo som.
          </p>
        </div>
      </section>

      {/* Só o tipo fica fixo no topo; som e tamanho ficam no painel logo abaixo */}
      <div className="sticky top-[108px] z-40 border-b border-line bg-white md:top-[124px]">
        <div className="container mx-auto flex items-center gap-2 px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-2.5 scrollbar-hide" role="group" aria-label="Filtrar por tipo">
            <button type="button" onClick={() => update({ type: 'todos' })} aria-pressed={filters.type === 'todos'} className={chip(filters.type === 'todos')}>
              Todos ({countType('todos')})
            </button>
            {TYPES.map(type => {
              if (!allPratos.some(p => getCymbalType(p.name) === type)) return null;
              const count = countType(type);
              const active = filters.type === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => update({ type })}
                  disabled={!active && count === 0}
                  aria-pressed={active}
                  className={chip(active, count === 0)}
                >
                  {TYPE_LABELS[type]} ({count})
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setPanelOpen(o => !o)}
            aria-expanded={panelOpen}
            aria-controls="painel-filtros"
            className="flex h-11 flex-shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-semibold text-ink ring-1 ring-line md:hidden"
          >
            <SlidersHorizontal size={16} aria-hidden /> Filtrar{extraCount > 0 && ` (${extraCount})`}
          </button>
        </div>
      </div>

      <div id="painel-filtros" className={`border-b border-line bg-white ${panelOpen ? 'block' : 'hidden'} md:block`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-1 py-3 md:flex-row md:items-center md:gap-2 md:py-2.5" role="group" aria-label="Filtrar por som">
            <span className="flex-shrink-0 pr-1 text-xs font-bold uppercase tracking-wider text-ink-soft">Som</span>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:px-0 md:pb-0">
              {TIMBRES.map(t => {
                if (!allPratos.some(p => productTimbres(p.name).includes(t.id))) return null;
                const count = countTimbre(t.id);
                const active = filters.timbre === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => update({ timbre: active ? null : t.id })}
                    disabled={!active && count === 0}
                    aria-pressed={active}
                    title={`${t.label}: ${t.hint}`}
                    className={chip(active, count === 0)}
                  >
                    {t.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
          {/* No celular a dica de cada som aparece escrita (o title só funciona com mouse) */}
          {filters.timbre && (
            <p className="pb-2 text-sm text-ink-soft md:hidden">
              <strong className="text-ink">{TIMBRES.find(t => t.id === filters.timbre)!.label}:</strong> {TIMBRES.find(t => t.id === filters.timbre)!.hint}
            </p>
          )}
          {sizes.length >= 3 && (
            <div className="flex flex-col gap-1 border-t border-line py-3 md:flex-row md:items-center md:gap-2 md:py-2.5" role="group" aria-label="Filtrar por tamanho">
              <span className="flex-shrink-0 pr-1 text-xs font-bold uppercase tracking-wider text-ink-soft">Tamanho</span>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:px-0 md:pb-0">
                {sizes.map(v => {
                  const count = countSize(v);
                  const active = filters.size === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => update({ size: active ? null : v })}
                      disabled={!active && count === 0}
                      aria-pressed={active}
                      aria-label={`${String(v).replace('.', ',')} polegadas (${count})`}
                      className={chip(active, count === 0)}
                    >
                      {String(v).replace('.', ',')}&quot;
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <CatalogGrid
        products={filtered}
        categoryName="Pratos"
        totalInCategory={allPratos.length}
        onClearFilters={() => update({ type: 'todos', timbre: null, size: null })}
        typeLabel={p => TYPE_LABELS[getCymbalType(p.name)]}
        tags={p => productTimbres(p.name).map(id => TIMBRES.find(t => t.id === id)!.label)}
        noun={['prato', 'pratos']}
        sort={filters.sort}
        onSortChange={sort => update({ sort })}
        size={filters.size}
        onSizeChange={size => update({ size })}
        showSizeFilter={false}
      />

      <p className="container mx-auto px-4 pb-12 text-center text-sm text-ink-soft">
        Em dúvida entre dois pratos?{' '}
        <a href={`${contactInfo.whatsapp}?text=${encodeURIComponent('Olá! Estou em dúvida sobre o som de um prato.')}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-secondary hover:underline">
          Pergunte pra gente pelo WhatsApp
        </a>
      </p>
    </div>
  );
}

export default function PratosPage() {
  return (
    <Suspense>
      <PratosContent />
    </Suspense>
  );
}
