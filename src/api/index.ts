export { default as apiClient, tokenManager } from './client';
export { authApi } from './auth';
export { productsApi } from './products';
export { cartApi } from './cart';
export { ordersApi, addressApi } from './orders';

// Re-export types
export type { LoginRequest, RegisterRequest, AuthResponse, User } from './auth';
export type { Product, Category, ProductsResponse, SearchParams } from './products';
export type { CartItem, Cart, AddToCartRequest, UpdateCartItemRequest } from './cart';
export type { Address, Order, OrderItem, CreateOrderRequest, OrdersResponse } from './orders';
