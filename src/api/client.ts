import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { APP_CONFIG, STORAGE_KEYS } from '@/config/constants';

// Types
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface QueuedRequest {
  config: InternalAxiosRequestConfig;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

// Cache manager for offline support
class CacheManager {
  private memoryCache: Map<string, CacheEntry> = new Map();

  async get(key: string): Promise<any | null> {
    // Check memory cache first
    const memEntry = this.memoryCache.get(key);
    if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttl) {
      return memEntry.data;
    }

    // Check persistent storage
    try {
      const stored = await AsyncStorage.getItem(`cache_${key}`);
      if (stored) {
        const entry: CacheEntry = JSON.parse(stored);
        if (Date.now() - entry.timestamp < entry.ttl) {
          // Restore to memory cache
          this.memoryCache.set(key, entry);
          return entry.data;
        } else {
          // Expired, clean up
          await AsyncStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }
    return null;
  }

  async set(key: string, data: any, ttl: number): Promise<void> {
    const entry: CacheEntry = { data, timestamp: Date.now(), ttl };
    
    // Store in memory
    this.memoryCache.set(key, entry);
    
    // Store persistently for offline
    try {
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    // Clear from memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // Clear from storage
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(k => k.startsWith('cache_') && k.includes(pattern));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('Cache invalidation error:', error);
    }
  }

  clearAll(): void {
    this.memoryCache.clear();
  }
}

// Request queue for offline support
class RequestQueue {
  private queue: QueuedRequest[] = [];
  private isProcessing = false;

  add(request: QueuedRequest): void {
    this.queue.push(request);
  }

  async processQueue(client: AxiosInstance): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift();
      if (request) {
        try {
          const response = await client.request(request.config);
          request.resolve(response);
        } catch (error) {
          request.reject(error);
        }
      }
    }

    this.isProcessing = false;
  }

  clear(): void {
    this.queue = [];
  }

  get length(): number {
    return this.queue.length;
  }
}

// Main API Client
class ApiClient {
  private client: AxiosInstance;
  private cache: CacheManager;
  private requestQueue: RequestQueue;
  private isOnline: boolean = true;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.cache = new CacheManager();
    this.requestQueue = new RequestQueue();

    this.client = axios.create({
      baseURL: APP_CONFIG.API_BASE_URL,
      timeout: APP_CONFIG.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client': 'mobile-app',
        'X-Client-Version': APP_CONFIG.APP_VERSION,
      },
    });

    this.setupInterceptors();
    this.setupNetworkListener();
  }

  private setupNetworkListener(): void {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? true;

      // Process queued requests when coming back online
      if (wasOffline && this.isOnline) {
        this.requestQueue.processQueue(this.client);
      }
    });
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Add auth token
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for logging
        (config as any).metadata = { startTime: Date.now() };

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time in dev
        if (__DEV__) {
          const duration = Date.now() - (response.config as any).metadata?.startTime;
          console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 - Token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear auth
            await this.clearAuth();
            throw refreshError;
          }
        }

        // Handle network errors with retry
        if (!error.response && originalRequest._retry !== true) {
          return this.retryWithBackoff(originalRequest);
        }

        throw error;
      }
    );
  }

  private async refreshToken(): Promise<string> {
    // Prevent multiple simultaneous refresh calls
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${APP_CONFIG.API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;

        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        return token;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async retryWithBackoff(
    config: InternalAxiosRequestConfig,
    retryCount: number = 0
  ): Promise<AxiosResponse> {
    if (retryCount >= APP_CONFIG.MAX_RETRIES) {
      throw new Error(APP_CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
    }

    const delay = APP_CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      return await this.client.request(config);
    } catch (error) {
      return this.retryWithBackoff(config, retryCount + 1);
    }
  }

  private async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  }

  // Public methods with caching support
  async get<T>(
    url: string,
    options?: {
      params?: any;
      cache?: boolean;
      cacheTTL?: number;
      forceRefresh?: boolean;
    }
  ): Promise<T> {
    const { params, cache = false, cacheTTL = APP_CONFIG.CACHE_TTL.PRODUCTS, forceRefresh = false } = options || {};
    const cacheKey = `GET_${url}_${JSON.stringify(params || {})}`;

    // Check cache first (unless forcing refresh)
    if (cache && !forceRefresh) {
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return cached as T;
      }
    }

    // Handle offline
    if (!this.isOnline) {
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return cached as T;
      }
      throw new Error(APP_CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
    }

    const response = await this.client.get<T>(url, { params });

    // Cache the response
    if (cache) {
      await this.cache.set(cacheKey, response.data, cacheTTL);
    }

    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    if (!this.isOnline) {
      throw new Error(APP_CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
    }
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    if (!this.isOnline) {
      throw new Error(APP_CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
    }
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    if (!this.isOnline) {
      throw new Error(APP_CONFIG.ERROR_MESSAGES.NETWORK_ERROR);
    }
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // Cache management
  invalidateCache(pattern: string): Promise<void> {
    return this.cache.invalidate(pattern);
  }

  clearCache(): void {
    this.cache.clearAll();
  }

  // Network status
  get isConnected(): boolean {
    return this.isOnline;
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Token management exports (for auth store)
export const tokenManager = {
  async setTokens(token: string, refreshToken: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
    ]);
  },

  async hasToken(): Promise<boolean> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },
};

export default apiClient;
