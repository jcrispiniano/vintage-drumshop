'use client';

import { contactInfo } from '@/lib/products';

export default function WhatsAppButton() {
  const handleClick = () => {
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos.');
    window.open(`${contactInfo.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse"
      aria-label="Contato via WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <img 
        src="/vintage-drumshop/whatsapp-logo.png" 
        alt="WhatsApp" 
        className="w-16 h-16 md:w-20 md:h-20"
      />
    </button>
  );
}
