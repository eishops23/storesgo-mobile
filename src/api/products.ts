import apiClient from './client';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  sellerId: string;
  sellerName: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  inStock: boolean;
  stockQuantity?: number;
  isAlcohol?: boolean;
  isCold?: boolean;
  nutritionFacts?: Record<string, any>;
  ingredients?: string;
  brand?: string;
  countryOfOrigin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchParams {
  query?: string;
  category?: string;
  sellerId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'createdAt' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export const productsApi = {
  /**
   * Search products using Meilisearch
   */
  async search(params: SearchParams): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>('/products/search', {
      params,
    });
    return response.data;
  },

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Get products by category
   */
  async getByCategory(categorySlug: string, params?: Omit<SearchParams, 'category'>): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>('/products', {
      params: {
        category: categorySlug,
        ...params,
      },
    });
    return response.data;
  },

  /**
   * Get featured/popular products
   */
  async getFeatured(limit: number = 10): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products/featured', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get products on sale
   */
  async getOnSale(limit: number = 20): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/products/on-sale', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await apiClient.get<Category>(`/categories/${slug}`);
    return response.data;
  },

  /**
   * Get products by seller
   */
  async getBySeller(sellerId: string, params?: SearchParams): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>('/products', {
      params: {
        sellerId,
        ...params,
      },
    });
    return response.data;
  },

  /**
   * Get related products
   */
  async getRelated(productId: string, limit: number = 8): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`/products/${productId}/related`, {
      params: { limit },
    });
    return response.data;
  },
};
