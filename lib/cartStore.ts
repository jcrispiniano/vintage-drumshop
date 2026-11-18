import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
  description?: string;
  variant?: string; // ex.: "Acabamento #228 Solid Yellow" (baterias com várias cores)
}

/** Mesmo produto em cores diferentes vira itens separados no carrinho */
const same = (a: { id: number; variant?: string }, id: number, variant?: string) =>
  a.id === id && (a.variant ?? '') === (variant ?? '');

interface CartStore {
  cartItems: CartItem[];
  favorites: number[];
  toastMessage: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number, variant?: string) => void;
  updateQuantity: (id: number, quantity: number, variant?: string) => void;
  toggleFavorite: (id: number) => void;
  clearCart: () => void;
  setToastMessage: (msg: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      favorites: [],
      toastMessage: null,

      addToCart: (item) => {
        const existing = get().cartItems.find(i => same(i, item.id, item.variant));
        if (existing) {
          set(state => ({
            cartItems: state.cartItems.map(i =>
              same(i, item.id, item.variant) ? { ...i, quantity: i.quantity + 1 } : i
            ),
            toastMessage: `Quantidade atualizada|${item.name}${item.variant ? ` · ${item.variant}` : ''}`,
          }));
        } else {
          set(state => ({
            cartItems: [...state.cartItems, { ...item, quantity: 1 }],
            toastMessage: `Adicionado ao carrinho|${item.name}${item.variant ? ` · ${item.variant}` : ''}`,
          }));
        }
      },

      removeFromCart: (id, variant) => {
        set(state => ({ cartItems: state.cartItems.filter(item => !same(item, id, variant)) }));
      },

      updateQuantity: (id, quantity, variant) => {
        if (quantity < 1) {
          get().removeFromCart(id, variant);
          return;
        }
        set(state => ({
          cartItems: state.cartItems.map(item =>
            same(item, id, variant) ? { ...item, quantity } : item
          ),
        }));
      },

      toggleFavorite: (id) => {
        set(state => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter(fav => fav !== id)
            : [...state.favorites, id],
        }));
      },

      clearCart: () => set({ cartItems: [] }),

      setToastMessage: (msg) => set({ toastMessage: msg }),
    }),
    {
      name: 'vintage-drum-cart',
      partialize: (state) => ({ cartItems: state.cartItems, favorites: state.favorites }),
    }
  )
);
