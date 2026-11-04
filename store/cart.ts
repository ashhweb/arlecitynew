import { create } from "zustand";

/**
 * Cart store – UI shell only for now. Extend `CartItem`, `add`, `remove`
 * when real commerce logic is built; the UI already reads from here.
 */
export interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "quantity">) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  add: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === item.id);
      return {
        items: existing
          ? s.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...s.items, { ...item, quantity: 1 }],
      };
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
}));

export const selectCartCount = (s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
