'use client';

import { products, formatPrice, categories, contactInfo } from '@/lib/products';
import { ShoppingCart, Heart, Search, Menu, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function Home() {
  const { cartItems, favorites, addToCart, toggleFavorite } = useCart();
  const featuredProducts = products.filter(p => p.featured);

  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
      });
      alert('✅ Produto adicionado ao carrinho!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
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
        <div className="bg-lightBg py-4">
          <div className="container mx-auto px-4 flex items-center justify-between gap-4">
            <a href="/" className="flex-shrink-0 flex items-center gap-3">
              <img 
                src="/vintage-drumshop/logo-small.png" 
                alt="Vintage Drum Shop" 
                className="h-12 md:h-14 w-auto object-contain"
              />
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-primary leading-tight">
                  Vintage Drum Shop
                </h1>
                <p className="text-xs text-secondary">
                  Wincent & Istanbul
                </p>
              </div>
            </a>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Buscar produtos..." 
                  className="w-full px-4 py-2 rounded-full border-2 border-gray-300 focus:border-accent outline-none"
                />
                <Search className="absolute right-4 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            <div className="flex gap-4">
              <a 
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:text-accent"
              >
                <Instagram size={24} />
                <span className="text-xs">Instagram</span>
              </a>
              <Link href="/favoritos" className="relative flex flex-col items-center hover:text-accent">
                <Heart size={24} />
                <span className="text-xs">Favoritos</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link href="/carrinho" className="relative flex flex-col items-center hover:text-accent">
                <ShoppingCart size={24} />
                <span className="text-xs">Carrinho</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-primary text-white">
          <div className="container mx-auto px-4">
            <ul className="flex justify-center space-x-1">
              {categories.map(cat => (
                <li key={cat.id}>
                  <a 
                    href={`#${cat.id}`}
                    className="block px-4 py-3 hover:bg-secondary transition"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
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
                Revenda Oficial Wincent e Istanbul Cymbals
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
            <div className="relative h-64 md:h-96 hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl font-bold text-primary/20">🥁</div>
                  <p className="text-sm text-gray-600 font-semibold">
                    Equipamentos Profissionais
                  </p>
                </div>
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
            <div className="bg-white p-12 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-accent transition group relative">
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
                <h3 className="text-3xl font-bold text-gray-900 mb-2">WINCENT</h3>
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
            
            <div className="bg-white p-12 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-accent transition group relative">
              <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                OFICIAL
              </span>
              <div className="text-center">
                <div className="h-24 flex items-center justify-center mx-auto mb-6">
                  <img 
                    src="/vintage-drumshop/istanbul-logo.png" 
                    alt="Istanbul Agop"
                    className="h-full w-auto object-contain group-hover:scale-110 transition"
                  />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">ISTANBUL AGOP</h3>
                <p className="text-accent font-bold text-sm tracking-wide uppercase mb-3">Distribuidor Oficial</p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pratos artesanais turcos feitos à mão há gerações. Som único, 
                  rico em harmônicos e usado pelos maiores bateristas do mundo.
                </p>
                <button className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition w-full">
                  Ver Pratos Istanbul →
                </button>
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
                <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent"></div>
                  <img 
                    src="/vintage-drumshop/logo.png"
                    alt={product.name}
                    className="h-32 w-auto object-contain opacity-10 group-hover:opacity-20 transition"
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
                    onClick={() => toggleFavorite(product.id)}
                    className={`absolute top-4 left-4 p-3 rounded-full transition shadow-lg ${
                      favorites.includes(product.id)
                        ? 'bg-accent text-white'
                        : 'bg-white text-gray-400 hover:text-accent'
                    }`}
                  >
                    <Heart size={18} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
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
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-secondary transition shadow-md hover:shadow-lg"
                    >
                      Adicionar ao Carrinho
                    </button>
                    <button className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:border-accent hover:text-accent transition">
                      Ver Detalhes
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
          
          {/* Instagram Feed Placeholder */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <a
                key={i}
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden hover:scale-105 transition transform shadow-lg hover:shadow-xl"
              >
                <img 
                  src="/vintage-drumshop/logo.png" 
                  alt="Instagram Post" 
                  className="w-full h-full object-cover opacity-30"
                />
              </a>
            ))}
          </div>
          
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
                Revenda oficial Wincent e Istanbul Cymbals. Qualidade e tradição em instrumentos musicais.
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