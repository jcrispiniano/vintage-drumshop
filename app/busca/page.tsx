'use client';
import { useState } from 'react';

import { products } from '@/lib/products';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function BuscaContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Buscar produtos
  let searchResults: typeof products = [];
  let searchType = 'exact'; // exact, brand, category, none
  
  if (query.length >= 2) {
    const lowerQuery = query.toLowerCase();
    
    // 1. Busca exata (nome do produto contém o termo)
    const exactMatches = products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
    );
    
    if (exactMatches.length > 0) {
      searchResults = exactMatches;
      searchType = 'exact';
    } else {
      // 2. Busca por marca
      const brandMatches = products.filter(product => 
        product.brand?.toLowerCase().includes(lowerQuery)
      );
      
      if (brandMatches.length > 0) {
        searchResults = brandMatches;
        searchType = 'brand';
      } else {
        // 3. Busca por categoria
        const categoryMatches = products.filter(product => 
          product.category.toLowerCase().includes(lowerQuery)
        );
        
        if (categoryMatches.length > 0) {
          searchResults = categoryMatches;
          searchType = 'category';
        } else {
          searchType = 'none';
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-orange-50">

      <Header />
      <CategoryNav currentCategory="" />

      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search size={48} />
            <h1 className="text-4xl md:text-5xl font-bold">Resultados da Busca</h1>
          </div>
          {query && (
            <p className="text-xl text-gray-300">
              Buscando por: <span className="font-bold text-accent">"{query}"</span>
            </p>
          )}
        </div>
      </section>

      {/* Resultados */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {!query || query.length < 2 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <Search size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Digite algo para buscar
                </h2>
                <p className="text-gray-600 mb-8">
                  Use a barra de busca acima para encontrar produtos
                </p>
              </div>
            </div>
          ) : searchType === 'none' ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Produto não disponível
                </h2>
                <p className="text-gray-600 mb-4">
                  Infelizmente não temos <strong>"{query}"</strong> disponível no momento ou ainda não trabalhamos com este produto.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Tente buscar por outras marcas ou produtos:
                  <br />• Baquetas (Wincent, Dynabeat)
                  <br />• Pratos (Istanbul Agop)
                  <br />• Baterias, Caixas, Peles
                </p>
                <Link
                  href="/"
                  className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition"
                >
                  Ver Todos os Produtos
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {searchResults.length} {searchResults.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </h2>
                {searchType === 'brand' ? (
                  <p className="text-gray-600">
                    Mostrando produtos da marca <span className="font-bold text-accent">"{query}"</span>
                  </p>
                ) : searchType === 'category' ? (
                  <p className="text-gray-600">
                    Mostrando produtos da categoria <span className="font-bold text-accent">"{query}"</span>
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Mostrando resultados para "{query}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {searchResults.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BuscaContent />
    </Suspense>
  );
}
