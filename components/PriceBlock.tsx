import { formatPrice, paymentTerms, pixPrice } from '@/lib/products';

interface PriceBlockProps {
  price: number;
  oldPrice?: number;
  size?: 'card' | 'page';
}

/** Preço no padrão da referência: de/por, Pix em destaque e parcelamento no cartão. */
export default function PriceBlock({ price, oldPrice, size = 'card' }: PriceBlockProps) {
  const pix = pixPrice(price);
  const installments = paymentTerms.maxInstallments;
  const isPage = size === 'page';

  return (
    <div className="tabular-nums">
      {oldPrice && oldPrice > price && (
        <data
          value={oldPrice}
          className={`block text-ink-soft line-through ${isPage ? 'text-base' : 'text-xs'}`}
        >
          {formatPrice(oldPrice)}
        </data>
      )}
      <p className="flex items-baseline gap-1.5 flex-wrap">
        <data
          value={pix}
          className={`font-bold text-accent leading-none ${isPage ? 'text-4xl md:text-5xl' : 'text-xl md:text-2xl'}`}
        >
          {formatPrice(pix)}
        </data>
        <span className={`font-semibold uppercase text-ink ${isPage ? 'text-sm' : 'text-[11px]'}`}>no Pix</span>
      </p>
      {isPage ? (
        <p className="mt-1 text-sm text-ink-soft">
          <data value={price} className="font-semibold text-ink">{formatPrice(price)}</data>
          {' '}em até{' '}
          <span className="font-semibold text-ink">
            {installments}x de {formatPrice(price / installments)}
          </span>
          <span className="ml-2 align-middle inline-block rounded bg-cream px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink">
            sem juros
          </span>
        </p>
      ) : (
        // No card, só a parcela; o preço cheio do cartão fica na página do produto
        <p className="mt-1 text-xs leading-snug text-ink-soft">
          ou <span className="whitespace-nowrap font-semibold text-ink">{installments}x de {formatPrice(price / installments)}</span>{' '}
          <span className="whitespace-nowrap">sem juros</span>
          <data value={price} className="sr-only"> ({formatPrice(price)} no cartão)</data>
        </p>
      )}
    </div>
  );
}
