'use client';
import { useState } from 'react';

import { useProductsStore } from '@/lib/productsStore';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import CatalogGrid from '@/components/CatalogGrid';

type SerieFilter = 'todas' | 'real' | 'ice' | 'imperador' | 'pollar';

function getCaixaSerie(name: string): Exclude<SerieFilter, 'todas'> {
  const n = name.toLowerCase();
  if (n.includes('ice')) return 'ice';
  if (n.includes('imperador')) return 'imperador';
  if (n.includes('pollar')) return 'pollar';
  return 'real';
}

const SERIE_LABELS: Record<SerieFilter, string> = {
  todas: 'Todas',
  real: 'Série Real',
  ice: 'Série Ice',
  imperador: 'Série Imperador',
  pollar: 'Série Pollar',
};

export default function CaixasPage() {
  const products = useProductsStore(state => state.products);
  const [filtro, setFiltro] = useState<SerieFilter>('todas');

  const allCaixas = products.filter(p => p.category === 'caixas');
  const categoryProducts = filtro === 'todas'
    ? allCaixas
    : allCaixas.filter(p => getCaixaSerie(p.name) === filtro);

  const countBySerie = (serie: Exclude<SerieFilter, 'todas'>) =>
    allCaixas.filter(p => getCaixaSerie(p.name) === serie).length;

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="caixas" />

      {/* Hero */}
      <section className="relative overflow-hidden border-b-[3px] border-brass py-14 text-white md:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/fotos/banner-caixas.jpg')" }}
        />
        <div className="absolute inset-0 bg-[rgba(28,17,10,0.55)]" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="category-hero__title">Caixas</h1>
          <p className="category-hero__lead">
            Pinguim — fabricação nacional de alto desempenho
          </p>
        </div>
      </section>

      {/* Filtros por série — sticky */}
      <div className="bg-white border-b border-line sticky top-[108px] md:top-[124px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-2.5 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setFiltro('todas')}
              className={`flex h-11 flex-shrink-0 items-center px-4 rounded-full text-sm font-semibold transition ${
                filtro === 'todas'
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
              }`}
            >
              Todas ({allCaixas.length})
            </button>
            {(['real', 'ice', 'imperador', 'pollar'] as const).map(serie => {
              const count = countBySerie(serie);
              if (count === 0) return null;
              return (
                <button
                  key={serie}
                  onClick={() => setFiltro(serie)}
                  className={`flex h-11 flex-shrink-0 items-center px-4 rounded-full text-sm font-semibold transition ${
                    filtro === serie
                      ? 'bg-ink text-white'
                      : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
                  }`}
                >
                  {SERIE_LABELS[serie]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Produtos */}
      <CatalogGrid
        products={categoryProducts}
        categoryName="Caixas"
        totalInCategory={allCaixas.length}
        onClearFilters={() => setFiltro('todas')}
        typeLabel={p => SERIE_LABELS[getCaixaSerie(p.name)]}
      />
    </div>
  );
}
