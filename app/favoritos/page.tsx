'use client';

import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  category: string;
  description: string;
  badge?: string;
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (id: number) => {
    alert('✅ Produto adicionado ao carrinho!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-accent transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Meus Favoritos</h1>
            {favorites.length > 0 && (
              <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-bold">
                {favorites.length}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          /* Estado Vazio */
          <div className="max-w-md mx-auto text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full">
                  <Heart size={64} className="text-gray-300" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Você não tem itens favoritos no momento
              </h2>
              <p className="text-gray-600 mb-8">
                Explore nosso catálogo e adicione produtos aos seus favoritos
              </p>
              <Link
                href="/"
                className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition"
              >
                Ver Produtos
              </Link>
            </div>
          </div>
        ) : (
          /* Estado com Itens */
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {favorites.length} {favorites.length === 1 ? 'produto favorito' : 'produtos favoritos'}
              </h2>
              <p className="text-gray-600 mt-2">
                Produtos que você marcou como favorito
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                >
                  <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                    <div className="text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition">
                      {product.name.substring(0, 2).toUpperCase()}
                    </div>
                    {product.badge && (
                      <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                        {product.badge}
                      </span>
                    )}
                    <button
                      onClick={() => removeFavorite(product.id)}
                      className="absolute top-4 left-4 p-3 bg-accent text-white rounded-full hover:bg-red-600 transition shadow-lg"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-accent uppercase font-bold tracking-wider mb-2">
                      {product.category}
                    </p>
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-accent transition">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mb-4 flex items-baseline gap-2">
                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-accent">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product.id)}
                        className="flex-1 bg-accent text-white py-3 rounded-lg font-bold hover:bg-secondary transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        Adicionar
                      </button>
                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="p-3 border-2 border-red-200 text-red-500 rounded-lg hover:border-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
