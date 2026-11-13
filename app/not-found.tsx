import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import { contactInfo } from '@/lib/products';

export const metadata = {
  title: 'Página não encontrada',
  robots: { index: false },
};

// Links antigos e compartilhados no WhatsApp caem aqui: a página oferece caminhos, não um beco
const PATHS = [
  { href: '/pratos', label: 'Pratos', text: 'Istanbul Agop, escolha pelo som' },
  { href: '/baquetas', label: 'Baquetas', text: 'Wincent e Dynabeat' },
  { href: '/caixas', label: 'Caixas', text: 'Pinguim' },
  { href: '/baterias', label: 'Baterias', text: 'Kits completos' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav />

      <main className="container mx-auto px-4 pb-20 pt-12 md:pt-20">
        <div className="max-w-2xl">
          <p className="font-display text-7xl font-semibold leading-none text-line md:text-9xl" aria-hidden>404</p>
          <h1 className="mt-4 text-3xl font-semibold uppercase leading-tight text-ink md:text-5xl">
            Essa página saiu do palco
          </h1>
          <p className="mt-4 max-w-[60ch] text-ink-soft">
            O link pode estar antigo ou o produto mudou de endereço. Busque pelo nome no topo da página,
            escolha uma categoria abaixo ou fale com a gente.
          </p>
        </div>

        <ul className="mt-10 grid max-w-3xl gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-2">
          {PATHS.map(item => (
            <li key={item.href} className="bg-white">
              <Link href={item.href} className="group flex min-h-16 items-center justify-between gap-4 px-5 py-4 transition hover:bg-cream">
                <span>
                  <span className="block font-display text-xl font-semibold uppercase text-ink">{item.label}</span>
                  <span className="text-sm text-ink-soft">{item.text}</span>
                </span>
                <ArrowRight size={20} className="flex-shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/" className="inline-flex h-12 items-center rounded-md bg-ink px-6 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-ink/90">
            Ir para a página inicial
          </Link>
          <a
            href={`${contactInfo.whatsapp}?text=${encodeURIComponent('Olá! Cheguei num link que não abriu no site. Podem me ajudar?')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-md px-5 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-ink/40"
          >
            <MessageCircle size={18} className="text-[#1f9d55]" aria-hidden /> Perguntar pelo WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
