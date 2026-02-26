'use client';

import { products, formatPrice } from '@/lib/products';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function BaquetasPage() {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const categoryProducts = products.filter(p => p.category === 'baquetas');

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
      {/* Sidebar */}

      {/* Header com busca */}
      <Header showBackButton={true} />

      {/* Menu de Categorias */}
      <CategoryNav currentCategory="baquetas" />

      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Baquetas Profissionais</h1>
          <p className="text-xl text-gray-300">
            Baquetas profissionais das melhores marcas
          </p>
        </div>
      </section>

      {/* Todos as Baquetas */}
      <section id="todas-baquetas" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase">Categoria</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Todas as Baquetas
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore nossa seleção completa de baquetas profissionais
            </p>
          </div>
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
                    <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">
                      {product.category}
                    </p>
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

      {/* Wincent - Baquetas */}
      <section id="wincent" className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <img 
            src="/vintage-drumshop/banner/wincent-bg.jpg" 
            alt="Wincent Background"
            className="w-full h-full object-cover"
          />
          {/* Overlay escuro para legibilidade */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase drop-shadow-md">Marca Oficial</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4 drop-shadow-lg">
              Baquetas Wincent
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto drop-shadow-md">
              Baquetas profissionais suecas com madeira de primeira qualidade. Durabilidade e equilíbrio perfeito.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.filter(p => p.category === 'baquetas' && p.brand === 'wincent').map(product => (
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
                  <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">
                    Wincent
                  </p>
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

      {/* Dynabeat - Baquetas */}
      <section id="dynabeat" className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <img 
            src="/vintage-drumshop/banner/dynabeat-bg.jpg" 
            alt="Background Dynabeat"
            className="w-full h-full object-cover"
          />
          {/* Overlay escuro para legibilidade */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase drop-shadow-md">Marca Nacional</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4 drop-shadow-lg">
              Baquetas Dynabeat
            </h2>
            <p className="text-white text-lg max-w-2xl mx-auto drop-shadow-md">
              Baquetas brasileiras de alta qualidade com excelente custo-benefício
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.filter(p => p.category === 'baquetas' && p.brand === 'dynabeat').map(product => (
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
                  <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">
                    Dynabeat
                  </p>
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

      {/* Vassourinhas (Brushes) */}
      <section id="vassourinhas" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase">Acessórios</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Vassourinhas Profissionais
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Brushes Wincent com cerdas retráteis para sons suaves e dinâmicos
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.filter(p => p.category === 'baquetas' && p.name.toLowerCase().includes('brush')).map(product => (
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
                  <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">
                    Wincent
                  </p>
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

      {/* Mallets */}
      <section id="mallets" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase">Acessórios</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Mallets Profissionais
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Mallets Wincent com cabeças macias para sons suaves e expressivos
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {products.filter(p => p.category === 'baquetas' && p.name.toLowerCase().includes('mallet')).map(product => (
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
                  <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">
                    Wincent
                  </p>
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
