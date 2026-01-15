import { create } from 'zustand';
import { cartApi, Cart, CartItem } from '@/api';

interface CartState {
  cart: Cart | null;
  itemCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => Promise<void>;
  refreshItemCount: () => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  itemCount: 0,
  isLoading: false,
  error: null,

  loadCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartApi.getCart();
      set({
        cart,
        itemCount: cart.itemCount,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to load cart';
      set({ error: message, isLoading: false });
    }
  },

  addItem: async (productId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartApi.addItem({ productId, quantity });
      set({
        cart,
        itemCount: cart.itemCount,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add item';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartApi.updateItem(itemId, { quantity });
      set({
        cart,
        itemCount: cart.itemCount,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update item';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartApi.removeItem(itemId);
      set({
        cart,
        itemCount: cart.itemCount,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove item';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartApi.clearCart();
      set({
        cart,
        itemCount: 0,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  applyPromoCode: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const result = await cartApi.applyPromoCode(code);
      set({
        cart: result,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid promo code';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  removePromoCode: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartApi.removePromoCode();
      set({
        cart,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove promo code';
      set({ error: message, isLoading: false });
    }
  },

  refreshItemCount: async () => {
    try {
      const count = await cartApi.getItemCount();
      set({ itemCount: count });
    } catch (error) {
      // Silently fail - non-critical
    }
  },

  clearError: () => set({ error: null }),
}));
