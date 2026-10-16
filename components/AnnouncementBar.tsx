'use client';

import { ReactNode, useEffect, useState } from 'react';
import { paymentTerms } from '@/lib/products';

const INTERVAL_MS = 3500;

const pixOff = Math.round(paymentTerms.pixDiscount * 100);

const messages: { key: string; text: string; node: ReactNode }[] = [
  {
    key: 'pix',
    text: `${pixOff}% OFF pagando no Pix ou boleto`,
    node: <><strong className="font-bold">{pixOff}% OFF</strong> pagando no Pix ou boleto</>,
  },
  {
    key: 'parcelas',
    text: `Até ${paymentTerms.maxInstallments}x sem juros no cartão de crédito`,
    node: <><strong className="font-bold">Até {paymentTerms.maxInstallments}x sem juros</strong> no cartão de crédito</>,
  },
  {
    key: 'frete',
    text: 'Enviamos para todo o Brasil',
    node: <><strong className="font-bold">Enviamos para todo o Brasil</strong> · frete pelo CEP</>,
  },
  {
    key: 'revenda',
    text: 'Revenda oficial Wincent, Istanbul Agop e Torelli',
    node: <><strong className="font-bold">Revenda oficial</strong> Wincent, Istanbul Agop e Torelli</>,
  },
];

/**
 * Barra de aviso rotativa (como na referência): uma condição por vez, subindo a cada poucos segundos.
 * A última posição é uma cópia da primeira para o giro voltar ao início sem "pulo".
 */
export default function AnnouncementBar() {
  const [{ index, animate }, setSlide] = useState({ index: 0, animate: true });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      // Se a aba ficou em segundo plano e o transitionend não veio, volta ao início sem animar
      setSlide(s => (s.index >= messages.length ? { index: 0, animate: false } : { index: s.index + 1, animate: true }));
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Chegou na cópia da primeira mensagem: volta para o início sem animação
  const handleTransitionEnd = () => {
    if (index === messages.length) setSlide({ index: 0, animate: false });
  };

  const slides = [...messages, messages[0]];

  return (
    <div
      className="bg-primary text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Leitores de tela recebem todas as mensagens de uma vez, sem a rotação */}
      <p className="sr-only">{messages.map(m => m.text).join('. ')}.</p>
      <div className="container mx-auto h-10 overflow-hidden px-4" aria-hidden>
        <ul
          onTransitionEnd={handleTransitionEnd}
          className={animate ? 'transition-transform duration-500 ease-out motion-reduce:transition-none' : ''}
          style={{ transform: `translateY(-${index * 2.5}rem)` }}
        >
          {slides.map((m, i) => (
            <li key={`${m.key}-${i}`} className="flex h-10 items-center justify-center text-center text-[13px] tracking-wide md:text-[15px]">
              <span className="truncate">{m.node}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
