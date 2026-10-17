import { BadgePercent, CreditCard, Truck } from 'lucide-react';
import { paymentTerms, pixOffLabel } from '@/lib/products';

/** Faixa de benefícios da home: desconto no Pix e parcelamento em destaque, como na referência. */
export default function PaymentPerks() {
  const perks = [
    { icon: BadgePercent, big: pixOffLabel, small: 'pagando no Pix' },
    { icon: CreditCard, big: `${paymentTerms.maxInstallments}x sem juros`, small: 'no cartão de crédito' },
    { icon: Truck, big: 'Todo o Brasil', small: 'frete calculado pelo CEP' },
  ];

  return (
    <section aria-label="Condições de pagamento" className="border-b border-line bg-cream">
      <ul className="container mx-auto grid grid-cols-3 divide-x divide-line px-2 py-5 md:px-4 md:py-7">
        {perks.map(({ icon: Icon, big, small }) => (
          <li key={big} className="flex flex-col items-center gap-1 px-2 text-center md:flex-row md:justify-center md:gap-4 md:text-left">
            <Icon className="h-7 w-7 flex-shrink-0 text-primary md:h-10 md:w-10" strokeWidth={1.75} aria-hidden />
            <p className="leading-tight">
              <strong className="block font-display text-lg font-semibold uppercase text-primary md:text-3xl">{big}</strong>
              <span className="text-xs text-ink-soft md:text-base">{small}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
