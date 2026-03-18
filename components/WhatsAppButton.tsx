'use client';

import { contactInfo } from '@/lib/products';
import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const handleClick = () => {
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre os produtos.');
    window.open(`${contactInfo.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 drop-shadow-2xl"
      aria-label="Contato via WhatsApp"
      title="Fale conosco pelo WhatsApp"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full bg-green-400"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <img
          src="/whatsapp-logo.png"
          alt="WhatsApp"
          className="w-16 h-16 md:w-20 md:h-20 relative z-10"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
        />
      </div>
    </motion.button>
  );
}
