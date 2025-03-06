import { create } from "zustand";
import { Order } from '../Api/OrderApi'

interface OrderStore {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  updateOrderStatusLocal: (id: number, status: string) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  updateOrderStatusLocal: (id, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
      ),
    })),
}));
