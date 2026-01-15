import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Feather';

import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import {
  HomeScreenSkeleton,
  ProductCardSkeleton,
  CategoryCardSkeleton,
  NetworkStatusBar,
  useNetworkStatus,
} from '@/components/common';
import { ProductCard } from '@/components/product';
import { productsApi, Product, Category } from '@/api';
import { useCartStore } from '@/store';
import { useToast } from '@/components/common/Toast';
import { analytics, useScreenTracking } from '@/utils';
import type { HomeScreenProps } from '@/navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const HomeScreen: React.FC<HomeScreenProps<'Home'>> = ({ navigation }) => {
  // Track screen view
  useScreenTracking('Home');

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);

  // Hooks
  const { isOnline } = useNetworkStatus();
  const { addItem } = useCartStore();
  const toast = useToast();

  // Load data
  const loadData = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    
    try {
      const [categoriesData, featured, sales] = await Promise.all([
        productsApi.getCategories(),
        productsApi.getFeatured(10),
        productsApi.getOnSale(10),
      ]);

      setCategories(categoriesData);
      setFeaturedProducts(featured);
      setSaleProducts(sales);
    } catch (error) {
      toast.error('Failed to load', 'Please try again');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData(false);
  }, []);

  // Handlers
  const handleSearch = () => {
    navigation.navigate('SearchTab' as any);
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('Category', {
      categorySlug: category.slug,
      categoryName: category.name,
    });
  };

  const handleProductPress = (product: Product) => {
    analytics.events.viewProduct(product.id, product.name, product.price);
    navigation.navigate('ProductDetails', { productId: product.id });
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addItem(product.id, 1);
      analytics.events.addToCart(product.id, product.name, product.price, 1);
      toast.success('Added to cart', product.name);
    } catch (error: any) {
      toast.error('Failed to add', error.message);
    }
  };

  // Render category item
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryImage}>
        {item.image ? (
          <FastImage
            source={{ uri: item.image }}
            style={styles.categoryImageInner}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <Icon name="grid" size={32} color={colors.neutral.gray400} />
        )}
      </View>
      <Text style={styles.categoryName} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <NetworkStatusBar />
        <HomeScreenSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NetworkStatusBar />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.main}
            colors={[colors.primary.main]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.deliverTo}>Deliver to</Text>
            <TouchableOpacity style={styles.addressButton}>
              <Icon name="map-pin" size={16} color={colors.primary.main} />
              <Text style={styles.address} numberOfLines={1}>
                Palm Springs, FL
              </Text>
              <Icon name="chevron-down" size={16} color={colors.neutral.gray500} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="bell" size={24} color={colors.neutral.gray700} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Icon name="search" size={20} color={colors.neutral.gray400} />
          <Text style={styles.searchPlaceholder}>Search products...</Text>
        </TouchableOpacity>

        {/* Promotional Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Fresh Caribbean & Latin Groceries</Text>
            <Text style={styles.bannerSubtitle}>Delivered to your door</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bannerImage}>
            <Icon name="truck" size={48} color={colors.neutral.white} />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories.slice(0, 8)}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Items</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => handleProductPress(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </View>
        </View>

        {/* On Sale */}
        {saleProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.saleTitleContainer}>
                <Icon name="tag" size={20} color={colors.error} />
                <Text style={styles.sectionTitle}>On Sale</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={saleProducts}
              renderItem={({ item }) => (
                <View style={styles.horizontalProductCard}>
                  <ProductCard
                    product={item}
                    onPress={() => handleProductPress(item)}
                    onAddToCart={() => handleAddToCart(item)}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Spacer for tab bar */}
        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  deliverTo: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  address: {
    ...typography.label,
    color: colors.text.primary,
    maxWidth: 200,
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray100,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  searchPlaceholder: {
    ...typography.body,
    color: colors.neutral.gray400,
  },

  // Banner
  banner: {
    flexDirection: 'row',
    backgroundColor: colors.primary.main,
    marginHorizontal: spacing.base,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    ...typography.h4,
    color: colors.neutral.white,
    marginBottom: spacing.xs,
  },
  bannerSubtitle: {
    ...typography.bodySmall,
    color: colors.neutral.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  bannerButtonText: {
    ...typography.label,
    color: colors.primary.main,
  },
  bannerImage: {
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.text.primary,
  },
  saleTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  seeAll: {
    ...typography.label,
    color: colors.primary.main,
  },

  // Categories
  categoriesList: {
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    width: 80,
  },
  categoryImage: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  categoryImageInner: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    ...typography.labelSmall,
    color: colors.text.primary,
    textAlign: 'center',
  },

  // Products
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    gap: spacing.itemGap,
  },
  horizontalList: {
    paddingHorizontal: spacing.base,
  },
  horizontalProductCard: {
    marginRight: spacing.md,
  },
});

export default HomeScreen;
