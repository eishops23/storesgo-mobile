/**
 * StoresGo Color Palette
 * Matches the web application branding
 */

export const colors = {
  // Primary brand colors
  primary: {
    main: '#2563EB',      // Blue - main brand color
    light: '#3B82F6',
    dark: '#1D4ED8',
    contrast: '#FFFFFF',
  },

  // Secondary colors
  secondary: {
    main: '#10B981',      // Green - success, fresh produce
    light: '#34D399',
    dark: '#059669',
    contrast: '#FFFFFF',
  },

  // Accent colors
  accent: {
    orange: '#F97316',    // Caribbean/Latin vibes
    yellow: '#FBBF24',
    purple: '#8B5CF6',
    pink: '#EC4899',
  },

  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    black: '#000000',
  },

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },

  // Text colors
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
    link: '#2563EB',
  },

  // Border colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },

  // Category colors (for ethnic food categories)
  categories: {
    caribbean: '#F97316',
    latin: '#EF4444',
    asian: '#8B5CF6',
    african: '#059669',
    indian: '#FBBF24',
    mediterranean: '#3B82F6',
  },
};

export type Colors = typeof colors;
