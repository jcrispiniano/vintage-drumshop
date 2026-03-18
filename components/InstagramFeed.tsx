'use client';

import { contactInfo } from '@/lib/products';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
}

const posts: InstagramPost[] = [
  {
    id: '1',
    image: '/banner/slide-1.jpg',
    caption: '🥁 Nova seleção de baterias chegando! Qualidade premium para bateristas exigentes.',
    likes: 142,
    comments: 18,
  },
  {
    id: '2',
    image: '/banner/slide-2.jpg',
    caption: '🎵 Pratos Istanbul Agop — artesanato turco de alta qualidade. Sons únicos para sua música.',
    likes: 98,
    comments: 11,
  },
  {
    id: '3',
    image: '/banner/slide-3.jpg',
    caption: '🪘 Caixas Pinguim com timbre incrível. Venha conferir pessoalmente!',
    likes: 213,
    comments: 27,
  },
  {
    id: '4',
    image: '/banner/slide-4.jpg',
    caption: '🎶 Baquetas Wincent — a escolha dos profissionais. Conforto e durabilidade incomparáveis.',
    likes: 176,
    comments: 14,
  },
  {
    id: '5',
    image: '/banner/slide-5.jpg',
    caption: '✨ Variedade de pratos para todos os estilos. Do Jazz ao Metal, temos o seu som.',
    likes: 89,
    comments: 9,
  },
  {
    id: '6',
    image: '/banner/slide-6.jpg',
    caption: '🔥 Promoção especial! Confira nossas ofertas imperdíveis no site.',
    likes: 304,
    comments: 43,
  },
  {
    id: '7',
    image: '/banner/slide-7.jpg',
    caption: '🎼 Acessórios de qualidade para completar o seu kit. Ferragens, peles, bags e muito mais.',
    likes: 127,
    comments: 16,
  },
  {
    id: '8',
    image: '/banner/slide-8.jpg',
    caption: '🛒 Frete grátis acima de R$199! Sua bateria favorita na sua porta.',
    likes: 251,
    comments: 32,
  },
];

function formatCount(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function InstagramFeed() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
      {posts.map((post) => (
        <a
          key={post.id}
          href={contactInfo.instagram}
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

          {/* Ícone Instagram no canto superior direito */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ExternalLink size={16} className="text-white drop-shadow" />
          </div>

          {/* Caption + likes no hover */}
          <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-xs leading-snug line-clamp-2 mb-2 drop-shadow">
              {post.caption}
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-white text-xs font-semibold drop-shadow">
                <Heart size={13} fill="white" />
                {formatCount(post.likes)}
              </span>
              <span className="flex items-center gap-1 text-white text-xs font-semibold drop-shadow">
                <MessageCircle size={13} fill="white" />
                {formatCount(post.comments)}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
