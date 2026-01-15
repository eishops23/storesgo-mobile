import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// Main Tab Navigator
export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  CartTab: undefined;
  OrdersTab: undefined;
  AccountTab: undefined;
};

// Home Stack
export type HomeStackParamList = {
  Home: undefined;
  ProductDetails: { productId: string };
  Category: { categorySlug: string; categoryName: string };
  Seller: { sellerId: string; sellerName: string };
};

// Search Stack
export type SearchStackParamList = {
  Search: { initialQuery?: string };
  SearchResults: { query: string };
  ProductDetails: { productId: string };
};

// Cart Stack
export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
  AddAddress: undefined;
  SelectAddress: undefined;
  Payment: undefined;
  OrderConfirmation: { orderId: string };
};

// Orders Stack
export type OrdersStackParamList = {
  OrdersList: undefined;
  OrderDetails: { orderId: string };
  TrackOrder: { orderId: string };
};

// Account Stack
export type AccountStackParamList = {
  Account: undefined;
  Profile: undefined;
  Addresses: undefined;
  AddAddress: undefined;
  EditAddress: { addressId: string };
  PaymentMethods: undefined;
  Settings: undefined;
  Help: undefined;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Screen props helpers
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type HomeScreenProps<T extends keyof HomeStackParamList> = NativeStackScreenProps<
  HomeStackParamList,
  T
>;

export type SearchScreenProps<T extends keyof SearchStackParamList> = NativeStackScreenProps<
  SearchStackParamList,
  T
>;

export type CartScreenProps<T extends keyof CartStackParamList> = NativeStackScreenProps<
  CartStackParamList,
  T
>;

export type OrdersScreenProps<T extends keyof OrdersStackParamList> = NativeStackScreenProps<
  OrdersStackParamList,
  T
>;

export type AccountScreenProps<T extends keyof AccountStackParamList> = NativeStackScreenProps<
  AccountStackParamList,
  T
>;
