import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { View, Text, StyleSheet } from 'react-native';

import { colors, typography } from '@/theme';
import { useAuthStore, useCartStore } from '@/store';

// Import types
import {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
  HomeStackParamList,
  SearchStackParamList,
  CartStackParamList,
  OrdersStackParamList,
  AccountStackParamList,
} from './types';

// Placeholder screens (we'll build these out)
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{name}</Text>
  </View>
);

// Auth Screens
const LoginScreen = () => <PlaceholderScreen name="Login" />;
const RegisterScreen = () => <PlaceholderScreen name="Register" />;
const ForgotPasswordScreen = () => <PlaceholderScreen name="Forgot Password" />;

// Main Screens
const HomeScreen = () => <PlaceholderScreen name="Home" />;
const SearchScreen = () => <PlaceholderScreen name="Search" />;
const CartScreen = () => <PlaceholderScreen name="Cart" />;
const OrdersScreen = () => <PlaceholderScreen name="Orders" />;
const AccountScreen = () => <PlaceholderScreen name="Account" />;
const ProductDetailsScreen = () => <PlaceholderScreen name="Product Details" />;

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const CartStack = createNativeStackNavigator<CartStackParamList>();
const OrdersStack = createNativeStackNavigator<OrdersStackParamList>();
const AccountStack = createNativeStackNavigator<AccountStackParamList>();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

// Home Stack Navigator
const HomeStackNavigator = () => (
  <HomeStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </HomeStack.Navigator>
);

// Search Stack Navigator
const SearchStackNavigator = () => (
  <SearchStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <SearchStack.Screen name="Search" component={SearchScreen} />
    <SearchStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </SearchStack.Navigator>
);

// Cart Stack Navigator
const CartStackNavigator = () => (
  <CartStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <CartStack.Screen name="Cart" component={CartScreen} />
  </CartStack.Navigator>
);

// Orders Stack Navigator
const OrdersStackNavigator = () => (
  <OrdersStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <OrdersStack.Screen name="OrdersList" component={OrdersScreen} />
  </OrdersStack.Navigator>
);

// Account Stack Navigator
const AccountStackNavigator = () => (
  <AccountStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AccountStack.Screen name="Account" component={AccountScreen} />
  </AccountStack.Navigator>
);

// Cart Badge Component
const CartBadge = () => {
  const itemCount = useCartStore((state) => state.itemCount);

  if (itemCount === 0) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
    </View>
  );
};

// Main Tab Navigator
const MainNavigator = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary.main,
      tabBarInactiveTintColor: colors.neutral.gray400,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarIcon: ({ color, size }) => {
        let iconName: string;

        switch (route.name) {
          case 'HomeTab':
            iconName = 'home';
            break;
          case 'SearchTab':
            iconName = 'search';
            break;
          case 'CartTab':
            iconName = 'shopping-cart';
            break;
          case 'OrdersTab':
            iconName = 'package';
            break;
          case 'AccountTab':
            iconName = 'user';
            break;
          default:
            iconName = 'circle';
        }

        return (
          <View>
            <Icon name={iconName} size={size} color={color} />
            {route.name === 'CartTab' && <CartBadge />}
          </View>
        );
      },
    })}
  >
    <MainTab.Screen
      name="HomeTab"
      component={HomeStackNavigator}
      options={{ tabBarLabel: 'Home' }}
    />
    <MainTab.Screen
      name="SearchTab"
      component={SearchStackNavigator}
      options={{ tabBarLabel: 'Search' }}
    />
    <MainTab.Screen
      name="CartTab"
      component={CartStackNavigator}
      options={{ tabBarLabel: 'Cart' }}
    />
    <MainTab.Screen
      name="OrdersTab"
      component={OrdersStackNavigator}
      options={{ tabBarLabel: 'Orders' }}
    />
    <MainTab.Screen
      name="AccountTab"
      component={AccountStackNavigator}
      options={{ tabBarLabel: 'Account' }}
    />
  </MainTab.Navigator>
);

// Root Navigator
export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  placeholderText: {
    ...typography.h3,
    color: colors.text.secondary,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  tabBar: {
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
  },
  tabBarLabel: {
    ...typography.caption,
    marginTop: 2,
  },
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.neutral.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
