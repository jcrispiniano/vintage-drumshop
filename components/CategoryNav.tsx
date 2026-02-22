'use client';

import Link from 'next/link';
import { categories } from '@/lib/products';

interface CategoryNavProps {
  currentCategory?: string;
}

export default function CategoryNav({ currentCategory }: CategoryNavProps) {
  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50 overflow-visible">
      <div className="container mx-auto px-4 overflow-visible">
        <ul className="flex items-center justify-center gap-2 md:gap-4 py-3 relative overflow-visible">
          {/* Todos os Produtos com Dropdown */}
          <li className="relative group">
            <span className="block px-3 md:px-4 py-2 hover:bg-secondary transition whitespace-nowrap text-sm md:text-base cursor-pointer">
              Todos os Produtos ▾
            </span>
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

          {/* Categorias Principais */}
          {categories.filter(cat => 
            ['baterias', 'pratos', 'caixas', 'peles', 'baquetas', 'acessorios'].includes(cat.id)
          ).map(cat => {
            // Pratos tem dropdown com Istanbul
            if (cat.id === 'pratos') {
              return (
                <li key={cat.id} className="relative group">
                  <Link 
                    href="/pratos"
                    className={`block px-3 md:px-4 py-2 transition whitespace-nowrap text-sm md:text-base ${
                      currentCategory === cat.id 
                        ? 'bg-secondary' 
                        : 'hover:bg-secondary'
                    }`}
                  >
                    {cat.name}
                  </Link>
                  {/* Dropdown de marcas */}
                  <div className="absolute left-0 top-full bg-lightBg text-gray-800 shadow-2xl rounded-b-lg border-2 border-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px] z-[9999]">
                    <ul className="py-2">
                      <li>
                        <Link 
                          href="/pratos#todas-baquetas"
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
            
            // Baquetas tem dropdown com Wincent
            if (cat.id === 'baquetas') {
              return (
                <li key={cat.id} className="relative group">
                  <Link 
                    href="/baquetas"
                    className={`block px-3 md:px-4 py-2 transition whitespace-nowrap text-sm md:text-base ${
                      currentCategory === cat.id 
                        ? 'bg-secondary' 
                        : 'hover:bg-secondary'
                    }`}
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
                          href="/baquetas#dynabeat"
                          className="block px-6 py-2 hover:text-primary transition text-sm font-medium"
                        >
                          Dynabeat
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
            
            // Outras categorias normais
            return (
              <li key={cat.id}>
                <Link 
                  href={`/${cat.id}`}
                  className={`block px-3 md:px-4 py-2 transition whitespace-nowrap text-sm md:text-base ${
                    currentCategory === cat.id 
                      ? 'bg-secondary' 
                      : 'hover:bg-secondary'
                  }`}
                >
                  {cat.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
