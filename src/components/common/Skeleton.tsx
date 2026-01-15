import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { colors, borderRadius, spacing } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Base Skeleton component with shimmer animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius: radius = borderRadius.sm,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Product Card Skeleton - matches ProductCard layout
 */
export const ProductCardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const cardWidth = (SCREEN_WIDTH - spacing.screenPadding * 2 - spacing.itemGap) / 2;

  return (
    <View style={[styles.productCard, { width: cardWidth }, style]}>
      <Skeleton
        width="100%"
        height={cardWidth}
        borderRadius={0}
        style={styles.productImage}
      />
      <View style={styles.productContent}>
        <Skeleton width={60} height={12} style={styles.mb4} />
        <Skeleton width="100%" height={16} style={styles.mb4} />
        <Skeleton width="70%" height={16} style={styles.mb8} />
        <View style={styles.priceRow}>
          <Skeleton width={50} height={20} />
          <Skeleton width={36} height={36} borderRadius={18} />
        </View>
      </View>
    </View>
  );
};

/**
 * Product List Skeleton - grid of product cards
 */
export const ProductListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <View style={styles.productGrid}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </View>
  );
};

/**
 * Category Card Skeleton
 */
export const CategoryCardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View style={[styles.categoryCard, style]}>
      <Skeleton width={80} height={80} borderRadius={borderRadius.lg} />
      <Skeleton width={60} height={14} style={styles.mt8} />
    </View>
  );
};

/**
 * Category List Skeleton - horizontal scroll
 */
export const CategoryListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View style={styles.categoryList}>
      {Array.from({ length: count }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </View>
  );
};

/**
 * Cart Item Skeleton
 */
export const CartItemSkeleton: React.FC = () => {
  return (
    <View style={styles.cartItem}>
      <Skeleton width={80} height={80} borderRadius={borderRadius.md} />
      <View style={styles.cartItemContent}>
        <Skeleton width="80%" height={16} style={styles.mb4} />
        <Skeleton width="50%" height={14} style={styles.mb8} />
        <View style={styles.cartItemBottom}>
          <Skeleton width={60} height={18} />
          <Skeleton width={100} height={32} borderRadius={borderRadius.md} />
        </View>
      </View>
    </View>
  );
};

/**
 * Order Card Skeleton
 */
export const OrderCardSkeleton: React.FC = () => {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Skeleton width={100} height={16} />
        <Skeleton width={80} height={24} borderRadius={borderRadius.full} />
      </View>
      <View style={styles.orderItems}>
        <Skeleton width={48} height={48} borderRadius={borderRadius.sm} />
        <Skeleton width={48} height={48} borderRadius={borderRadius.sm} />
        <Skeleton width={48} height={48} borderRadius={borderRadius.sm} />
      </View>
      <View style={styles.orderFooter}>
        <Skeleton width={120} height={14} />
        <Skeleton width={60} height={18} />
      </View>
    </View>
  );
};

/**
 * Search Result Skeleton
 */
export const SearchResultSkeleton: React.FC = () => {
  return (
    <View style={styles.searchResult}>
      <Skeleton width={60} height={60} borderRadius={borderRadius.md} />
      <View style={styles.searchResultContent}>
        <Skeleton width="70%" height={16} style={styles.mb4} />
        <Skeleton width="40%" height={14} />
      </View>
    </View>
  );
};

/**
 * Profile Section Skeleton
 */
export const ProfileSkeleton: React.FC = () => {
  return (
    <View style={styles.profile}>
      <Skeleton width={80} height={80} borderRadius={40} />
      <View style={styles.profileInfo}>
        <Skeleton width={150} height={20} style={styles.mb4} />
        <Skeleton width={200} height={16} />
      </View>
    </View>
  );
};

/**
 * List Item Skeleton (generic)
 */
export const ListItemSkeleton: React.FC = () => {
  return (
    <View style={styles.listItem}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={styles.listItemContent}>
        <Skeleton width="60%" height={16} style={styles.mb4} />
        <Skeleton width="40%" height={14} />
      </View>
      <Skeleton width={24} height={24} />
    </View>
  );
};

/**
 * Banner Skeleton
 */
export const BannerSkeleton: React.FC = () => {
  return (
    <Skeleton
      width="100%"
      height={150}
      borderRadius={borderRadius.lg}
    />
  );
};

/**
 * Home Screen Skeleton - full page
 */
export const HomeScreenSkeleton: React.FC = () => {
  return (
    <View style={styles.homeScreen}>
      {/* Search bar */}
      <Skeleton
        width="100%"
        height={48}
        borderRadius={borderRadius.full}
        style={styles.mb16}
      />
      
      {/* Banner */}
      <BannerSkeleton />
      
      {/* Categories */}
      <View style={styles.section}>
        <Skeleton width={120} height={24} style={styles.mb12} />
        <CategoryListSkeleton count={4} />
      </View>
      
      {/* Featured Products */}
      <View style={styles.section}>
        <Skeleton width={150} height={24} style={styles.mb12} />
        <ProductListSkeleton count={4} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.neutral.gray200,
  },
  
  // Product Card
  productCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.itemGap,
  },
  productImage: {
    aspectRatio: 1,
  },
  productContent: {
    padding: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.itemGap,
  },
  
  // Category
  categoryCard: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  categoryList: {
    flexDirection: 'row',
  },
  
  // Cart Item
  cartItem: {
    flexDirection: 'row',
    padding: spacing.base,
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  cartItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cartItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Order Card
  orderCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  orderItems: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Search Result
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  searchResultContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  
  // Profile
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
  },
  profileInfo: {
    marginLeft: spacing.base,
  },
  
  // List Item
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.neutral.white,
  },
  listItemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  
  // Home Screen
  homeScreen: {
    padding: spacing.screenPadding,
  },
  section: {
    marginTop: spacing.xl,
  },
  
  // Spacing helpers
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mt8: { marginTop: 8 },
});
