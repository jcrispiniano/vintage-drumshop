'use client';
import { useState } from 'react';

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
          <h1 className="category-hero__title">Baquetas</h1>
          <p className="category-hero__lead">
            Wincent · Dynabeat — qualidade e precisão para cada estilo
          </p>
        </div>
      </section>

      {/* Filtros — sticky */}
      <div className="bg-white border-b border-line sticky top-[108px] md:top-[124px] z-40">
        <div className="container mx-auto px-4 py-3 space-y-2">
          {/* Linha 1: Tipo */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {(['todos', 'baquetas', 'vassourinhas', 'rods', 'mallets'] as const).map(type => {
              const count = type === 'todos'
                ? allBaquetas.filter(p => activeBrand === 'todas' || p.brand === activeBrand).length
                : countByType(type);
              if (type !== 'todos' && count === 0) return null;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    activeType === type
                      ? 'bg-ink text-white'
                      : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
                  }`}
                >
                  {TYPE_LABELS[type]} ({count})
                </button>
              );
            })}
          </div>

          {/* Linha 2: Marca — só aparece se há mais de uma marca */}
          {availableBrands.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto border-t border-line py-2.5 scrollbar-hide" role="group" aria-label="Filtrar por marca">
              <span className="flex-shrink-0 pr-1 text-xs font-bold uppercase tracking-wider text-ink-soft">Marca</span>
              <button
                onClick={() => setActiveBrand('todas')}
                className={`flex h-11 flex-shrink-0 items-center px-4 rounded-full text-sm font-semibold transition ${
                  activeBrand === 'todas'
                    ? 'bg-ink text-white'
                    : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
                }`}
              >
                Todas
              </button>
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`flex h-11 flex-shrink-0 items-center px-4 rounded-full text-sm font-semibold transition ${
                    activeBrand === brand
                      ? 'bg-ink text-white'
                      : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
                  }`}
                >
                  {getBrandLabel(brand)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

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
