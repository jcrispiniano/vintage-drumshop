'use client';
import { useState } from 'react';

import { products, formatPrice } from '@/lib/products';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

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
  const { addToCart, toggleFavorite, favorites } = useCart();
  const [filtro, setFiltro] = useState<SerieFilter>('todas');

  const allCaixas = products.filter(p => p.category === 'caixas');
  const categoryProducts = filtro === 'todas'
    ? allCaixas
    : allCaixas.filter(p => getCaixaSerie(p.name) === filtro);

  const countBySerie = (serie: Exclude<SerieFilter, 'todas'>) =>
    allCaixas.filter(p => getCaixaSerie(p.name) === serie).length;

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        description: product.description,
      });
      alert('✅ Produto adicionado ao carrinho!');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      <Header />
      <CategoryNav currentCategory="caixas" />

      {/* Hero */}
      <section className="relative text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/banner/caixas-hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Caixas Profissionais</h1>
          <p className="text-xl text-gray-200">
            Pinguim — fabricação nacional de alto desempenho
          </p>
        </div>
      </section>

      {/* Filtros por série — sticky */}
      <div className="bg-white border-b border-gray-200 sticky top-[104px] md:top-[132px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setFiltro('todas')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${
                filtro === 'todas'
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition ${
                    filtro === serie
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {categoryProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">🥁</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Sem disponibilidade no momento
                </h2>
                <p className="text-gray-600 mb-8">
                  Estamos atualizando nosso estoque. Em breve teremos novidades!
                </p>
                <Link href="/" className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition">
                  Voltar para Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'produto' : 'produtos'} encontrados
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {categoryProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                  >
                    <Link href={`/produto/${product.id}`} className="relative h-52 md:h-64 bg-white flex items-center justify-center overflow-hidden block cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                      />
                      {product.badge && (
                        <span className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          {product.badge}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                        className={`absolute top-3 left-3 p-2 rounded-full transition shadow-lg ${
                          favorites.includes(product.id) ? 'bg-accent text-white' : 'bg-white text-gray-400 hover:text-accent'
                        }`}
                      >
                        <Heart size={16} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                      </button>
                    </Link>
                    <div className="p-4 md:p-5">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-accent uppercase font-bold tracking-wider">Pinguim</p>
                        <span className="text-xs text-gray-400">·</span>
                        <p className="text-xs text-gray-400">{SERIE_LABELS[getCaixaSerie(product.name)]}</p>
                      </div>
                      <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 text-gray-900 group-hover:text-accent transition leading-tight">
                        {product.name}
                      </h3>
                      <div className="mb-3">
                        {product.oldPrice && (
                          <data value={product.oldPrice} className="text-xs text-gray-400 line-through block">
                            {formatPrice(product.oldPrice)}
                          </data>
                        )}
                        <data value={product.price} className="text-2xl md:text-3xl font-bold text-accent">
                          {formatPrice(product.price)}
                        </data>
                        <p className="text-xs text-gray-500">
                          até 3x de {formatPrice(product.price / 3)} sem juros
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="w-full bg-accent text-white py-2.5 md:py-3 rounded-lg font-bold hover:bg-secondary transition shadow-md text-sm"
                        >
                          Adicionar ao Carrinho
                        </button>
                        <Link
                          href={`/produto/${product.id}`}
                          className="w-full border-2 border-accent text-accent py-2.5 md:py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition text-center block text-sm"
                        >
                          Ver Produto
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
