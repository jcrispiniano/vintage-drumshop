'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

const FALLBACK = '/logo.svg';
// Precisa bater com images.remotePatterns em next.config.js
const BLOB_HOST = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//;

/** Só otimiza imagens locais e do Vercel Blob; qualquer outra origem vira <img> comum. */
function canOptimize(src: string) {
  if (src.toLowerCase().split('?')[0].endsWith('.svg')) return false;
  return (src.startsWith('/') && !src.startsWith('//')) || BLOB_HOST.test(src);
}

type SmartImageProps = Omit<ImageProps, 'src' | 'unoptimized'> & { src?: string };

/**
 * next/image com rede de segurança:
 * 1. origens desconhecidas não quebram a página (são servidas sem otimização);
 * 2. se a versão otimizada falhar (ex.: cota de otimização da Vercel esgotada),
 *    carrega a imagem original direto, como um <img> comum;
 * 3. se a original também falhar, mostra o logo da loja.
 */
export default function SmartImage({ src, alt, onError, ...rest }: SmartImageProps) {
  const [failure, setFailure] = useState<{ src?: string; stage: 'direct' | 'fallback' } | null>(null);
  const stage = failure && failure.src === src ? failure.stage : 'optimized';
  const finalSrc = !src || stage === 'fallback' ? FALLBACK : src;
  const optimize = stage === 'optimized' && canOptimize(finalSrc);

  return (
    <Image
      {...rest}
      src={finalSrc}
      alt={alt}
      unoptimized={!optimize}
      onError={(e) => {
        if (finalSrc !== FALLBACK) setFailure({ src, stage: optimize ? 'direct' : 'fallback' });
        onError?.(e);
      }}
    />
  );
}
