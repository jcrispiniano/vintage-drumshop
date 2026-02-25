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
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100"
      aria-label={`Produto: ${product.name}`}
    >
      <Link 
        href={`/produto/${product.id}`} 
        className="relative h-48 md:h-64 bg-gradient-to-br from-orange-50 to-white flex items-center justify-center overflow-hidden block cursor-pointer"
      >
        <div className="relative h-44 md:h-60 w-full">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain group-hover:scale-110 transition"
          />
        </div>
        {product.badge && (
          <span className="absolute top-2 right-2 bg-accent text-white px-3 py-1 rounded text-xs font-bold shadow-md">
            {product.badge}
          </span>
        )}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          aria-label={isFavorite ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
          className={`absolute top-2 left-2 p-2 rounded-full transition shadow-md ${
            isFavorite
              ? 'bg-accent text-white'
              : 'bg-white text-gray-400 hover:text-accent'
          }`}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </Link>
      
      <div className="p-3 md:p-4">
        <p className="text-xs text-accent uppercase font-bold tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-bold text-sm md:text-base mb-2 line-clamp-2 text-gray-900 group-hover:text-accent transition leading-tight">
          {product.name}
        </h3>
        
        <div className="mb-3 flex flex-col gap-0.5">
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <data 
            value={product.price} 
            className="text-2xl md:text-3xl font-bold text-accent"
          >
            {formatPrice(product.price)}
          </data>
          <p className="text-xs text-gray-500">NO PIX</p>
        </div>
        
        <button 
          onClick={handleAddToCart}
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className="w-full bg-accent text-white py-3 md:py-3 rounded-lg text-sm md:text-base font-bold hover:bg-secondary transition shadow-sm"
        >
          COMPRAR
        </button>
      </div>
    </article>
  );
}
