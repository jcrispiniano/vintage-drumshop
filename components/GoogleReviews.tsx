import { ArrowUpRight, Star } from 'lucide-react';
import { contactInfo } from '@/lib/products';
import { getGooglePlace } from '@/lib/googlePlace';

/** Estrelas da nota (preenchidas proporcionalmente, como no Google) */
function Stars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <span className="relative inline-flex" aria-hidden>
      <span className="flex text-line">
        {[0, 1, 2, 3, 4].map(i => <Star key={i} size={size} fill="currentColor" strokeWidth={0} />)}
      </span>
      <span className="absolute inset-0 flex overflow-hidden text-gold" style={{ width: `${(value / 5) * 100}%` }}>
        {[0, 1, 2, 3, 4].map(i => <Star key={i} size={size} fill="currentColor" strokeWidth={0} className="flex-shrink-0" />)}
      </span>
    </span>
  );
}

/**
 * Nota atual da loja e as avaliações mais recentes, direto do Google.
 * Sem chave configurada ou sem nenhuma avaliação ainda, a seção não aparece.
 * As avaliações não vão para os dados estruturados: o Google não aceita reutilizar as próprias avaliações em markup.
 */
export default async function GoogleReviews() {
  const place = await getGooglePlace();
  if (!place) return null;

  const rating = place.rating.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const reviews = place.reviews.slice(0, 3);

  return (
    <section className="border-t border-line bg-cream py-12 md:py-16" aria-labelledby="google-titulo">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="google-titulo" className="text-3xl font-semibold uppercase leading-none text-ink md:text-5xl">
              Quem comprou, recomenda
            </h2>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink">
              <span className="font-display text-4xl font-semibold leading-none tabular-nums">{rating}</span>
              <Stars value={place.rating} size={22} />
              <span className="text-sm text-ink-soft">
                {place.count} {place.count === 1 ? 'avaliação' : 'avaliações'} no Google
              </span>
              <span className="sr-only">Nota {rating} de 5</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={contactInfo.googleReview}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-ink px-5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-ink/90"
            >
              <Star size={16} aria-hidden /> Avaliar a loja
            </a>
            {place.mapsUri && (
              <a
                href={place.mapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-1.5 rounded-md px-5 text-sm font-bold uppercase tracking-wide text-ink ring-1 ring-ink/25 transition hover:ring-ink/50"
              >
                Ver todas no Google <ArrowUpRight size={16} aria-hidden />
              </a>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {reviews.map(r => (
              <li key={`${r.authorName}-${r.publishTime}`} className="flex flex-col rounded-xl bg-white p-5 ring-1 ring-line">
                <div className="flex items-center gap-3">
                  {r.authorPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element -- foto do perfil servida pelo Google
                    <img src={r.authorPhoto} alt="" width={40} height={40} loading="lazy" referrerPolicy="no-referrer" className="h-10 w-10 rounded-full bg-paper object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper font-semibold text-ink" aria-hidden>
                      {r.authorName.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0 leading-tight">
                    {r.authorUri ? (
                      <a href={r.authorUri} target="_blank" rel="noopener noreferrer" className="block truncate font-semibold text-ink hover:underline">{r.authorName}</a>
                    ) : (
                      <span className="block truncate font-semibold text-ink">{r.authorName}</span>
                    )}
                    <span className="text-xs text-ink-soft">{r.relativeTime}</span>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-2">
                  <Stars value={r.rating} size={15} />
                  <span className="sr-only">Nota {r.rating} de 5</span>
                </p>
                <p className="mt-2 line-clamp-6 whitespace-pre-line text-sm leading-relaxed text-ink">{r.text}</p>
                {r.reviewUri && (
                  <a href={r.reviewUri} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 items-end pt-3 text-sm font-semibold text-secondary hover:underline">
                    Ler no Google
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Atribuição exigida pelos termos do Google para conteúdo da Places API */}
        <p className="mt-6 text-xs text-ink-soft">Nota e avaliações fornecidas pelo Google.</p>
      </div>
    </section>
  );
}
