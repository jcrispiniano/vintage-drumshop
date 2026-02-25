'use client';
import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

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
    <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
      <div className="bg-white shadow-2xl rounded-xl p-4 flex items-center gap-3 min-w-[300px] border-l-4 border-green-500">
        <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
        <p className="flex-1 font-semibold text-gray-900">{message}</p>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
          aria-label="Fechar notificação"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
