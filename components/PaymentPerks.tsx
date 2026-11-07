import { BadgePercent, CreditCard, Truck } from 'lucide-react';
import { campaign, paymentTerms, pixOffLabel } from '@/lib/products';

/** Faixa de benefícios da home: desconto no Pix e parcelamento em destaque, como na referência. */
export default function PaymentPerks() {
  const perks = [
    { icon: BadgePercent, big: pixOffLabel, small: 'pagando no Pix' },
    { icon: CreditCard, big: `${paymentTerms.maxInstallments}x sem juros`, small: 'no cartão de crédito' },
    { icon: Truck, big: 'Todo o Brasil', small: 'frete calculado pelo CEP' },
  ];

  return (
    <section aria-label="Condições de pagamento" className={campaign ? 'border-b-[3px] border-[#E9B872] bg-ink' : 'border-b border-line bg-cream'}>
      {campaign && (
        <p className="border-b border-white/10 py-2 text-center text-xs font-bold uppercase tracking-[0.25em] text-[#E9B872] md:text-sm">
          {campaign.name}<span className="hidden sm:inline"> · condições especiais por tempo limitado</span>
        </p>
      )}
      <ul className={`container mx-auto grid grid-cols-3 divide-x px-2 py-5 md:px-4 md:py-7 ${campaign ? 'divide-white/15' : 'divide-line'}`}>
        {perks.map(({ icon: Icon, big, small }) => (
          <li key={big} className="flex flex-col items-center gap-1 px-2 text-center md:flex-row md:justify-center md:gap-4 md:text-left">
            <Icon className={`h-7 w-7 flex-shrink-0 md:h-10 md:w-10 ${campaign ? 'text-[#E9B872]' : 'text-primary'}`} strokeWidth={1.75} aria-hidden />
            <p className="leading-tight">
              <strong className={`block font-display text-lg font-semibold uppercase md:text-3xl ${campaign ? 'text-[#E9B872]' : 'text-primary'}`}>{big}</strong>
              <span className={`text-xs md:text-base ${campaign ? 'text-[#E9D9C2]' : 'text-ink-soft'}`}>{small}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
