'use client';
import { useState } from 'react';

import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { contactInfo } from '@/lib/products';
import Header from '@/components/Header';

export default function CarrinhoPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleUpdateQuantity = (id: number, delta: number) => {
    const item = cartItems.find(i => i.id === id);
    if (item) {
      updateQuantity(id, item.quantity + delta);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 199 ? 0 : 29.90;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Monta a mensagem do WhatsApp
    let message = '🛒 *Pedido - Vintage Drum Shop*\n\n';
    
    // Lista os produtos
    cartItems.forEach(item => {
      message += `*${item.quantity}x* ${item.name}\n`;
      message += `${formatPrice(item.price)} cada\n`;
      message += `Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    // Totais
    message += '━━━━━━━━━━━━━━━\n';
    message += `*Subtotal:* ${formatPrice(subtotal)}\n`;
    message += `*Frete:* ${shipping === 0 ? 'GRÁTIS 🎉' : formatPrice(shipping)}\n`;
    message += `*TOTAL:* ${formatPrice(total)}\n\n`;
    message += '💬 Gostaria de finalizar este pedido!';
    
    // Codifica a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Monta o link do WhatsApp
    const whatsappUrl = `https://wa.me/5511947397347?text=${encodedMessage}`;
    
    // Abre o WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}

      <Header />

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          /* Estado Vazio */
          <div className="max-w-md mx-auto text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full">
                  <ShoppingCart size={64} className="text-gray-300" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Este carrinho está vazio.
              </h2>
              <p className="text-gray-600 mb-8">
                Adicione produtos ao seu carrinho para continuar comprando
              </p>
              <Link
                href="/"
                className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        ) : (
          /* Estado com Itens */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de Produtos */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-3 sm:p-6">
                  <div className="flex gap-3 sm:gap-6">
                    {/* Imagem */}
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1 sm:p-2"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.style.display = 'none';
                            const fallback = img.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`${item.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center`}
                      >
                        <ShoppingCart className="text-gray-300" size={28} />
                      </div>
                    </div>

                    {/* Detalhes */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs text-accent font-bold uppercase mb-1">
                        {item.category}
                      </p>
                      <h3 className="font-bold text-sm sm:text-lg mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-lg sm:text-2xl font-bold text-accent">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantidade e Remover */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition p-1.5 sm:p-2"
                        aria-label="Remover item"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="p-1.5 sm:p-2 hover:text-accent transition"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold w-6 sm:w-8 text-center text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="p-1.5 sm:p-2 hover:text-accent transition"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Resumo do Pedido</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between gap-2 text-gray-600 text-sm sm:text-base">
                    <span>Subtotal</span>
                    <span className="font-semibold whitespace-nowrap">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-2 text-gray-600 text-sm sm:text-base">
                    <span>Frete</span>
                    <span className="font-semibold whitespace-nowrap">
                      {shipping === 0 ? 'GRÁTIS' : formatPrice(shipping)}
                    </span>
                  </div>
                  {subtotal < 199 && (
                    <p className="text-xs text-gray-500 bg-orange-50 p-2 rounded">
                      💡 Falta {formatPrice(199 - subtotal)} para frete grátis!
                    </p>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-base sm:text-lg font-bold">Total</span>
                    <span className="text-xl sm:text-2xl font-bold text-accent whitespace-nowrap">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-4 rounded-lg font-bold hover:bg-green-600 transition shadow-lg mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Finalizar no WhatsApp
                </button>
                
                <Link
                  href="/"
                  className="block text-center text-gray-600 hover:text-accent transition"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
