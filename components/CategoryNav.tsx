'use client';

import Link from 'next/link';
import { categories } from '@/lib/products';

interface CategoryNavProps {
  currentCategory?: string;
}

export default function CategoryNav({ currentCategory }: CategoryNavProps) {
  return (
    <nav className="bg-primary text-white shadow-lg sticky top-16 z-40">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto py-3">
          {/* Todos os Produtos com Dropdown */}
          <li className="relative group">
            <span className="block px-3 md:px-4 py-2 hover:bg-secondary transition whitespace-nowrap text-sm md:text-base cursor-pointer">
              Todos os Produtos ▾
            </span>
            {/* Dropdown */}
            <div className="absolute left-0 top-full bg-lightBg text-gray-800 shadow-2xl rounded-b-lg border-2 border-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[250px] z-50">
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
          ).map(cat => (
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
          ))}
        </ul>
      </div>
    </nav>
  );
}
