'use client';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useProductsStore } from '@/lib/productsStore';
import { contactInfo } from '@/lib/products';
import { TIMBRES, TimbreId, productTimbres } from '@/lib/productText';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';

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

const chip = (active: boolean) =>
  `flex h-10 flex-shrink-0 items-center rounded-full px-4 text-sm font-semibold transition ${
    active ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
  }`;

function PratosContent() {
  const products = useProductsStore(state => state.products);
  const searchParams = useSearchParams();
  const initialTimbre = TIMBRES.find(t => t.id === searchParams.get('timbre'))?.id ?? null;

  const [activeType, setActiveType] = useState<CymbalType>('todos');
  const [activeTimbre, setActiveTimbre] = useState<TimbreId | null>(initialTimbre);

  const allPratos = products.filter(p => p.category === 'pratos');
  const filtered = allPratos.filter(p =>
    (activeType === 'todos' || getCymbalType(p.name) === activeType) &&
    (!activeTimbre || productTimbres(p.name).includes(activeTimbre))
  );

  const countByType = (type: Exclude<CymbalType, 'todos'>) =>
    allPratos.filter(p => getCymbalType(p.name) === type).length;
  const countByTimbre = (id: TimbreId) =>
    allPratos.filter(p => productTimbres(p.name).includes(id)).length;

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

      {/* Filtros: tipo e timbre — sticky */}
      <div className="sticky top-[108px] z-40 border-b border-line bg-white md:top-[124px]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-hide" role="group" aria-label="Filtrar por tipo">
            <button type="button" onClick={() => setActiveType('todos')} aria-pressed={activeType === 'todos'} className={chip(activeType === 'todos')}>
              Todos ({allPratos.length})
            </button>
            {(['crash', 'ride', 'hihat', 'effects'] as const).map(type => {
              const count = countByType(type);
              if (count === 0) return null;
              return (
                <button key={type} type="button" onClick={() => setActiveType(type)} aria-pressed={activeType === type} className={chip(activeType === type)}>
                  {TYPE_LABELS[type]} ({count})
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto border-t border-line py-2.5 scrollbar-hide" role="group" aria-label="Filtrar por som">
            <span className="flex-shrink-0 pr-1 text-xs font-bold uppercase tracking-wider text-ink-soft">Som</span>
            {TIMBRES.map(t => {
              const count = countByTimbre(t.id);
              if (count === 0) return null;
              const active = activeTimbre === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTimbre(active ? null : t.id)}
                  aria-pressed={active}
                  className={chip(active)}
                >
                  {t.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <h2 className="mb-2 text-2xl font-semibold uppercase text-ink">Nenhum prato com esse filtro</h2>
              <p className="mb-6 text-ink-soft">Tente outra combinação ou veja todos os pratos.</p>
              <button
                type="button"
                onClick={() => { setActiveType('todos'); setActiveTimbre(null); }}
                className="inline-flex h-11 items-center rounded-md bg-accent px-6 text-sm font-bold uppercase tracking-wide text-white hover:bg-secondary"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <h2 className="mb-6 font-sans text-sm font-normal tracking-normal text-ink-soft">
                {filtered.length} {filtered.length === 1 ? 'prato encontrado' : 'pratos encontrados'}
              </h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    typeLabel={TYPE_LABELS[getCymbalType(product.name)]}
                  />
                ))}
              </div>
            </>
          )}
          <p className="mt-10 text-center text-sm text-ink-soft">
            Em dúvida entre dois pratos?{' '}
            <a href={`${contactInfo.whatsapp}?text=${encodeURIComponent('Olá! Estou em dúvida sobre o som de um prato.')}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-secondary hover:underline">
              Pergunte pra gente pelo WhatsApp
            </a>
          </p>
        </div>
      </section>
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
