/** Vídeos do YouTube cadastrados nos produtos (link comum, youtu.be ou Shorts). */
export type YouTubeVideo = { id: string; short: boolean; url: string };

export function parseYouTube(url: string): YouTubeVideo | null {
  const u = url.trim();
  const short = /youtube\.com\/shorts\//i.test(u);
  const id =
    u.match(/youtube\.com\/shorts\/([\w-]{11})/i)?.[1] ??
    u.match(/[?&]v=([\w-]{11})/)?.[1] ??
    u.match(/youtu\.be\/([\w-]{11})/i)?.[1] ??
    u.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/i)?.[1] ??
    (/^[\w-]{11}$/.test(u) ? u : undefined);
  if (!id) return null;
  return { id, short, url: short ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}` };
}

export function parseYouTubeList(urls?: string[] | null): YouTubeVideo[] {
  const seen = new Set<string>();
  return (urls ?? []).map(parseYouTube).filter((v): v is YouTubeVideo => {
    if (!v || seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });
}
