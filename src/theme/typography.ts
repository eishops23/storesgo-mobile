import { Platform, TextStyle } from 'react-native';

/**
 * StoresGo Typography System
 */

const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semibold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
});

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,

  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: -0.1,
  } as TextStyle,

  h5: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,

  h6: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  } as TextStyle,

  // Body text
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  } as TextStyle,

  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,

  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,

  // Labels and captions
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  } as TextStyle,

  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  } as TextStyle,

  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  } as TextStyle,

  // Button text
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.2,
  } as TextStyle,

  buttonSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  } as TextStyle,

  // Price text
  price: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
  } as TextStyle,

  priceSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  } as TextStyle,

  priceLarge: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  } as TextStyle,
};

export type Typography = typeof typography;
