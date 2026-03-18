'use client';

import { useEffect, useState } from 'react';
import { contactInfo } from '@/lib/products';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';
import type { InstagramMediaItem } from '@/app/api/instagram/route';

const FALLBACK_POSTS = [
  { id: '1', image: '/banner/slide-1.jpg', caption: '🥁 Nova seleção de baterias chegando! Qualidade premium para bateristas exigentes.', permalink: contactInfo.instagram },
  { id: '2', image: '/banner/slide-2.jpg', caption: '🎵 Pratos Istanbul Agop — artesanato turco de alta qualidade. Sons únicos para sua música.', permalink: contactInfo.instagram },
  { id: '3', image: '/banner/slide-3.jpg', caption: '🪘 Caixas Pinguim com timbre incrível. Venha conferir pessoalmente!', permalink: contactInfo.instagram },
  { id: '4', image: '/banner/slide-4.jpg', caption: '🎶 Baquetas Wincent — a escolha dos profissionais. Conforto e durabilidade incomparáveis.', permalink: contactInfo.instagram },
  { id: '5', image: '/banner/slide-5.jpg', caption: '✨ Variedade de pratos para todos os estilos. Do Jazz ao Metal, temos o seu som.', permalink: contactInfo.instagram },
  { id: '6', image: '/banner/slide-6.jpg', caption: '🔥 Promoção especial! Confira nossas ofertas imperdíveis no site.', permalink: contactInfo.instagram },
  { id: '7', image: '/banner/slide-7.jpg', caption: '🎼 Acessórios de qualidade para completar o seu kit.', permalink: contactInfo.instagram },
  { id: '8', image: '/banner/slide-8.jpg', caption: '🛒 Frete grátis acima de R$199! Sua bateria favorita na sua porta.', permalink: contactInfo.instagram },
];

interface DisplayPost {
  id: string;
  image: string;
  caption: string;
  permalink: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<DisplayPost[] | null>(null);

  useEffect(() => {
    fetch('/api/instagram')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts && data.posts.length > 0) {
          setPosts(
            data.posts.map((p: InstagramMediaItem) => ({
              id: p.id,
              image: p.media_url,
              caption: p.caption ?? '',
              permalink: p.permalink,
            }))
          );
        } else {
          setPosts(FALLBACK_POSTS);
        }
      })
      .catch(() => {
        setPosts(FALLBACK_POSTS);
      });
  }, []);

  // Loading skeleton
  if (posts === null) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          {/* Imagem do post */}
          <img
            src={post.image}
            alt={post.caption}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay escuro no hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300" />

          {/* Ícone no canto superior direito */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ExternalLink size={16} className="text-white drop-shadow" />
          </div>

          {/* Caption no hover */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-xs leading-snug line-clamp-2 mb-2 drop-shadow">
              {post.caption}
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-white text-xs font-semibold drop-shadow">
                <Heart size={13} fill="white" />
              </span>
              <span className="flex items-center gap-1 text-white text-xs font-semibold drop-shadow">
                <MessageCircle size={13} fill="white" />
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
