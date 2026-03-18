'use client';
import { useState } from 'react';

import { products } from '@/lib/products';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';

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
    <div className="min-h-screen bg-orange-50">
      <Header />
      <CategoryNav currentCategory="baquetas" />

      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Baquetas Profissionais</h1>
          <p className="text-xl text-gray-300">
            Wincent · Dynabeat — qualidade e precisão para cada estilo
          </p>
        </div>
      </section>

      {/* Filtros — sticky */}
      <div className="bg-white border-b border-gray-200 sticky top-[104px] md:top-[132px] z-40">
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
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {TYPE_LABELS[type]} ({count})
                </button>
              );
            })}
          </div>

          {/* Linha 2: Marca — só aparece se há mais de uma marca */}
          {availableBrands.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <span className="flex-shrink-0 text-xs text-gray-400 self-center pr-1">Marca:</span>
              <button
                onClick={() => setActiveBrand('todas')}
                className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition ${
                  activeBrand === 'todas'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition ${
                    activeBrand === brand
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🥁</div>
              <p className="text-gray-500 text-lg">Nenhum produto com esses filtros no momento.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">
                {filtered.length} {filtered.length === 1 ? 'produto' : 'produtos'} encontrados
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filtered.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    typeLabel={TYPE_LABELS[getStickType(product.name)]}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
