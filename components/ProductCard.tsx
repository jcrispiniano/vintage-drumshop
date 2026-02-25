'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product, formatPrice } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleFavorite, favorites } = useCart();
  const isFavorite = favorites.includes(product.id);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
    });
  };

  return (
    <article 
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group border border-gray-100"
      aria-label={`Produto: ${product.name}`}
    >
      <Link 
        href={`/produto/${product.id}`} 
        className="relative h-64 bg-gradient-to-br from-orange-50 to-white flex items-center justify-center overflow-hidden block cursor-pointer"
      >
        <div className="relative h-48 w-full">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain group-hover:scale-110 transition"
          />
        </div>
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
          aria-label={isFavorite ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
          className={`absolute top-4 left-4 p-3 rounded-full transition shadow-lg ${
            isFavorite
              ? 'bg-accent text-white'
              : 'bg-white text-gray-400 hover:text-accent'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
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
          <data 
            value={product.price} 
            className="text-3xl font-bold text-accent"
          >
            {formatPrice(product.price)}
          </data>
        </div>
        
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleAddToCart}
            aria-label={`Adicionar ${product.name} ao carrinho`}
            className="w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-secondary transition shadow-md hover:shadow-lg"
          >
            Adicionar ao Carrinho
          </button>
          <Link
            href={`/produto/${product.id}`}
            className="w-full border-2 border-accent text-accent py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition text-center"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}
