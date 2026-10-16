'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Mail, MessageCircle, Phone } from 'lucide-react';
import SmartImage from '@/components/SmartImage';
import { categories, contactInfo, paymentTerms } from '@/lib/products';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="mt-auto bg-ink text-[#E9D9C2]">
      <div className="border-b border-white/10">
        <ul className="container mx-auto grid grid-cols-1 gap-3 px-4 py-5 text-sm sm:grid-cols-3">
          <li><strong className="text-white">{Math.round(paymentTerms.pixDiscount * 100)}% de desconto</strong> no Pix ou boleto</li>
          <li><strong className="text-white">Até {paymentTerms.maxInstallments}x sem juros</strong> no cartão</li>
          <li><strong className="text-white">Frete grátis</strong> acima de R$ {paymentTerms.freeShippingFrom}</li>
        </ul>
      </div>

      <div className="container mx-auto grid gap-10 px-4 py-12 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <SmartImage
            src="/logo-header.png"
            alt="Vintage Drum Shop"
            width={120}
            height={88}
            className="mb-4 h-16 w-auto brightness-0 invert sepia-[.35]"
          />
          <p className="max-w-xs text-sm leading-relaxed">
            Revenda oficial Wincent, Istanbul Agop e Torelli. Baterias, pratos e acessórios escolhidos por quem toca.
          </p>
        </div>

        <nav aria-label="Categorias">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Categorias</h2>
          <ul className="space-y-0.5 text-sm">
            {categories.slice(0, 6).map(cat => (
              <li key={cat.id}>
                <Link href={`/${cat.id}`} className="inline-flex min-h-9 items-center hover:text-white hover:underline">{cat.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Institucional">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Atendimento</h2>
          <ul className="space-y-0.5 text-sm">
            <li><Link href="/trocas-e-devolucoes" className="inline-flex min-h-9 items-center hover:text-white hover:underline">Trocas e devoluções</Link></li>
            <li><Link href="/politica-de-privacidade" className="inline-flex min-h-9 items-center hover:text-white hover:underline">Política de privacidade</Link></li>
            <li><Link href="/termos-de-uso" className="inline-flex min-h-9 items-center hover:text-white hover:underline">Termos de uso</Link></li>
            <li><Link href="/favoritos" className="inline-flex min-h-9 items-center hover:text-white hover:underline">Meus favoritos</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Contato</h2>
          <address className="space-y-2.5 text-sm not-italic">
            <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 hover:text-white">
              <Phone size={15} aria-hidden /> {contactInfo.phoneFormatted}
            </a>
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 break-all hover:text-white">
              <Mail size={15} aria-hidden /> {contactInfo.email}
            </a>
            <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer me" className="flex items-center gap-2 hover:text-white">
              <Instagram size={15} aria-hidden /> {contactInfo.instagramHandle}
            </a>
            <p>{contactInfo.address} · {contactInfo.hours}</p>
          </address>
          <a
            href={contactInfo.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#167a42] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#11643a]"
          >
            <MessageCircle size={16} aria-hidden /> Falar no WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-[#BFAE98]">
        © {new Date().getFullYear()} Vintage Drum Shop. Todos os direitos reservados.
      </div>
    </footer>
  );
}
