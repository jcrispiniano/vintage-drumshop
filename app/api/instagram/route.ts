import { NextResponse } from 'next/server';

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    return NextResponse.json(
      { error: 'INSTAGRAM_ACCESS_TOKEN e INSTAGRAM_USER_ID não configurados.' },
      { status: 500 }
    );
  }

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.facebook.com/v18.0/${userId}/media?fields=${fields}&limit=8&access_token=${accessToken}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: 'Erro ao buscar posts do Instagram.', detail: err },
      { status: 500 }
    );
  }

  const data = await res.json();
  const posts: InstagramMediaItem[] = (data.data ?? []).map((item: InstagramMediaItem) => ({
    id: item.id,
    caption: item.caption ?? '',
    media_type: item.media_type,
    media_url: item.media_type === 'VIDEO' ? (item.thumbnail_url ?? item.media_url) : item.media_url,
    permalink: item.permalink,
    timestamp: item.timestamp,
  }));

  return NextResponse.json({ posts });
}
