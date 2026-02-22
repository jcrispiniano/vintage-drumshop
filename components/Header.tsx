'use client';

import { ShoppingCart, Heart, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { products, formatPrice } from '@/lib/products';

interface HeaderProps {
  showBackButton?: boolean;
}

export default function Header({ showBackButton = false }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

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

    setSearchResults(filtered.slice(0, 8));
    setShowSearchResults(true);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Botão Voltar */}
          {showBackButton && (
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition flex-shrink-0">
              <ArrowLeft size={24} />
              <span className="font-bold hidden md:inline">Voltar</span>
            </Link>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img 
              src="/vintage-drumshop/logo-small.png" 
              alt="Vintage Drum Shop" 
              className="h-16 md:h-20 w-auto cursor-pointer hover:opacity-80 transition"
            />
          </Link>

          {/* Busca */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar produtos, marcas..." 
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="w-full px-4 py-2 pr-10 text-sm rounded-full border-2 border-gray-300 focus:border-accent outline-none"
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

          {/* Ações */}
          <div className="flex gap-3 md:gap-4 flex-shrink-0">
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
  );
}
