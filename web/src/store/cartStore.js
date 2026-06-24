import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  
  addToCart: (product) => set((state) => {
    const existingItem = state.items.find(item => item.id === product.id);
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };
    }
    return {
      items: [...state.items, { ...product, quantity: 1 }]
    };
  }),

  removeFromCart: (productId) => set((state) => ({
    items: state.items.filter(item => item.id !== productId)
  })),

  increaseQty: (productId) => set((state) => ({
    items: state.items.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  })),

  decreaseQty: (productId) => set((state) => {
    const item = state.items.find(i => i.id === productId);
    if (item?.quantity === 1) {
      return {
        items: state.items.filter(i => i.id !== productId)
      };
    }
    return {
      items: state.items.map(i =>
        i.id === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    };
  }),

  clearCart: () => set({ items: [] }),

  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getSubtotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
}));
