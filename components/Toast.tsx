'use client';
import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-24 right-4 z-[200]">
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        className="bg-white shadow-2xl rounded-xl overflow-hidden min-w-[300px] border-l-4 border-accent"
      >
        <div className="p-4 flex items-center gap-3">
          <CheckCircle className="text-accent flex-shrink-0" size={24} />
          <p className="flex-1 font-semibold text-gray-900">{message}</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
            aria-label="Fechar notificação"
          >
            <X size={20} />
          </button>
        </div>
        {/* Progress bar */}
        <motion.div
          className="h-1 bg-accent origin-left"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
}
