'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/youtube';

/**
 * Vídeo do YouTube que só carrega o player quando o cliente clica: a página do
 * produto continua leve (o player completo pesa ~1MB). Shorts ficam em pé (9:16).
 */
export default function YouTubeLite({ video, title, className = 'w-full' }: { video: YouTubeVideo; title: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  const ratio = video.short ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <div className={`relative overflow-hidden rounded-xl bg-ink ${ratio} ${className}`}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Assistir: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- miniatura do YouTube, servida pelo próprio YouTube */}
          <img
            src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] transition group-hover:scale-105">
              <Play size={28} fill="currentColor" aria-hidden />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
