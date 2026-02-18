'use client';

import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export default function CarrinhoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-accent transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Carrinho de Compras</h1>
          </div>
        </div>
      </header>

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
                <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex gap-6">
                    {/* Imagem Placeholder */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="text-gray-300" size={32} />
                    </div>

                    {/* Detalhes */}
                    <div className="flex-1">
                      <p className="text-xs text-accent font-bold uppercase mb-1">
                        {item.category}
                      </p>
                      <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                      <p className="text-2xl font-bold text-accent">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantidade e Remover */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition p-2"
                      >
                        <Trash2 size={20} />
                      </button>

                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:text-accent transition"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:text-accent transition"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Frete</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'GRÁTIS' : formatPrice(shipping)}
                    </span>
                  </div>
                  {subtotal < 199 && (
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      💡 Falta {formatPrice(199 - subtotal)} para frete grátis!
                    </p>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-accent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-accent text-white py-4 rounded-lg font-bold hover:bg-secondary transition shadow-lg mb-3">
                  Finalizar Compra
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
