'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToastProps {
  /** "Título|detalhe" — o detalhe (nome do produto) é opcional */
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3500 }: ToastProps) {
  const [title, detail] = message.split('|');

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[200] sm:left-6 sm:right-auto sm:w-[360px]" role="status">
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden rounded-xl bg-ink text-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center gap-3 p-4">
          <CheckCircle className="flex-shrink-0 text-[#E9B872]" size={22} aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{title}</p>
            {detail && <p className="truncate text-sm text-[#E9D9C2]">{detail}</p>}
          </div>
          <Link href="/carrinho" onClick={onClose} className="flex-shrink-0 rounded-md bg-white/10 px-3 py-2 text-sm font-bold hover:bg-white/20">
            Ver carrinho
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-[#E9D9C2] transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar notificação"
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
