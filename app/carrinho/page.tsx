'use client';
import { Trash2, Plus, Minus, ShoppingCart, Undo2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/lib/cartStore';
import { categories, contactInfo, formatPrice, paymentTerms, pixPrice, productImage } from '@/lib/products';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import SmartImage from '@/components/SmartImage';

const SHIPPING_FEE = 29.9;

const steps = [
  { title: 'Envie o pedido', text: 'O WhatsApp abre com a lista do pedido pronta.' },
  { title: 'Confirmamos tudo', text: 'Conferimos estoque e frete para o seu CEP.' },
  { title: 'Pague no Pix', text: `Com ${Math.round(paymentTerms.pixDiscount * 100)}% de desconto, ou em até ${paymentTerms.maxInstallments}x sem juros.` },
];

export default function CarrinhoPage() {
  const { cartItems, updateQuantity, removeFromCart, addToCart } = useCart();
  const [removed, setRemoved] = useState<CartItem | null>(null);

  // A opção de desfazer some sozinha depois de alguns segundos
  useEffect(() => {
    if (!removed) return;
    const t = setTimeout(() => setRemoved(null), 6000);
    return () => clearTimeout(t);
  }, [removed]);

  const handleRemove = (item: CartItem) => {
    removeFromCart(item.id);
    setRemoved(item);
  };

  const handleUndo = () => {
    if (!removed) return;
    const { quantity, ...rest } = removed;
    addToCart(rest);
    if (quantity > 1) updateQuantity(rest.id, quantity);
    setRemoved(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShipping = subtotal >= paymentTerms.freeShippingFrom;
  const shipping = freeShipping ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const totalPix = pixPrice(subtotal) + shipping;
  const savings = total - totalPix;
  const installments = paymentTerms.maxInstallments;

  const handleCheckout = () => {
    let message = '🛒 *Pedido - Vintage Drum Shop*\n\n';

    cartItems.forEach(item => {
      message += `*${item.quantity}x* ${item.name}\n`;
      message += `${formatPrice(pixPrice(item.price))} no Pix (${formatPrice(item.price)} no cartão) cada\n\n`;
    });

    message += '━━━━━━━━━━━━━━━\n';
    message += `*Total no Pix:* ${formatPrice(totalPix)}\n`;
    message += `*Ou no cartão:* ${formatPrice(total)} em até ${installments}x de ${formatPrice(total / installments)}\n`;
    message += `*Frete:* ${freeShipping ? 'grátis' : `${formatPrice(shipping)} (a confirmar pelo CEP)`}\n\n`;
    message += 'Gostaria de finalizar este pedido! Meu CEP é: ';

    window.open(`${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const categoryName = (id: string) => categories.find(c => c.id === id)?.name ?? id;

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav />

      <div className="container mx-auto px-4 pb-16 pt-8">
        <h1 className="mb-6 text-3xl font-semibold uppercase text-ink md:text-4xl">Seu carrinho</h1>

        {removed && (
          <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-ink px-4 py-3 text-sm text-white">
            <span className="min-w-0 truncate">Removido: {removed.name}</span>
            <button type="button" onClick={handleUndo} className="flex flex-shrink-0 items-center gap-1.5 font-bold text-[#E9B872] hover:underline">
              <Undo2 size={16} aria-hidden /> Desfazer
            </button>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="mx-auto max-w-lg py-10 text-center">
            <ShoppingCart size={48} className="mx-auto mb-5 text-primary" aria-hidden />
            <h2 className="mb-2 text-2xl font-semibold uppercase text-ink">Banco vazio por aqui</h2>
            <p className="mb-8 text-ink-soft">Seu carrinho ainda não tem nada. Comece por uma das categorias:</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {['pratos', 'baquetas', 'caixas'].map(id => (
                <li key={id}>
                  <Link href={`/${id}`} className="inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-semibold text-ink ring-1 ring-line transition hover:ring-ink/50">
                    {categoryName(id)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <section aria-label="Itens do carrinho" className="space-y-3 lg:col-span-2">
              {cartItems.map(item => (
                <article key={item.id} className="flex gap-3 rounded-xl bg-white p-3 ring-1 ring-line sm:gap-5 sm:p-5">
                  <Link href={`/produto/${item.id}`} className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-paper sm:h-28 sm:w-28">
                    <SmartImage src={productImage(item.image)} alt={item.name} fill sizes="112px" className="object-cover" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-primary">{categoryName(item.category)}</p>
                    <h2 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight text-ink sm:text-base">
                      <Link href={`/produto/${item.id}`} className="hover:text-accent">{item.name}</Link>
                    </h2>
                    <p className="tabular-nums">
                      <span className="text-lg font-bold text-accent sm:text-xl">{formatPrice(pixPrice(item.price))}</span>
                      <span className="ml-1 text-xs font-semibold uppercase text-ink">no Pix</span>
                    </p>
                    <p className="text-xs text-ink-soft tabular-nums">{formatPrice(item.price)} no cartão</p>
                  </div>

                  <div className="flex flex-shrink-0 flex-col items-end justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="flex h-11 w-11 items-center justify-center rounded-md text-ink-soft transition hover:bg-paper hover:text-accent"
                      aria-label={`Remover ${item.name}`}
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="flex items-center rounded-md ring-1 ring-line">
                      <button
                        type="button"
                        onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : handleRemove(item)}
                        className="flex h-11 w-11 items-center justify-center text-ink transition hover:text-accent"
                        aria-label={`Diminuir quantidade de ${item.name}`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-7 text-center font-bold tabular-nums" aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-11 w-11 items-center justify-center text-ink transition hover:text-accent"
                        aria-label={`Aumentar quantidade de ${item.name}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="lg:col-span-1">
              <div className="rounded-xl bg-white p-5 ring-1 ring-line sm:p-6 lg:sticky lg:top-32">
                <h2 className="mb-5 text-xl font-semibold uppercase text-ink">Resumo</h2>

                <dl className="space-y-2.5 text-sm tabular-nums">
                  <div className="flex justify-between gap-2 text-ink-soft">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-ink">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between gap-2 text-ink-soft">
                    <dt>Frete</dt>
                    <dd className="font-semibold text-ink">{freeShipping ? 'Grátis' : `${formatPrice(shipping)}*`}</dd>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between gap-2 text-ink-soft">
                      <dt>Desconto Pix ({Math.round(paymentTerms.pixDiscount * 100)}%)</dt>
                      <dd className="font-semibold text-primary">− {formatPrice(savings)}</dd>
                    </div>
                  )}
                </dl>
                {!freeShipping && (
                  <p className="mt-3 rounded-md bg-cream p-2.5 text-xs text-ink">
                    Faltam <strong>{formatPrice(paymentTerms.freeShippingFrom - subtotal)}</strong> para o frete grátis.
                    <span className="block text-ink-soft">*Valor estimado; confirmamos pelo seu CEP.</span>
                  </p>
                )}

                <div className="mt-5 border-t border-line pt-4 tabular-nums">
                  <p className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold uppercase text-ink">Total no Pix</span>
                    <span className="text-3xl font-bold text-accent">{formatPrice(totalPix)}</span>
                  </p>
                  <p className="mt-1 text-right text-xs text-ink-soft">
                    ou {formatPrice(total)} em até {installments}x de {formatPrice(total / installments)} sem juros
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-md bg-[#167a42] text-base font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#11643a]"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Finalizar no WhatsApp
                </button>

                <ol className="mt-6 space-y-3 border-t border-line pt-5">
                  {steps.map((step, i) => (
                    <li key={step.title} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cream text-xs font-bold text-ink">{i + 1}</span>
                      <span>
                        <strong className="block text-ink">{step.title}</strong>
                        <span className="text-ink-soft">{step.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 text-xs text-ink-soft">Atendimento {contactInfo.hours}.</p>

                <Link href="/" className="mt-5 block text-center text-sm font-semibold text-accent hover:underline">
                  Continuar comprando
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
