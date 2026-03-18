'use client';

import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '@/components/Toast';
import { useCartStore } from '@/lib/cartStore';

export function CartProvider({ children }: { children: ReactNode }) {
  const { toastMessage, setToastMessage } = useCartStore();

  return (
    <>
      {children}
      <AnimatePresence>
        {toastMessage && (
          <Toast
            key={toastMessage}
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function useCart() {
  return useCartStore();
}
