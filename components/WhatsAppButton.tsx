'use client';

import { MessageCircle } from 'lucide-react';
import { contactInfo } from '@/lib/products';

export default function WhatsAppButton() {
  const handleClick = () => {
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos.');
    window.open(`${contactInfo.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Contato via WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <MessageCircle size={28} strokeWidth={2} />
    </button>
  );
}
