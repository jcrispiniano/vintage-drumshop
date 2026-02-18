'use client';

import { products, formatPrice, categories } from '@/lib/products';
import { ShoppingCart, Heart, Search, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);

  const featuredProducts = products.filter(p => p.featured);

  const addToCart = (productId: number) => {
    setCartCount(prev => prev + 1);
    alert('✅ Produto adicionado ao carrinho!');
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        {/* Top Bar */}
        <div className="bg-darkBg text-white py-2">
          <div className="container mx-auto px-4 flex justify-between text-sm">
            <div className="space-x-4">
              <span>📱 (11) 96440-5519</span>
              <span>📧 contato@vintagedrumshop.com</span>
            </div>
            <div className="space-x-4">
              <a href="#" className="hover:text-accent">🔐 Entrar</a>
              <a href="#" className="hover:text-accent">📝 Cadastrar</a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-lightBg py-4">
          <div className="container mx-auto px-4 flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-primary">
                🥁 Vintage Drum Shop
              </h1>
              <p className="text-xs text-secondary">
                Revenda Oficial Wincent & Istanbul
              </p>
            </div>

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
              <button className="relative flex flex-col items-center hover:text-accent">
                <Heart size={24} />
                <span className="text-xs">Favoritos</span>
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button className="relative flex flex-col items-center hover:text-accent">
                <ShoppingCart size={24} />
                <span className="text-xs">Carrinho</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
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
                    {cat.icon} {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-darkBg to-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">
            Bem-vindo à Vintage Drum Shop
          </h2>
          <p className="text-xl mb-8">
            Revenda Oficial Wincent e Istanbul Cymbals
          </p>
          <a 
            href="#produtos" 
            className="inline-block bg-accent px-8 py-3 rounded-full font-semibold hover:bg-secondary transition"
          >
            Ver Produtos
          </a>
        </div>
      </section>

      {/* Marcas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            Marcas Oficiais
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-lightBg p-10 rounded-xl text-center hover:shadow-xl transition">
              <h3 className="text-3xl font-bold text-primary mb-3">WINCENT</h3>
              <p className="text-sm font-semibold mb-2">Revenda Autorizada</p>
              <p className="text-gray-600 mb-4">
                Baquetas profissionais suecas com qualidade excepcional
              </p>
              <button className="border-2 border-primary text-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition">
                Ver Produtos
              </button>
            </div>
            <div className="bg-lightBg p-10 rounded-xl text-center hover:shadow-xl transition">
              <h3 className="text-3xl font-bold text-primary mb-3">ISTANBUL AGOP</h3>
              <p className="text-sm font-semibold mb-2">Distribuidor Oficial</p>
              <p className="text-gray-600 mb-4">
                Pratos artesanais turcos com som único e tradicional
              </p>
              <button className="border-2 border-primary text-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition">
                Ver Produtos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="py-16 bg-lightBg">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-12">
            Produtos em Destaque
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
                  {product.image}
                  {product.badge && (
                    <span className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-secondary uppercase font-semibold mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mb-4">
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through mr-2">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-accent">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => addToCart(product.id)}
                      className="flex-1 bg-accent text-white py-2 rounded-lg font-semibold hover:bg-secondary transition"
                    >
                      Adicionar
                    </button>
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className={`p-2 rounded-lg border-2 transition ${
                        favorites.includes(product.id)
                          ? 'bg-accent border-accent text-white'
                          : 'border-gray-300 hover:border-accent'
                      }`}
                    >
                      <Heart size={20} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-lg font-bold text-primary mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Para todo Brasil</p>
            </div>
            <div>
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-lg font-bold text-primary mb-2">Parcele em até 12x</h3>
              <p className="text-gray-600">Sem juros no cartão</p>
            </div>
            <div>
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-lg font-bold text-primary mb-2">Compra Segura</h3>
              <p className="text-gray-600">Site protegido</p>
            </div>
            <div>
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-bold text-primary mb-2">Atendimento</h3>
              <p className="text-gray-600">WhatsApp e telefone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-darkBg text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-accent mb-4">
                Vintage Drum Shop
              </h3>
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
                <span className="block">📱 (11) 96440-5519</span>
                <span className="block">📧 contato@vintagedrumshop.com</span>
                <span className="block">📍 São Paulo - SP</span>
                <span className="block">⏰ Seg-Sex: 9h-18h | Sáb: 9h-13h</span>
              </p>
              <a 
                href="https://wa.me/5511964405519" 
                target="_blank"
                className="inline-block mt-4 bg-green-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition"
              >
                💬 WhatsApp
              </a>
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