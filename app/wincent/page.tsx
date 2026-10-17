'use client';
import SmartImage from '@/components/SmartImage';
import { useState } from 'react';
import { useProductsStore } from '@/lib/productsStore';
import CatalogGrid from '@/components/CatalogGrid';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

type StickType = 'todos' | 'baquetas' | 'vassourinhas' | 'rods' | 'mallets';

function getStickType(name: string): Exclude<StickType, 'todos'> {
  const n = name.toLowerCase();
  if (n.includes('brush')) return 'vassourinhas';
  if (n.includes('rod') || n.includes('rods')) return 'rods';
  if (n.includes('mallet') || n.includes('mallets')) return 'mallets';
  return 'baquetas';
}

const TYPE_LABELS: Record<StickType, string> = {
  todos: 'Todos',
  baquetas: 'Baquetas',
  vassourinhas: 'Vassourinhas',
  rods: 'Rods',
  mallets: 'Mallets',
};

export default function WincentPage() {
  const products = useProductsStore(state => state.products);
  const [activeType, setActiveType] = useState<StickType>('todos');

  const allProducts = products.filter(p => p.brand === 'wincent' && p.category === 'baquetas');
  const filtered = activeType === 'todos'
    ? allProducts
    : allProducts.filter(p => getStickType(p.name) === activeType);

  const countByType = (type: Exclude<StickType, 'todos'>) =>
    allProducts.filter(p => getStickType(p.name) === type).length;

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="baquetas" />

      {/* Hero com imagem de fundo */}
      <section className="relative overflow-hidden border-b-[3px] border-brass bg-ink py-14 text-white md:py-20">
        <div className="absolute inset-0">
          <SmartImage src="/fotos/hero-wincent.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[rgba(28,17,10,0.5)]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="category-hero__title drop-shadow-lg">Wincent</h1>
          <p className="text-xl text-white drop-shadow-md">Baquetas profissionais suecas com madeira de primeira qualidade</p>
        </div>
      </section>

      {/* Filtros por tipo */}
      <div className="bg-white border-b border-line sticky top-[108px] md:top-[124px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-2.5 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveType('todos')}
              className={`flex h-11 flex-shrink-0 items-center px-4 rounded-full text-sm font-semibold transition ${activeType === 'todos' ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}
            >
              Todos ({allProducts.length})
            </button>
            {(['baquetas', 'vassourinhas', 'rods', 'mallets'] as const).map(type => {
              const count = countByType(type);
              if (count === 0) return null;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`flex h-11 flex-shrink-0 items-center px-4 rounded-full text-sm font-semibold transition ${activeType === type ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-ink/40'}`}
                >
                  {TYPE_LABELS[type]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Produtos */}
      <CatalogGrid
        products={filtered}
        categoryName="Baquetas Wincent"
        totalInCategory={allProducts.length}
        onClearFilters={() => setActiveType('todos')}
        typeLabel={p => TYPE_LABELS[getStickType(p.name)]}
      />

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher Wincent?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-4xl mb-4">🇸🇪</div>
              <h3 className="text-xl font-bold mb-2">Origem Sueca</h3>
              <p className="text-red-100">Tradição e qualidade escandinava</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-bold mb-2">Madeira Premium</h3>
              <p className="text-red-100">Hickory americano cuidadosamente selecionado</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Linha Completa</h3>
              <p className="text-red-100">Modelos para todos os estilos musicais</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
