
import { create } from "zustand";

interface CartState {
  cart: any[];
  setCart: (cart: any[]) => void;
  addItem: (item: any) => void;
  updateItem: (cartId: number, products: any[], totals: { total: number; discountedTotal: number }) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  setCart: (cart) => set({ cart }),
  addItem: (item) =>
    set((state) => ({
      cart: [...state.cart, item],
    })),
  updateItem: (cartId, products, totals) =>
    set((state) => ({
      cart: state.cart.map((cart) =>
        cart.id === cartId ? { ...cart, products, ...totals } : cart
      ),
    })),
}));
