/**
 * StoresGo Analytics Service
 * 
 * Enterprise-grade analytics abstraction layer.
 * Supports multiple analytics providers (Mixpanel, Amplitude, Firebase, etc.)
 * 
 * Usage:
 *   analytics.track('add_to_cart', { productId: '123', price: 9.99 });
 *   analytics.screen('ProductDetails');
 *   analytics.identify('user_123', { email: 'user@example.com' });
 */

import { APP_CONFIG } from '@/config/constants';

// Types
interface AnalyticsProperties {
  [key: string]: string | number | boolean | null | undefined;
}

interface UserTraits {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  createdAt?: string;
  [key: string]: any;
}

interface AnalyticsProvider {
  initialize(): Promise<void>;
  track(event: string, properties?: AnalyticsProperties): void;
  screen(name: string, properties?: AnalyticsProperties): void;
  identify(userId: string, traits?: UserTraits): void;
  reset(): void;
  setUserProperty(name: string, value: string | number | boolean): void;
}

// Console logger for development
class ConsoleAnalytics implements AnalyticsProvider {
  async initialize(): Promise<void> {
    console.log('[Analytics] Initialized (Console Mode)');
  }

  track(event: string, properties?: AnalyticsProperties): void {
    console.log('[Analytics] Track:', event, properties);
  }

  screen(name: string, properties?: AnalyticsProperties): void {
    console.log('[Analytics] Screen:', name, properties);
  }

  identify(userId: string, traits?: UserTraits): void {
    console.log('[Analytics] Identify:', userId, traits);
  }

  reset(): void {
    console.log('[Analytics] Reset');
  }

  setUserProperty(name: string, value: string | number | boolean): void {
    console.log('[Analytics] User Property:', name, value);
  }
}

// Production analytics (stub - implement with actual SDK)
// Example: Mixpanel, Amplitude, Firebase Analytics, etc.
class ProductionAnalytics implements AnalyticsProvider {
  private initialized = false;

  async initialize(): Promise<void> {
    // TODO: Initialize your analytics SDK here
    // Example for Mixpanel:
    // await Mixpanel.init('YOUR_PROJECT_TOKEN');
    
    // Example for Amplitude:
    // await Amplitude.init('YOUR_API_KEY');
    
    // Example for Firebase:
    // await analytics().setAnalyticsCollectionEnabled(true);
    
    this.initialized = true;
  }

  track(event: string, properties?: AnalyticsProperties): void {
    if (!this.initialized) return;
    
    // TODO: Implement with your SDK
    // Mixpanel.track(event, properties);
    // Amplitude.logEvent(event, properties);
    // analytics().logEvent(event, properties);
    
    // Also log to console in dev
    if (__DEV__) {
      console.log('[Analytics] Track:', event, properties);
    }
  }

  screen(name: string, properties?: AnalyticsProperties): void {
    if (!this.initialized) return;
    
    // TODO: Implement with your SDK
    // Mixpanel.track('Screen View', { screen_name: name, ...properties });
    // analytics().logScreenView({ screen_name: name, ...properties });
    
    if (__DEV__) {
      console.log('[Analytics] Screen:', name, properties);
    }
  }

  identify(userId: string, traits?: UserTraits): void {
    if (!this.initialized) return;
    
    // TODO: Implement with your SDK
    // Mixpanel.identify(userId);
    // Mixpanel.getPeople().set(traits);
    // Amplitude.setUserId(userId);
    
    if (__DEV__) {
      console.log('[Analytics] Identify:', userId, traits);
    }
  }

  reset(): void {
    if (!this.initialized) return;
    
    // TODO: Implement with your SDK
    // Mixpanel.reset();
    // Amplitude.clearUserProperties();
    
    if (__DEV__) {
      console.log('[Analytics] Reset');
    }
  }

