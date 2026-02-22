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
      className="fixed bottom-6 right-6 z-50 transition-all duration-300 hover:scale-110 drop-shadow-2xl"
      aria-label="Contato via WhatsApp"
      title="Fale conosco pelo WhatsApp"
    >
      <img 
        src="/vintage-drumshop/whatsapp-logo.png" 
        alt="WhatsApp" 
        className="w-16 h-16 md:w-20 md:h-20"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
      />
    </button>
  );
}
