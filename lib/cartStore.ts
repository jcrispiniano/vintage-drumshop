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
}

interface CartStore {
  cartItems: CartItem[];
  favorites: number[];
  toastMessage: string | null;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
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
        const existing = get().cartItems.find(i => i.id === item.id);
        if (existing) {
          set(state => ({
            cartItems: state.cartItems.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            toastMessage: `${item.name} - Quantidade atualizada!`,
          }));
        } else {
          set(state => ({
            cartItems: [...state.cartItems, { ...item, quantity: 1 }],
            toastMessage: `${item.name} adicionado ao carrinho!`,
          }));
        }
      },

      removeFromCart: (id) => {
        set(state => ({ cartItems: state.cartItems.filter(item => item.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeFromCart(id);
          return;
        }
        set(state => ({
          cartItems: state.cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
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
