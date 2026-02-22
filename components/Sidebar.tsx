'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { categories, contactInfo } from '@/lib/products';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Categorias</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Categorias */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="py-2">
              <li>
                <Link 
                  href="/"
                  onClick={onClose}
                  className="block px-6 py-3 hover:bg-lightBg transition border-b border-gray-100 font-bold text-primary"
                >
                  Home
                </Link>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link 
                    href={`/${cat.id}`}
                    onClick={onClose}
                    className="block px-6 py-3 hover:bg-lightBg transition border-b border-gray-100"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer da Sidebar */}
          <div className="p-4 border-t border-gray-200 bg-orange-50">
            <p className="text-xs text-gray-600 text-center">
              {contactInfo.phoneFormatted}
            </p>
            <p className="text-xs text-gray-600 text-center">
              {contactInfo.email}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
