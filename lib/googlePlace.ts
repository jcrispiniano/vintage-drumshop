/**
 * Nota e avaliações da loja no Google (Places API "New").
 * Precisa de duas variáveis de ambiente na Vercel:
 *   GOOGLE_PLACES_API_KEY: chave com a Places API (New) ativada
 *   GOOGLE_PLACE_ID: ID do lugar da Vintage Drum Shop (começa com "ChIJ")
 * Sem elas, ou se o Google falhar, devolve null e o site simplesmente não mostra a seção.
 */

export interface GoogleReview {
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
  authorName: string;
  authorUri?: string;
  authorPhoto?: string;
  reviewUri?: string;
}

export interface GooglePlaceSummary {
  rating: number;
  count: number;
  mapsUri?: string;
  reviews: GoogleReview[];
}

const FIELDS = [
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'reviews.rating',
  'reviews.text',
  'reviews.originalText',
  'reviews.relativePublishTimeDescription',
  'reviews.publishTime',
  'reviews.authorAttribution',
  'reviews.googleMapsUri',
].join(',');

type ApiReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  googleMapsUri?: string;
};

export async function getGooglePlace(): Promise<GooglePlaceSummary | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return null;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pt-BR&regionCode=BR`,
      {
        headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': FIELDS },
        // Uma consulta por hora no máximo: a nota fica atual e o uso cabe na cota gratuita do Google
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const data = await res.json() as { rating?: number; userRatingCount?: number; googleMapsUri?: string; reviews?: ApiReview[] };
    if (!data.rating || !data.userRatingCount) return null;

    const reviews = (data.reviews ?? [])
      .map(r => ({
        rating: r.rating ?? 0,
        text: (r.originalText?.text || r.text?.text || '').trim(),
        relativeTime: r.relativePublishTimeDescription ?? '',
        publishTime: r.publishTime ?? '',
        authorName: r.authorAttribution?.displayName ?? 'Cliente do Google',
        authorUri: r.authorAttribution?.uri,
        authorPhoto: r.authorAttribution?.photoUri,
        reviewUri: r.googleMapsUri,
      }))
      // Só avaliações com texto aparecem como depoimento (nota sem comentário não diz nada ao cliente)
      .filter(r => r.text.length > 0)
      .sort((a, b) => b.publishTime.localeCompare(a.publishTime));

    return { rating: data.rating, count: data.userRatingCount, mapsUri: data.googleMapsUri, reviews };
  } catch {
    return null;
  }
}
