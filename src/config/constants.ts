/**
 * StoresGo App Configuration
 * Enterprise-grade constants and settings
 */

export const APP_CONFIG = {
  // App Info
  APP_NAME: 'StoresGo',
  APP_VERSION: '1.0.0',
  BUILD_NUMBER: 1,
  
  // API Configuration
  API_BASE_URL: __DEV__ 
    ? 'https://storesgo.com/api' // Use same URL for dev, change if needed
    : 'https://storesgo.com/api',
  API_TIMEOUT: 15000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  PRODUCTS_PER_PAGE: 20,
  ORDERS_PER_PAGE: 10,
  
  // Cache TTL (in milliseconds)
  CACHE_TTL: {
    PRODUCTS: 5 * 60 * 1000,      // 5 minutes
    CATEGORIES: 30 * 60 * 1000,   // 30 minutes
    USER_PROFILE: 10 * 60 * 1000, // 10 minutes
    CART: 1 * 60 * 1000,          // 1 minute
  },
  
  // Retry Configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  
  // Image Configuration
  IMAGE_QUALITY: 80,
  THUMBNAIL_SIZE: 200,
  FULL_IMAGE_SIZE: 800,
  
  // Search Configuration
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_RECENT_SEARCHES: 10,
  
  // Cart Configuration
  MAX_QUANTITY_PER_ITEM: 99,
  CART_SYNC_INTERVAL: 30000, // 30 seconds
  
  // Location
  DEFAULT_LOCATION: {
    latitude: 25.7617,  // Miami
    longitude: -80.1918,
  },
  DELIVERY_RADIUS_MILES: 30,
  
  // Feature Flags (can be controlled remotely)
  FEATURES: {
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_BIOMETRIC_AUTH: true,
    ENABLE_APPLE_PAY: true,
    ENABLE_GOOGLE_PAY: true,
    ENABLE_DARK_MODE: false, // Coming soon
    ENABLE_REORDER: true,
    ENABLE_ORDER_TRACKING: true,
    ENABLE_REVIEWS: false, // Coming soon
  },
  
  // Analytics Events
  ANALYTICS_EVENTS: {
    // Screen Views
    SCREEN_VIEW: 'screen_view',
    
    // Auth
    LOGIN: 'login',
    SIGNUP: 'signup',
    LOGOUT: 'logout',
    
    // Products
    PRODUCT_VIEW: 'product_view',
    PRODUCT_SEARCH: 'product_search',
    ADD_TO_CART: 'add_to_cart',
    REMOVE_FROM_CART: 'remove_from_cart',
    
    // Checkout
    BEGIN_CHECKOUT: 'begin_checkout',
    ADD_PAYMENT_INFO: 'add_payment_info',
    PURCHASE: 'purchase',
    
    // Engagement
    SHARE: 'share',
    ADD_TO_WISHLIST: 'add_to_wishlist',
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
    SERVER_ERROR: 'Something went wrong. Please try again.',
    AUTH_ERROR: 'Your session has expired. Please log in again.',
    CART_ERROR: 'Unable to update cart. Please try again.',
    PAYMENT_ERROR: 'Payment failed. Please try a different method.',
    LOCATION_ERROR: 'Unable to get your location. Please enable location services.',
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@storesgo_auth_token',
  REFRESH_TOKEN: '@storesgo_refresh_token',
  USER_DATA: '@storesgo_user_data',
  CART_DATA: '@storesgo_cart_data',
  RECENT_SEARCHES: '@storesgo_recent_searches',
  SAVED_ADDRESSES: '@storesgo_saved_addresses',
  SELECTED_ADDRESS: '@storesgo_selected_address',
  PUSH_TOKEN: '@storesgo_push_token',
  ONBOARDING_COMPLETE: '@storesgo_onboarding_complete',
  THEME_PREFERENCE: '@storesgo_theme_preference',
  LAST_SYNC: '@storesgo_last_sync',
};

export const DEEP_LINK_PREFIXES = [
  'storesgo://',
  'https://storesgo.com',
  'https://www.storesgo.com',
];
