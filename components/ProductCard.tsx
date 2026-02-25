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
        className="relative h-24 md:h-40 bg-gradient-to-br from-orange-50 to-white flex items-center justify-center overflow-hidden block cursor-pointer"
      >
        <div className="relative h-20 md:h-32 w-full">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain group-hover:scale-110 transition"
          />
        </div>
        {product.badge && (
          <span className="absolute top-1 right-1 bg-accent text-white px-1.5 py-0.5 rounded text-[8px] font-bold shadow-md">
            {product.badge}
          </span>
        )}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          aria-label={isFavorite ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
          className={`absolute top-1 left-1 p-1 rounded-full transition shadow-md ${
            isFavorite
              ? 'bg-accent text-white'
              : 'bg-white text-gray-400 hover:text-accent'
          }`}
        >
          <Heart size={10} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </Link>
      
      <div className="p-1.5 md:p-2">
        <p className="text-[8px] text-accent uppercase font-bold tracking-wider mb-0.5">
          {product.category}
        </p>
        <h3 className="font-bold text-[11px] md:text-sm mb-0.5 line-clamp-2 text-gray-900 group-hover:text-accent transition leading-tight">
          {product.name}
        </h3>
        
        <div className="mb-1.5 flex flex-col gap-0">
          {product.oldPrice && (
            <span className="text-[9px] text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <data 
            value={product.price} 
            className="text-base md:text-xl font-bold text-accent"
          >
            {formatPrice(product.price)}
          </data>
          <p className="text-[8px] text-gray-500">no PIX</p>
        </div>
        
        <button 
          onClick={handleAddToCart}
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className="w-full bg-accent text-white py-1 md:py-2 rounded text-[10px] md:text-sm font-bold hover:bg-secondary transition shadow-sm"
        >
          COMPRAR
        </button>
      </div>
    </article>
  );
}
