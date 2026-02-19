'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingCart, Share2 } from 'lucide-react';
import { Product, formatPrice, contactInfo, products } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

export default function ProdutoClient({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category
    });
    alert('✅ Produto adicionado ao carrinho!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition">
              <ArrowLeft size={24} />
              <span className="font-bold hidden md:inline">Voltar</span>
            </Link>
            <img 
              src="/vintage-drumshop/logo-small.png" 
              alt="Vintage Drum Shop" 
              className="h-10 w-auto"
            />
            <div className="flex gap-4">
              <Link href="/favoritos" className="text-primary hover:text-accent transition">
                <Heart size={24} />
              </Link>
              <Link href="/carrinho" className="text-primary hover:text-accent transition">
                <ShoppingCart size={24} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Produto */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Imagem */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="relative aspect-square flex items-center justify-center">
              <img 
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
              {product.badge && (
                <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Informações */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-6">
              <p className="text-xs text-accent uppercase font-bold tracking-wider mb-2">
                {product.brand === 'istanbul' ? 'Istanbul Agop' : product.brand === 'wincent' ? 'Wincent' : product.category}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="mb-6">
                {product.oldPrice && (
                  <p className="text-gray-400 line-through text-xl mb-1">
                    {formatPrice(product.oldPrice)}
                  </p>
                )}
                <p className="text-5xl font-bold text-accent mb-2">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-gray-600">
                  ou 6x de {formatPrice(product.price / 6)} sem juros
                </p>
              </div>

              <div className="flex gap-4 mb-6">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-accent text-white py-4 px-6 rounded-lg font-bold hover:bg-secondary transition shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Adicionar ao Carrinho
                </button>
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className={`p-4 rounded-lg font-bold transition shadow-lg ${
                    isFavorite
                      ? 'bg-accent text-white'
                      : 'bg-white text-gray-400 hover:text-accent border-2 border-gray-200'
                  }`}
                >
                  <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 rounded-lg font-bold bg-white text-gray-400 hover:text-accent transition shadow-lg border-2 border-gray-200"
                >
                  <Share2 size={24} />
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-3">Benefícios</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    ✓ Frete grátis para compras acima de R$ 199
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ Até 3x sem juros no cartão de crédito
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ 5% de desconto no PIX ou Boleto
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ SAC especializado via WhatsApp
                  </li>
                </ul>
              </div>
            </div>

            <a 
              href={contactInfo.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-green-500 text-white text-center py-4 px-6 rounded-lg font-bold hover:bg-green-600 transition shadow-lg"
            >
              Tire suas dúvidas pelo WhatsApp
            </a>
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Descrição do Produto</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <Link 
                  key={relatedProduct.id}
                  href={`/produto/${relatedProduct.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition group"
                >
                  <div className="relative h-48 bg-gray-50 flex items-center justify-center">
                    <img 
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="h-32 w-auto object-contain group-hover:scale-110 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-lg font-bold text-accent">
                      {formatPrice(relatedProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
