import { create } from "zustand";
import type { Product } from "@/api/products";

type CartItem = { product: Product; quantity: number };

type CartState = {
  items: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  inc: (productId: number) => void;
  dec: (productId: number) => void;
  total: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  add: (product, qty = 1) =>
    set((s) => {
      const idx = s.items.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        const copy = [...s.items];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return { items: copy };
      }
      return { items: [...s.items, { product, quantity: qty }] };
    }),

  remove: (productId) =>
    set((s) => ({ items: s.items.filter((i) => i.product.id !== productId) })),

  clear: () => set({ items: [] }),

  inc: (productId) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    })),

  dec: (productId) =>
    set((s) => ({
      items: s.items
        .map((i) =>
          i.product.id === productId
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i
        )
        .filter((i) => i.quantity > 0),
    })),

  total: () => {
    const sum = get().items.reduce((acc, i) => {
      const fp = Number(i.product.final_price || i.product.price);
      return acc + fp * i.quantity;
    }, 0);
    return Number.isFinite(sum) ? sum : 0;
  },
}));