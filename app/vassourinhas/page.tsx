'use client';
import { useState } from 'react';

import { products, formatPrice } from '@/lib/products';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function VassourinhasPage() {
  const { addToCart, toggleFavorite, favorites } = useCart();
  // Filtrar produtos que são brushes (vassourinhas)
  const brushProducts = products.filter(p => 
    p.category === 'baquetas' && 
    (p.name.toLowerCase().includes('brush') || p.name.toLowerCase().includes('vassoura'))
  );

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

      <Header showBackButton={true} />
      <CategoryNav currentCategory="baquetas" />

      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Vassourinhas Profissionais</h1>
          <p className="text-xl text-gray-300">
            Brushes Wincent com cerdas retráteis para sons suaves e dinâmicos
          </p>
        </div>
      </section>

      {/* Produtos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase">Acessórios</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Brushes Wincent
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Perfeitas para jazz, blues e estilos que exigem sutileza e dinâmica
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {brushProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                <Link href={`/produto/${product.id}`} className="relative h-52 md:h-64 bg-white flex items-center justify-center overflow-hidden block cursor-pointer">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute top-3 left-3 p-2 rounded-full transition shadow-lg ${
                      favorites.includes(product.id)
                        ? 'bg-accent text-white'
                        : 'bg-white text-gray-400 hover:text-accent'
                    }`}
                  >
                    <Heart size={16} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                  </button>
                </Link>
                <div className="p-4 md:p-5">
                  <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">Wincent</p>
                  <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 text-gray-900 group-hover:text-accent transition leading-tight">{product.name}</h3>
                  <div className="mb-3">
                    <data value={product.price} className="text-2xl md:text-3xl font-bold text-accent">
                      {formatPrice(product.price)}
                    </data>
                    <p className="text-xs text-gray-500">NO PIX</p>
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
        </div>
      </section>
    </div>
  );
}
