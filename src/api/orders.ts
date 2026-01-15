import apiClient from './client';
import { CartItem } from './cart';

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface OrderItem extends CartItem {
  orderId: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethodId: string;
  notes?: string;
  ageVerified?: boolean; // For alcohol orders
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const ordersApi = {
  /**
   * Create a new order from cart
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  /**
   * Get user's orders
   */
  async getOrders(page: number = 1, limit: number = 10): Promise<OrdersResponse> {
    const response = await apiClient.get<OrdersResponse>('/orders', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get order by ID
   */
  async getById(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Get order by order number
   */
  async getByOrderNumber(orderNumber: string): Promise<Order> {
    const response = await apiClient.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    const response = await apiClient.post<Order>(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  /**
   * Track order shipment
   */
  async trackOrder(orderId: string): Promise<{
    status: string;
    trackingNumber?: string;
    trackingUrl?: string;
    events: Array<{
      date: string;
      description: string;
      location?: string;
    }>;
  }> {
    const response = await apiClient.get(`/orders/${orderId}/track`);
    return response.data;
  },

  /**
   * Reorder (add all items from previous order to cart)
   */
  async reorder(orderId: string): Promise<{ message: string }> {
    const response = await apiClient.post(`/orders/${orderId}/reorder`);
    return response.data;
  },
};

// Address management API
export const addressApi = {
  /**
   * Get user's saved addresses
   */
  async getAddresses(): Promise<Address[]> {
    const response = await apiClient.get<Address[]>('/addresses');
    return response.data;
  },

  /**
   * Add a new address
   */
  async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const response = await apiClient.post<Address>('/addresses', address);
    return response.data;
  },

  /**
   * Update an address
   */
  async updateAddress(addressId: string, address: Partial<Address>): Promise<Address> {
    const response = await apiClient.put<Address>(`/addresses/${addressId}`, address);
    return response.data;
  },

  /**
   * Delete an address
   */
  async deleteAddress(addressId: string): Promise<void> {
    await apiClient.delete(`/addresses/${addressId}`);
  },

  /**
   * Set default address
   */
  async setDefaultAddress(addressId: string): Promise<Address> {
    const response = await apiClient.post<Address>(`/addresses/${addressId}/default`);
    return response.data;
  },

  /**
   * Validate address (uses Google Address API)
   */
  async validateAddress(address: Omit<Address, 'id'>): Promise<{
    valid: boolean;
    suggestions?: Address[];
  }> {
    const response = await apiClient.post('/addresses/validate', address);
    return response.data;
  },
};
