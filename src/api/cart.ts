import apiClient from './client';
import { Product } from './products';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  sellerId?: string;
  sellerName?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartApi = {
  /**
   * Get current cart
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>('/cart');
    return response.data;
  },

  /**
   * Add item to cart
   */
  async addItem(data: AddToCartRequest): Promise<Cart> {
    const response = await apiClient.post<Cart>('/cart/items', data);
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  async updateItem(itemId: string, data: UpdateCartItemRequest): Promise<Cart> {
    const response = await apiClient.put<Cart>(`/cart/items/${itemId}`, data);
    return response.data;
  },

  /**
   * Remove item from cart
   */
  async removeItem(itemId: string): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<Cart> {
    const response = await apiClient.delete<Cart>('/cart');
    return response.data;
  },

  /**
   * Get cart item count (for badge)
   */
  async getItemCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>('/cart/count');
    return response.data.count;
  },

  /**
   * Apply promo code
   */
  async applyPromoCode(code: string): Promise<Cart & { discount: number }> {
    const response = await apiClient.post('/cart/promo', { code });
    return response.data;
  },

  /**
   * Remove promo code
   */
  async removePromoCode(): Promise<Cart> {
    const response = await apiClient.delete('/cart/promo');
    return response.data;
  },
};
