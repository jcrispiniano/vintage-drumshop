'use client';
import { useState } from 'react';

import { products } from '@/lib/products';
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

function getBrandLabel(brand: string) {
  if (brand === 'istanbul') return 'Istanbul Agop';
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

const TYPE_LABELS: Record<CymbalType, string> = {
  todos: 'Todos',
  crash: 'Crash',
  ride: 'Ride',
  hihat: 'Hi-Hat',
  effects: 'Effects / Stacks',
};

export default function PratosPage() {
  const [activeType, setActiveType] = useState<CymbalType>('todos');

  const allPratos = products.filter(p => p.category === 'pratos');

  const filtered = activeType === 'todos'
    ? allPratos
    : allPratos.filter(p => getCymbalType(p.name) === activeType);

  const countByType = (type: Exclude<CymbalType, 'todos'>) =>
    allPratos.filter(p => getCymbalType(p.name) === type).length;

  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <CategoryNav currentCategory="pratos" />

      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Pratos Profissionais</h1>
          <p className="text-xl text-gray-300">
            Istanbul Agop — artesanato turco feito à mão há gerações
          </p>
        </div>
      </section>

      {/* Filtros por tipo — sticky */}
      <div className="bg-white border-b border-gray-200 sticky top-[104px] md:top-[132px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveType('todos')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeType === 'todos'
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos ({allPratos.length})
            </button>
            {(['crash', 'ride', 'hihat', 'effects'] as const).map(type => {
              const count = countByType(type);
              if (count === 0) return null;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${
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
        </div>
      </div>

      {/* Grid de produtos */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🥁</div>
              <p className="text-gray-500 text-lg">Nenhum produto nessa categoria no momento.</p>
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
                    typeLabel={TYPE_LABELS[getCymbalType(product.name)]}
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
