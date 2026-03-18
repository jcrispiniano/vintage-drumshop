'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { categories, contactInfo } from '@/lib/products';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sidebar panel */}
          <motion.aside
            className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[70] md:hidden flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {/* Sidebar Header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Categorias</h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-lg transition"
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Categorias */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="py-2">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                >
                  <Link
                    href="/"
                    onClick={onClose}
                    className="block px-6 py-3 hover:bg-lightBg transition border-b border-gray-100 font-bold text-primary"
                  >
                    Home
                  </Link>
                </motion.li>
                {categories.map((cat, i) => (
                  <motion.li
                    key={cat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 1) * 0.04 }}
                  >
                    <Link
                      href={`/${cat.id}`}
                      onClick={onClose}
                      className="block px-6 py-3 hover:bg-lightBg transition border-b border-gray-100"
                    >
                      {cat.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Footer da Sidebar */}
            <div className="p-4 border-t border-gray-200 bg-orange-50">
              <p className="text-xs text-gray-600 text-center">{contactInfo.phoneFormatted}</p>
              <p className="text-xs text-gray-600 text-center">{contactInfo.email}</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
