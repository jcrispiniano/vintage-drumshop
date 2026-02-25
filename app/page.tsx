'use client';

import { products, formatPrice, categories, contactInfo } from '@/lib/products';
import { ShoppingCart, Heart, Search, Menu, Instagram, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import InstagramFeed from '@/components/InstagramFeed';
import OrganizationSchema from '@/components/schemas/OrganizationSchema';
import CategoryNav from '@/components/CategoryNav';

const bannerSlides = [
  { 
    image: '/vintage-drumshop/banner/slide-1.jpg',
    alt: 'Baquetas Wincent profissionais - Linha completa de modelos 5A, 5B, 7A e mallets'
  },
  { 
    image: '/vintage-drumshop/banner/slide-2.jpg',
    alt: 'Pratos Istanbul Agop Traditional - Crafted in Turkey, sonoridade autêntica'
  },
  { 
    image: '/vintage-drumshop/banner/slide-3.jpg',
    alt: 'Coleção completa de baquetas Wincent - Precision, Jazz e modelos especiais'
  },
  { 
    image: '/vintage-drumshop/banner/slide-4.jpg',
    alt: 'Pratos Istanbul Agop Xist - Modernidade e versatilidade para todos os estilos'
  },
  { 
    image: '/vintage-drumshop/banner/slide-5.jpg',
    alt: 'Vassourinhas e Rods Wincent - Pro Brushes para jazz e estilos dinâmicos'
  },
  { 
    image: '/vintage-drumshop/banner/slide-6.jpg',
    alt: 'Setup completo com pratos Istanbul Agop - Crash, Ride e Hi-Hat profissionais'
  },
  { 
    image: '/vintage-drumshop/banner/slide-7.jpg',
    alt: 'Baquetas Dynabeat - Qualidade e custo-benefício para percussionistas'
  },
  { 
    image: '/vintage-drumshop/banner/slide-8.jpg',
    alt: 'Mallets Wincent - Dual Soft e Swoosh para percussão sinfônica'
  },
  { 
    image: '/vintage-drumshop/banner/slide-9.jpg',
    alt: 'Linha Signature Istanbul Agop - Joey Waronker, Mel Lewis e Special Jazz Edition'
  },
];

export default function Home() {
  const { cartItems, favorites, addToCart, toggleFavorite } = useCart();
  const featuredProducts = products.filter(p => p.featured);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase()) ||
      product.brand?.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filtered.slice(0, 8)); // Limitar a 8 resultados
    setShowSearchResults(true);
  };

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
      {/* Schema Markup */}
      <OrganizationSchema />

      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg"
      >
        Ir para o conteúdo principal
      </a>

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
                  <Link 
                    href={`/${cat.id}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block px-6 py-3 hover:bg-lightBg transition border-b border-gray-100"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer da Sidebar */}
          <div className="p-4 border-t border-gray-200 bg-orange-50">
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
      <header className="sticky top-0 z-[60] bg-white shadow-md">
        {/* Top Bar */}
        <div className="bg-darkBg text-white py-2">
          <div className="container mx-auto px-4 flex justify-between text-sm">
            {/* Desktop: mostra tudo */}
            <div className="hidden md:flex space-x-4">
              <span>{contactInfo.phoneFormatted}</span>
              <span>{contactInfo.email}</span>
              <span>{contactInfo.instagramHandle}</span>
            </div>
            {/* Mobile: esconde infos de contato */}
            <div className="md:hidden flex-1"></div>
            
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

            <div className="flex-1 max-w-md md:max-w-xl relative">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar produtos, marcas..." 
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="w-full px-3 py-2 pr-10 text-sm md:text-base rounded-full border-2 border-gray-300 focus:border-accent outline-none"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={18} />
              </div>

              {/* Dropdown de resultados */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                  {searchResults.map(product => (
                    <Link
                      key={product.id}
                      href={`/produto/${product.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-lightBg border-b border-gray-100 last:border-b-0 transition"
                      onClick={() => {
                        setShowSearchResults(false);
                        setSearchTerm('');
                      }}
                    >
                      <div className="w-16 h-16 flex-shrink-0 bg-lightBg rounded-lg overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.category}</p>
                        <p className="text-accent font-bold">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 md:gap-4">
              <a 
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:text-accent text-primary"
              >
                <Instagram size={20} className="md:w-6 md:h-6" />
                <span className="text-xs hidden md:inline">Instagram</span>
              </a>
              <Link href="/favoritos" className="relative flex flex-col items-center hover:text-accent text-primary">
                <Heart size={20} className="md:w-6 md:h-6" />
                <span className="text-xs hidden md:inline">Favoritos</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link href="/carrinho" className="relative flex flex-col items-center hover:text-accent text-primary">
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
                <div className="absolute left-0 top-full bg-lightBg text-gray-800 shadow-2xl rounded-b-lg border-2 border-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[250px] z-[9999]">
                  <ul className="py-2">
                    {categories.map(cat => (
                      <li key={cat.id}>
                        <Link 
                          href={`/${cat.id}`}
                          className="block px-6 py-2 hover:text-primary transition text-sm font-medium"
                        >
                          {cat.name}
                        </Link>
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
                      <div className="absolute left-0 top-full bg-lightBg text-gray-800 shadow-2xl rounded-b-lg border-2 border-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-[9999]">
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
                
                // Baquetas tem dropdown especial
                if (cat.id === 'baquetas') {
                  return (
                    <li key={cat.id} className="relative group">
                      <Link 
                        href="/baquetas"
                        className="block px-4 py-3 hover:bg-secondary transition"
                      >
                        {cat.name}
                      </Link>
                      {/* Dropdown de marcas */}
                      <div className="absolute left-0 top-full bg-lightBg text-gray-800 shadow-2xl rounded-b-lg border-2 border-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-[9999]">
                        <ul className="py-2">
                          <li>
                            <Link 
                              href="/baquetas#todas-baquetas"
                              className="block px-6 py-2 hover:text-primary transition text-sm font-medium"
                            >
                              Todas as Baquetas
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/baquetas#wincent"
                              className="block px-6 py-2 hover:text-primary transition text-sm font-medium"
                            >
                              Wincent
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/baquetas#vassourinhas"
                              className="block px-6 py-2 hover:text-primary transition text-sm font-medium"
                            >
                              Vassourinhas
                            </Link>
                          </li>
                          <li>
                            <Link 
                              href="/baquetas#mallets"
                              className="block px-6 py-2 hover:text-primary transition text-sm font-medium"
                            >
                              Mallets
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

      {/* Category Navigation */}
      <CategoryNav stickyBelowHeader={true} />

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Banner */}
        <section 
          className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden"
          role="region"
          aria-label="Destaques e promoções"
        >
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Baterias & Acessórios
                <span className="block text-accent mt-2">Profissionais</span>
              </h1>
              <p className="text-xl text-gray-300">
                Revenda Oficial Wincent e Istanbul Agop em São Paulo
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
              {bannerSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
                role="group"
                aria-label="Controles do carrossel"
              >
                {bannerSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir para slide ${index + 1}`}
                    aria-current={index === currentSlide ? 'true' : 'false'}
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
                <div className="h-20 flex items-center justify-center mx-auto mb-6">
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
                <Link href="/wincent" className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition w-full block text-center">
                  Ver Baquetas Wincent →
                </Link>
              </div>
            </div>
            
            <div className="bg-lightBg p-12 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-accent transition group relative">
              <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                OFICIAL
              </span>
              <div className="text-center">
                <div className="h-48 flex items-center justify-center mx-auto mb-6">
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
                <Link href="/pratos" className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition w-full block text-center">
                  Ver Pratos Istanbul →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ofertas Especiais */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              OFERTAS
            </h2>
            <div className="w-16 h-1 bg-accent mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {products.filter(p => p.oldPrice).slice(0, 4).map(product => {
              const discount = Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100);
              return (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-200">
                  <div className="relative">
                    <div className="absolute top-2 left-2 bg-gray-900 text-white px-3 py-2 rounded-md font-bold text-sm shadow-lg z-10">
                      {discount}% OFF
                    </div>
                    <Link href={`/produto/${product.id}`} className="block relative h-40 bg-white overflow-hidden">
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-900 leading-tight">
                      {product.name}
                    </h3>
                    <div className="mb-3">
                      <div className="flex flex-col gap-1">
                        <data value={product.price} className="text-xl font-bold text-cyan-600">
                          {formatPrice(product.price)}
                        </data>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">no PIX</span>
                      </div>
                      <data value={product.oldPrice} className="text-xs text-gray-400 line-through block mt-1">
                        {formatPrice(product.oldPrice!)}
                      </data>
                      <p className="text-[10px] text-gray-600 mt-1">
                        em até <strong>5x de {formatPrice(product.price / 5)}</strong>
                      </p>
                    </div>
                    <Link
                      href={`/produto/${product.id}`}
                      className="block w-full bg-cyan-500 text-white py-2 rounded-lg font-bold text-sm text-center hover:bg-cyan-600 transition shadow-sm"
                    >
                      COMPRAR
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="py-12 bg-orange-50">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map(product => (
              <article 
                key={product.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100"
                aria-label={`Produto: ${product.name}`}
              >
                <Link href={`/produto/${product.id}`} className="relative h-64 bg-white flex items-center justify-center overflow-hidden block cursor-pointer">
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
                      <data value={product.oldPrice} className="text-sm text-gray-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </data>
                    )}
                    <data value={product.price} className="text-3xl font-bold text-accent">
                      {formatPrice(product.price)}
                    </data>
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
              </article>
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
      </main>

      <footer className="bg-darkBg text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img 
                src="/vintage-drumshop/logo-small.png" 
                alt="Vintage Drum Shop — Percussão Profissional" 
                className="h-20 w-auto mb-4"
              />
              <p className="text-sm text-gray-300">
                Revenda oficial Wincent e Istanbul Agop. Qualidade e tradição em instrumentos musicais.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Categorias</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/baterias" className="hover:text-accent transition">Baterias</Link></li>
                <li><Link href="/pratos" className="hover:text-accent transition">Pratos</Link></li>
                <li><Link href="/caixas" className="hover:text-accent transition">Caixas</Link></li>
                <li><Link href="/baquetas" className="hover:text-accent transition">Baquetas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Atendimento</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a 
                    href={contactInfo.whatsapp} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-accent transition"
                  >
                    Fale Conosco
                  </a>
                </li>
                <li><Link href="/trocas-e-devolucoes" className="hover:text-accent transition">Trocas e Devoluções</Link></li>
                <li><Link href="/politica-de-privacidade" className="hover:text-accent transition">Política de Privacidade</Link></li>
                <li><Link href="/termos-de-uso" className="hover:text-accent transition">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Contato</h4>
              <address className="not-italic text-sm space-y-2">
                <p className="block">
                  <a 
                    href={`tel:${contactInfo.phone}`}
                    className="hover:text-accent transition"
                    aria-label={`Ligar para ${contactInfo.phoneFormatted}`}
                  >
                    {contactInfo.phoneFormatted}
                  </a>
                </p>
                <p className="block">
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-accent transition"
                    aria-label={`Enviar e-mail para ${contactInfo.email}`}
                  >
                    {contactInfo.email}
                  </a>
                </p>
                <p className="block">
                  <a 
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="hover:text-accent transition"
                    aria-label={`Seguir ${contactInfo.instagramHandle} no Instagram`}
                  >
                    {contactInfo.instagramHandle}
                  </a>
                </p>
                <p className="block">{contactInfo.address}</p>
                <p className="block">{contactInfo.hours} (Horário de Brasília - GMT-3)</p>
              </address>
              <div className="flex gap-2 mt-4">
                <a 
                  href={contactInfo.whatsapp} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar conosco pelo WhatsApp"
                  className="flex-1 bg-green-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition text-center"
                >
                  WhatsApp
                </a>
                <a 
                  href={contactInfo.instagram} 
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label="Seguir Vintage Drum Shop no Instagram"
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