  setUserProperty(name: string, value: string | number | boolean): void {
    if (!this.initialized) return;
    
    // TODO: Implement with your SDK
    // Mixpanel.getPeople().set(name, value);
    // Amplitude.setUserProperties({ [name]: value });
    
    if (__DEV__) {
      console.log('[Analytics] User Property:', name, value);
    }
  }
}

// Analytics Manager - main class
class AnalyticsManager {
  private provider: AnalyticsProvider;
  private superProperties: AnalyticsProperties = {};

  constructor() {
    // Use console logger in dev, production analytics otherwise
    this.provider = __DEV__ ? new ConsoleAnalytics() : new ProductionAnalytics();
  }

  async initialize(): Promise<void> {
    await this.provider.initialize();
    
    // Set default super properties
    this.superProperties = {
      app_version: APP_CONFIG.APP_VERSION,
      platform: 'mobile',
    };
  }

  // Set properties that will be included with every event
  setSuperProperties(properties: AnalyticsProperties): void {
    this.superProperties = { ...this.superProperties, ...properties };
  }

  // Track a custom event
  track(event: string, properties?: AnalyticsProperties): void {
    this.provider.track(event, {
      ...this.superProperties,
      ...properties,
      timestamp: new Date().toISOString(),
    });
  }

  // Track screen view
  screen(name: string, properties?: AnalyticsProperties): void {
    this.provider.screen(name, {
      ...this.superProperties,
      ...properties,
    });
  }

  // Identify user
  identify(userId: string, traits?: UserTraits): void {
    this.provider.identify(userId, traits);
    this.setSuperProperties({ user_id: userId });
  }

  // Reset (on logout)
  reset(): void {
    this.provider.reset();
    this.superProperties = {
      app_version: APP_CONFIG.APP_VERSION,
      platform: 'mobile',
    };
  }

  // Set user property
  setUserProperty(name: string, value: string | number | boolean): void {
    this.provider.setUserProperty(name, value);
  }

  // Pre-defined event helpers for type safety
  events = {
    // Auth events
    login: (method: string) => this.track(APP_CONFIG.ANALYTICS_EVENTS.LOGIN, { method }),
    signup: (method: string) => this.track(APP_CONFIG.ANALYTICS_EVENTS.SIGNUP, { method }),
    logout: () => this.track(APP_CONFIG.ANALYTICS_EVENTS.LOGOUT),

    // Product events
    viewProduct: (productId: string, productName: string, price: number) =>
      this.track(APP_CONFIG.ANALYTICS_EVENTS.PRODUCT_VIEW, { productId, productName, price }),
    
    search: (query: string, resultsCount: number) =>
      this.track(APP_CONFIG.ANALYTICS_EVENTS.PRODUCT_SEARCH, { query, resultsCount }),

    // Cart events
    addToCart: (productId: string, productName: string, price: number, quantity: number) =>
      this.track(APP_CONFIG.ANALYTICS_EVENTS.ADD_TO_CART, { productId, productName, price, quantity }),
    
    removeFromCart: (productId: string, productName: string) =>
      this.track(APP_CONFIG.ANALYTICS_EVENTS.REMOVE_FROM_CART, { productId, productName }),

    // Checkout events
    beginCheckout: (cartValue: number, itemCount: number) =>
      this.track(APP_CONFIG.ANALYTICS_EVENTS.BEGIN_CHECKOUT, { cartValue, itemCount }),
    
    addPaymentInfo: (paymentMethod: string) =>
      this.track(APP_CONFIG.ANALYTICS_EVENTS.ADD_PAYMENT_INFO, { paymentMethod }),
    
    purchase: (orderId: string, total: number, itemCount: number) =>
      this.track(APP_CONFIG.ANALYTICS_EVENTS.PURCHASE, { orderId, total, itemCount }),
  };
}

// Singleton instance
export const analytics = new AnalyticsManager();

// React hook for screen tracking
export const useScreenTracking = (screenName: string, properties?: AnalyticsProperties) => {
  React.useEffect(() => {
    analytics.screen(screenName, properties);
  }, [screenName]);
};
