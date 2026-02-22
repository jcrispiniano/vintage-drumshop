'use client';

import { products, formatPrice } from '@/lib/products';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';

export default function WincentPage() {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const wincentProducts = products.filter(p => p.brand === 'wincent' && p.category === 'baquetas');

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
      <CategoryNav currentCategory="baquetas" />

      {/* Hero */}
      <section className="bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Wincent</h1>
          <p className="text-xl text-red-100">
            Baquetas profissionais suecas com madeira de primeira qualidade
          </p>
        </div>
      </section>

      {/* Produtos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-bold text-sm tracking-wider uppercase">Marca Oficial</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Baquetas Wincent
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Durabilidade e equilíbrio perfeito. Escolha de bateristas profissionais ao redor do mundo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wincentProducts.map(product => (
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
                  <p className="text-xs text-red-600 uppercase font-bold tracking-wider mb-2">Wincent</p>
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900 via-red-800 to-red-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher Wincent?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-4xl mb-4">🇸🇪</div>
              <h3 className="text-xl font-bold mb-2">Origem Sueca</h3>
              <p className="text-red-100">Tradição e qualidade escandinava</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-xl font-bold mb-2">Madeira Premium</h3>
              <p className="text-red-100">Hickory americano cuidadosamente selecionado</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold mb-2">Linha Completa</h3>
              <p className="text-red-100">Modelos para todos os estilos musicais</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
