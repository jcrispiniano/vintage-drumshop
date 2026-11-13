'use client';
import { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

import { useProductsStore } from '@/lib/productsStore';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import CatalogGrid from '@/components/CatalogGrid';

type StickType = 'todos' | 'baquetas' | 'vassourinhas' | 'rods' | 'mallets';
type BrandFilter = 'todas' | 'wincent' | 'dynabeat';

function getStickType(name: string): Exclude<StickType, 'todos'> {
  const n = name.toLowerCase();
  if (n.includes('brush')) return 'vassourinhas';
  if (n.includes('rod') || n.includes('rods')) return 'rods';
  if (n.includes('mallet') || n.includes('mallets')) return 'mallets';
  return 'baquetas';
}

function getBrandLabel(brand: string) {
  if (brand === 'wincent') return 'Wincent';
  if (brand === 'dynabeat') return 'Dynabeat';
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

const chip = (active: boolean) =>
  `flex h-11 flex-shrink-0 items-center rounded-full px-4 text-sm font-semibold tabular-nums transition ${
    active ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
  }`;

const TYPE_LABELS: Record<StickType, string> = {
  todos: 'Todos',
  baquetas: 'Baquetas',
  vassourinhas: 'Vassourinhas',
  rods: 'Rods',
  mallets: 'Mallets',
};

export default function BaquetasPage() {
  const products = useProductsStore(state => state.products);
  const [activeType, setActiveType] = useState<StickType>('todos');
  const [activeBrand, setActiveBrand] = useState<BrandFilter>('todas');
  const [panelOpen, setPanelOpen] = useState(false);

  const allBaquetas = products.filter(p => p.category === 'baquetas');
  const availableBrands = [...new Set(allBaquetas.map(p => p.brand))] as BrandFilter[];

  const filtered = allBaquetas.filter(p => {
    const typeMatch = activeType === 'todos' || getStickType(p.name) === activeType;
    const brandMatch = activeBrand === 'todas' || p.brand === activeBrand;
    return typeMatch && brandMatch;
  });

  const countByType = (type: Exclude<StickType, 'todos'>) =>
    allBaquetas.filter(p =>
      getStickType(p.name) === type &&
      (activeBrand === 'todas' || p.brand === activeBrand)
    ).length;

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="baquetas" />

      {/* Hero */}
      <section className="category-hero category-hero--photo" style={{ '--hero-img': "url('/fotos/banner-baquetas.jpg')" } as React.CSSProperties}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="category-hero__title">Baquetas Wincent e Dynabeat</h1>
          <p className="category-hero__lead">
            Wincent · Dynabeat — qualidade e precisão para cada estilo
          </p>
        </div>
      </section>

      {/* Uma linha só, fixa no topo: o tipo. A marca abre num painel, como em /pratos */}
      <div className="sticky top-[108px] z-40 border-b border-line bg-white md:top-[124px]">
        <div className="container mx-auto flex items-center gap-2 px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-2.5 scrollbar-hide" role="group" aria-label="Filtrar por tipo">
            {(['todos', 'baquetas', 'vassourinhas', 'rods', 'mallets'] as const).map(type => {
              const count = type === 'todos'
                ? allBaquetas.filter(p => activeBrand === 'todas' || p.brand === activeBrand).length
                : countByType(type);
              if (type !== 'todos' && count === 0) return null;
              return (
                <button key={type} type="button" onClick={() => setActiveType(type)} aria-pressed={activeType === type} className={chip(activeType === type)}>
                  {TYPE_LABELS[type]} ({count})
                </button>
              );
            })}
          </div>
          {availableBrands.length > 1 && (
            <button
              type="button"
              onClick={() => setPanelOpen(o => !o)}
              aria-expanded={panelOpen}
              aria-controls="painel-filtros"
              className={`flex h-11 flex-shrink-0 items-center gap-1.5 rounded-md px-3 text-sm font-semibold ring-1 transition ${
                panelOpen || activeBrand !== 'todas' ? 'bg-ink text-white ring-ink' : 'text-ink ring-line hover:ring-ink/40'
              }`}
            >
              <SlidersHorizontal size={16} aria-hidden />
              Marca{activeBrand !== 'todas' && ' (1)'}
              <ChevronDown size={16} aria-hidden className={`transition-transform ${panelOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Com o painel fechado, a marca escolhida continua visível (e removível) */}
      {!panelOpen && activeBrand !== 'todas' && (
        <div className="border-b border-line bg-white">
          <div className="container mx-auto flex flex-wrap items-center gap-2 px-4 py-2">
            <button type="button" onClick={() => setActiveBrand('todas')} className="flex h-9 items-center gap-1 rounded-full bg-paper px-3 text-sm font-semibold text-ink ring-1 ring-line hover:ring-ink/40">
              {getBrandLabel(activeBrand)} <X size={14} aria-hidden /><span className="sr-only">remover</span>
            </button>
          </div>
        </div>
      )}

      {availableBrands.length > 1 && (
        <div id="painel-filtros" className={`border-b border-line bg-white ${panelOpen ? 'block' : 'hidden'}`}>
          <div className="container mx-auto flex flex-col gap-1 px-4 py-3 md:flex-row md:items-center md:gap-2 md:py-2.5" role="group" aria-label="Filtrar por marca">
            <span className="flex-shrink-0 pr-1 text-xs font-bold uppercase tracking-wider text-ink-soft">Marca</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setActiveBrand('todas')} aria-pressed={activeBrand === 'todas'} className={chip(activeBrand === 'todas')}>
                Todas
              </button>
              {availableBrands.map(brand => (
                <button key={brand} type="button" onClick={() => setActiveBrand(activeBrand === brand ? 'todas' : brand)} aria-pressed={activeBrand === brand} className={chip(activeBrand === brand)}>
                  {getBrandLabel(brand)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid de produtos */}
      <CatalogGrid
        products={filtered}
        categoryName="Baquetas"
        totalInCategory={allBaquetas.length}
        onClearFilters={() => { setActiveType('todos'); setActiveBrand('todas'); }}
        typeLabel={p => TYPE_LABELS[getStickType(p.name)]}
      />
    </div>
  );
}
