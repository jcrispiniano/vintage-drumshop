'use client';

import { useEffect, useState } from 'react';
import { contactInfo } from '@/lib/products';

interface InstagramPost {
  id: string;
  permalink: string;
  media_url: string;
  media_type: string;
  caption?: string;
  timestamp: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Por enquanto, vou usar posts de demonstração
    // Para usar posts reais, você precisa configurar o Instagram Basic Display API
    // e adicionar um access token em uma variável de ambiente
    
    // Posts de demonstração (substitua com a API real quando configurada)
    const demoPosts = [
      {
        id: '1',
        permalink: contactInfo.instagram,
        media_url: '/vintage-drumshop/logo.png',
        media_type: 'IMAGE',
        caption: 'Confira nossas baquetas Wincent! 🥁',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        permalink: contactInfo.instagram,
        media_url: '/vintage-drumshop/wincent-logo.png',
        media_type: 'IMAGE',
        caption: 'Novos pratos Istanbul chegando! 🎵',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        permalink: contactInfo.instagram,
        media_url: '/vintage-drumshop/istanbul-logo.png',
        media_type: 'IMAGE',
        caption: 'Promoção especial de fim de semana! 🔥',
        timestamp: new Date().toISOString(),
      },
      {
        id: '4',
        permalink: contactInfo.instagram,
        media_url: '/vintage-drumshop/logo.png',
        media_type: 'IMAGE',
        caption: 'Novidades em breve! Stay tuned 🎶',
        timestamp: new Date().toISOString(),
      },
      {
        id: '5',
        permalink: contactInfo.instagram,
        media_url: '/vintage-drumshop/wincent-logo.png',
        media_type: 'IMAGE',
        caption: 'Qualidade premium para bateristas profissionais 🥁',
        timestamp: new Date().toISOString(),
      },
      {
        id: '6',
        permalink: contactInfo.instagram,
        media_url: '/vintage-drumshop/istanbul-logo.png',
        media_type: 'IMAGE',
        caption: 'Som artesanal turco 🇹🇷',
        timestamp: new Date().toISOString(),
      },
      {
        id: '7',
        permalink: contactInfo.instagram,
        media_url: '/vintage-drumshop/logo.png',
        media_type: 'IMAGE',
        caption: 'Vintage Drum Shop - Sua loja de confiança 🎵',
        timestamp: new Date().toISOString(),
      },
      {
        id: '8',
        permalink: contactInfo.instagram,
        media_url: '/vintage-drumshop/logo.png',
        media_type: 'IMAGE',
        caption: 'Frete grátis acima de R$ 199! 🚚',
        timestamp: new Date().toISOString(),
      },
    ];

    setTimeout(() => {
      setPosts(demoPosts);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {posts.slice(0, 8).map((post) => (
        <a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden hover:scale-105 transition transform shadow-lg hover:shadow-xl relative"
        >
          <img
            src={post.media_url}
            alt={post.caption || 'Instagram post'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
            <p className="text-white text-sm line-clamp-2">
              {post.caption}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
