'use client';

import { products, formatPrice } from '@/lib/products';
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BuscaContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addToCart, toggleFavorite, favorites } = useCart();

  // Buscar produtos
  const searchResults = query.length >= 2 
    ? products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand?.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

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
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton={true} />
      <CategoryNav currentCategory="" />

      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search size={48} />
            <h1 className="text-4xl md:text-5xl font-bold">Resultados da Busca</h1>
          </div>
          {query && (
            <p className="text-xl text-gray-300">
              Buscando por: <span className="font-bold text-accent">"{query}"</span>
            </p>
          )}
        </div>
      </section>

      {/* Resultados */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {!query || query.length < 2 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <Search size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Digite algo para buscar
                </h2>
                <p className="text-gray-600 mb-8">
                  Use a barra de busca acima para encontrar produtos
                </p>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Nenhum resultado encontrado
                </h2>
                <p className="text-gray-600 mb-4">
                  Não encontramos produtos para <strong>"{query}"</strong>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Tente buscar por:
                  <br />• Nome do produto (ex: "brushes", "5A")
                  <br />• Marca (ex: "wincent", "dynabeat")
                  <br />• Categoria (ex: "baquetas", "pratos")
                </p>
                <Link
                  href="/"
                  className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition"
                >
                  Ver Todos os Produtos
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {searchResults.length} {searchResults.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </h2>
                <p className="text-gray-600">
                  Mostrando resultados para "{query}"
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                    <Link href={`/produto/${product.id}`} className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden block cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-48 w-auto object-contain group-hover:scale-110 transition"
                      />
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(product.id);
                        }}
                        className={`absolute top-4 left-4 p-3 rounded-full transition shadow-lg ${
                          favorites.includes(product.id)
                            ? 'bg-accent text-white'
                            : 'bg-white text-gray-400 hover:text-accent'
                        }`}
                      >
                        <Heart size={18} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                      </button>
                    </Link>
                    <div className="p-6">
                      <p className="text-xs text-accent uppercase font-bold tracking-wider mb-2">{product.brand || product.category}</p>
                      <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold text-accent">{formatPrice(product.price)}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/produto/${product.id}`}
                          className="w-full border-2 border-accent text-accent py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition text-center block"
                        >
                          Ver Produto
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-secondary transition shadow-md"
                        >
                          Adicionar ao Carrinho
                        </button>
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

export default function BuscaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BuscaContent />
    </Suspense>
  );
}
