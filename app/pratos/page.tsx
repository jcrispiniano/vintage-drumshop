'use client';
import { useState } from 'react';

import { useProductsStore } from '@/lib/productsStore';
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
  effects: 'Effects / Stacks',
};

export default function PratosPage() {
  const products = useProductsStore(state => state.products);
  const [activeType, setActiveType] = useState<CymbalType>('todos');

  const allPratos = products.filter(p => p.category === 'pratos');

  const filtered = activeType === 'todos'
    ? allPratos
    : allPratos.filter(p => getCymbalType(p.name) === activeType);

  const countByType = (type: Exclude<CymbalType, 'todos'>) =>
    allPratos.filter(p => getCymbalType(p.name) === type).length;

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="pratos" />

      {/* Hero */}
      <section className="category-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="category-hero__title">Pratos Profissionais</h1>
          <p className="category-hero__lead">
            Istanbul Agop — artesanato turco feito à mão há gerações
          </p>
        </div>
      </section>

      {/* Filtros por tipo — sticky */}
      <div className="bg-white border-b border-gray-200 sticky top-[108px] md:top-[124px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveType('todos')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeType === 'todos'
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
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
                      ? 'bg-ink text-white'
                      : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'
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
      <section className="py-10 md:py-12">
        <div className="container mx-auto px-4">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
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
