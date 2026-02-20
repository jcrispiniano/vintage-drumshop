'use client';

import { products, formatPrice, categories, contactInfo } from '@/lib/products';
import { ShoppingCart, Heart, Search, Menu, Instagram, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import InstagramFeed from '@/components/InstagramFeed';

const bannerImages = [
  '/vintage-drumshop/banner/slide-1.jpg',
  '/vintage-drumshop/banner/slide-2.jpg',
  '/vintage-drumshop/banner/slide-3.jpg',
  '/vintage-drumshop/banner/slide-4.jpg',
  '/vintage-drumshop/banner/slide-5.jpg',
  '/vintage-drumshop/banner/slide-6.jpg',
  '/vintage-drumshop/banner/slide-7.jpg',
  '/vintage-drumshop/banner/slide-8.jpg',
  '/vintage-drumshop/banner/slide-9.jpg',
];

export default function Home() {
  const { cartItems, favorites, addToCart, toggleFavorite } = useCart();
  const featuredProducts = products.filter(p => p.featured);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-white">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Categorias</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-secondary rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Categorias */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="py-2">
              <li>
                <a 
                  href="#produtos"
                  onClick={() => setIsSidebarOpen(false)}
                  className="block px-6 py-3 hover:bg-lightBg transition border-b border-gray-100 font-bold text-primary"
                >
                  Todos os Produtos
                </a>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <a 
                    href={`#${cat.id}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block px-6 py-3 hover:bg-lightBg transition border-b border-gray-100"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer da Sidebar */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600 text-center">
              {contactInfo.phoneFormatted}
            </p>
            <p className="text-xs text-gray-600 text-center">
              {contactInfo.email}
            </p>
          </div>
        </div>
      </aside>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        {/* Top Bar */}
        <div className="bg-darkBg text-white py-2">
          <div className="container mx-auto px-4 flex justify-between text-sm">
            <div className="space-x-4">
              <span>{contactInfo.phoneFormatted}</span>
              <span>{contactInfo.email}</span>
              <span>{contactInfo.instagramHandle}</span>
            </div>
            <div className="space-x-4">
              <a href="#" className="hover:text-accent">Entrar</a>
              <a href="#" className="hover:text-accent">Cadastrar</a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-lightBg py-2">
          <div className="container mx-auto px-4 flex items-center justify-between gap-4">
            {/* Menu Hamburguer (mobile only) */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition"
              aria-label="Abrir menu"
            >
              <Menu size={24} className="text-primary" />
            </button>

            <Link href="/" className="flex-shrink-0 flex items-center justify-center w-36 md:w-44 cursor-pointer">
              <img 
                src="/vintage-drumshop/logo-small.png" 
                alt="Vintage Drum Shop" 
                className="h-24 md:h-32 w-auto object-contain hover:opacity-80 transition"
              />
            </Link>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="w-full px-3 py-2 text-sm md:text-base rounded-full border-2 border-gray-300 focus:border-accent outline-none"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>

            <div className="flex gap-2 md:gap-4">
              <a 
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex flex-col items-center hover:text-accent"
              >
                <Instagram size={24} />
                <span className="text-xs">Instagram</span>
              </a>
              <Link href="/favoritos" className="relative flex flex-col items-center hover:text-accent">
                <Heart size={20} className="md:w-6 md:h-6" />
                <span className="text-xs hidden md:inline">Favoritos</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link href="/carrinho" className="relative flex flex-col items-center hover:text-accent">
                <ShoppingCart size={20} className="md:w-6 md:h-6" />
                <span className="text-xs hidden md:inline">Carrinho</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop Only */}
        <nav className="bg-primary text-white hidden md:block">
          <div className="container mx-auto px-4">
            <ul className="flex justify-center flex-wrap">
              <li className="relative group">
                <a 
                  href="#produtos"
                  className="block px-4 py-3 hover:bg-secondary transition font-bold"
                >
                  Todos os Produtos
                </a>
                {/* Dropdown */}
                <div className="absolute left-0 top-full bg-lightBg text-gray-800 shadow-2xl rounded-b-lg border-2 border-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[250px] z-50">
                  <ul className="py-2">
                    {categories.map(cat => (
                      <li key={cat.id}>
                        <a 
                          href={`#${cat.id}`}
                          className="block px-6 py-2 hover:text-primary transition text-sm font-medium"
                        >
                          {cat.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              {/* Apenas categorias principais visíveis */}
              {categories.filter(cat => 
                ['baterias', 'pratos', 'caixas', 'peles', 'baquetas', 'acessorios'].includes(cat.id)
              ).map(cat => {
                // Pratos tem dropdown especial
                if (cat.id === 'pratos') {
                  return (
                    <li key={cat.id} className="relative group">
                      <Link 
                        href="/pratos"
                        className="block px-4 py-3 hover:bg-secondary transition"
                      >
                        {cat.name}
                      </Link>
                      {/* Dropdown de marcas */}
                      <div className="absolute left-0 top-full bg-lightBg text-gray-800 shadow-2xl rounded-b-lg border-2 border-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-50">
                        <ul className="py-2">
                          <li>
                            <Link 
                              href="/pratos#todos-os-pratos"
                              className="block px-6 py-2 hover:text-primary transition text-sm font-medium"
                            >
                              Todos os Pratos
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/pratos#istanbul-agop"
                              className="block px-6 py-2 hover:text-primary transition text-sm font-medium"
                            >
                              Istanbul Agop
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  );
                }
                
                return (
                  <li key={cat.id}>
                    <Link 
                      href={`/${cat.id}`}
                      className="block px-4 py-3 hover:bg-secondary transition"
                    >
                      {cat.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Baterias & Acessórios
                <span className="block text-accent mt-2">Profissionais</span>
              </h2>
              <p className="text-xl text-gray-300">
                Revenda Oficial Wincent e Istanbul Agop
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#produtos" 
                  className="bg-accent px-8 py-4 rounded-lg font-bold text-lg hover:bg-secondary transition shadow-lg"
                >
                  Ver Catálogo
                </a>
                <a 
                  href={contactInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition shadow-lg"
                >
                  Fale Conosco
                </a>
              </div>
            </div>
            <div className="relative h-64 md:h-96 hidden md:block overflow-hidden rounded-3xl shadow-2xl">
              {bannerImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-white border-t border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm">Frete Grátis</p>
                <p className="text-xs text-gray-600">Acima de R$ 199</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm">Até 3x Sem Juros</p>
                <p className="text-xs text-gray-600">No cartão de crédito</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm">5% de Desconto</p>
                <p className="text-xs text-gray-600">No PIX ou Boleto</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm">SAC Especializado</p>
                <p className="text-xs text-gray-600">WhatsApp e Telefone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marcas Oficiais - Destaque */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase">Marcas Oficiais</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Revendedor Autorizado
            </h2>
            <p className="text-lightBg text-lg max-w-2xl mx-auto">
              Trabalhamos apenas com marcas reconhecidas mundialmente pela qualidade e tradição
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-lightBg p-12 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-accent transition group relative">
              <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                OFICIAL
              </span>
              <div className="text-center">
                <div className="h-24 flex items-center justify-center mx-auto mb-6">
                  <img 
                    src="/vintage-drumshop/wincent-logo.png" 
                    alt="Wincent"
                    className="h-full w-auto object-contain group-hover:scale-110 transition"
                  />
                </div>
                <p className="text-accent font-bold text-sm tracking-wide uppercase mb-3">Revenda Autorizada</p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Baquetas profissionais suecas com madeira de primeira qualidade. 
                  Durabilidade e equilíbrio perfeito para todos os estilos musicais.
                </p>
                <button className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition w-full">
                  Ver Baquetas Wincent →
                </button>
              </div>
            </div>
            
            <div className="bg-lightBg p-12 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-accent transition group relative">
              <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                OFICIAL
              </span>
              <div className="text-center">
                <div className="h-40 flex items-center justify-center mx-auto mb-6">
                  <img 
                    src="/vintage-drumshop/istanbul-logo.png" 
                    alt="Istanbul Agop"
                    className="h-full w-auto object-contain group-hover:scale-110 transition"
                  />
                </div>
                <p className="text-accent font-bold text-sm tracking-wide uppercase mb-3">Distribuidor Oficial</p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pratos artesanais turcos feitos à mão há gerações. Som único, 
                  rico em harmônicos e usado pelos maiores bateristas do mundo.
                </p>
                <a href="#istanbul-agop" className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition w-full block text-center">
                  Ver Pratos Istanbul →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <span className="text-accent font-bold text-sm tracking-wider uppercase">Catálogo</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-1">
                Produtos em Destaque
              </h2>
            </div>
            <a href="#" className="hidden md:block text-accent font-bold hover:text-secondary transition">
              Ver Todos os Produtos →
            </a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <Link href={`/produto/${product.id}`} className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden block cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition">
                      {product.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  {product.badge && (
                    <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                      {product.badge}
                    </span>
                  )}
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
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-secondary transition shadow-md hover:shadow-lg"
                    >
                      Adicionar ao Carrinho
                    </button>
                    <Link 
                      href={`/produto/${product.id}`}
                      className="w-full border-2 border-accent text-accent py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition text-center block"
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

      {/* Todos os Pratos */}
      <section id="pratos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase">Categoria</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Pratos
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore nossa seleção completa de pratos profissionais
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(p => p.category === 'pratos').map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <Link href={`/produto/${product.id}`} className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden block cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-auto object-contain group-hover:scale-110 transition"
                  />
                  {product.badge && (
                    <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                      {product.badge}
                    </span>
                  )}
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
                  <p className="text-xs text-accent uppercase font-bold tracking-wider mb-2">
                    {product.brand === 'istanbul' ? 'Istanbul Agop' : product.category}
                  </p>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {product.oldPrice && (
                        <p className="text-gray-400 line-through text-sm">
                          {formatPrice(product.oldPrice)}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-accent">
                        {formatPrice(product.price)}
                      </p>
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
        </div>
      </section>

      {/* Istanbul Agop - Pratos */}
      <section id="istanbul-agop" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase">Marca Oficial</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Pratos Istanbul Agop
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Pratos artesanais turcos feitos à mão há gerações. Som único e autêntico.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(p => p.category === 'pratos' && p.brand === 'istanbul').map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <Link href={`/produto/${product.id}`} className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden block cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-auto object-contain group-hover:scale-110 transition"
                  />
                  {product.badge && (
                    <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                      {product.badge}
                    </span>
                  )}
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
                  <p className="text-xs text-accent uppercase font-bold tracking-wider mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {product.oldPrice && (
                        <p className="text-gray-400 line-through text-sm">
                          {formatPrice(product.oldPrice)}
                        </p>
                      )}
                      <p className="text-2xl font-bold text-accent">
                        {formatPrice(product.price)}
                      </p>
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
        </div>
      </section>

      {/* Instagram */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Siga no Instagram
            </h2>
            <a 
              href={contactInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl text-secondary hover:text-accent transition"
            >
              {contactInfo.instagramHandle}
            </a>
          </div>
          
          {/* Instagram Feed */}
          <InstagramFeed />
          
          <div className="text-center mt-8">
            <a
              href={contactInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition"
            >
              Ver mais no Instagram →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-darkBg text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="/vintage-drumshop/logo-small.png" 
                alt="Vintage Drum Shop" 
                className="h-20 w-auto mb-4"
              />
              <p className="text-sm text-gray-300">
                Revenda oficial Wincent e Istanbul Agop. Qualidade e tradição em instrumentos musicais.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Categorias</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-accent">Baterias</a></li>
                <li><a href="#" className="hover:text-accent">Pratos</a></li>
                <li><a href="#" className="hover:text-accent">Caixas</a></li>
                <li><a href="#" className="hover:text-accent">Baquetas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Atendimento</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-accent">Fale Conosco</a></li>
                <li><a href="#" className="hover:text-accent">Trocas e Devoluções</a></li>
                <li><a href="#" className="hover:text-accent">Política de Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Contato</h4>
              <p className="text-sm space-y-2">
                <span className="block">{contactInfo.phoneFormatted}</span>
                <span className="block">{contactInfo.email}</span>
                <span className="block">{contactInfo.instagramHandle}</span>
                <span className="block">{contactInfo.address}</span>
                <span className="block">{contactInfo.hours}</span>
              </p>
              <div className="flex gap-2 mt-4">
                <a 
                  href={contactInfo.whatsapp} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition text-center"
                >
                  WhatsApp
                </a>
                <a 
                  href={contactInfo.instagram} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition text-center"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Vintage Drum Shop - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}