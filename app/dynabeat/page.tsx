'use client';
import { useState } from 'react';

import { products, formatPrice } from '@/lib/products';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import Sidebar from '@/components/Sidebar';

export default function DynabeatPage() {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dynabeatProducts = products.filter(p => p.brand === 'dynabeat');

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
      {/* Header com busca */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <Header showBackButton={true} onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Menu de Categorias */}
      <CategoryNav currentCategory="baquetas" />

      {/* Hero com imagem de fundo */}
      <section className="relative bg-gray-900 text-white py-16 overflow-hidden">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <img 
            src="/vintage-drumshop/banner/dynabeat-bg.jpg" 
            alt="Dynabeat Background"
            className="w-full h-full object-cover"
          />
          {/* Overlay escuro para legibilidade */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Dynabeat</h1>
          <p className="text-xl text-white drop-shadow-md">
            Baquetas de alta qualidade com excelente custo-benefício
          </p>
        </div>
      </section>

      {/* Produtos Dynabeat */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase">Linha Econômica</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Todas as Baquetas Dynabeat
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Madeira hickory de qualidade com ótimo custo-benefício. Perfeitas para iniciantes e profissionais.
            </p>
          </div>

          {dynabeatProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">🥁</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Sem disponibilidade no momento
                </h2>
                <p className="text-gray-600 mb-8">
                  Estamos atualizando nosso estoque. Em breve teremos novidades!
                </p>
                <Link
                  href="/"
                  className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition"
                >
                  Voltar para Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {dynabeatProducts.map(product => (
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
                    <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">Dynabeat</p>
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
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher Dynabeat?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Melhor Custo-Benefício</h3>
              <p className="text-amber-100">Qualidade profissional por um preço acessível</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-bold mb-2">Madeira Hickory</h3>
              <p className="text-amber-100">Madeira americana de primeira qualidade</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Durabilidade</h3>
              <p className="text-amber-100">Resistência e performance garantidas</p>
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/baquetas"
              className="inline-block bg-white text-amber-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition shadow-xl"
            >
              Ver Todas as Baquetas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
