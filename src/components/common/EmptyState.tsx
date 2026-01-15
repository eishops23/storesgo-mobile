import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, typography, spacing } from '@/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={48} color={colors.neutral.gray300} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          style={styles.button}
        />
      )}
    </View>
  );
};

// Pre-configured empty states for common scenarios
export const EmptyCart: React.FC<{ onShop: () => void }> = ({ onShop }) => (
  <EmptyState
    icon="shopping-cart"
    title="Your cart is empty"
    description="Looks like you haven't added any items to your cart yet."
    actionLabel="Start Shopping"
    onAction={onShop}
  />
);

export const EmptyOrders: React.FC<{ onShop: () => void }> = ({ onShop }) => (
  <EmptyState
    icon="package"
    title="No orders yet"
    description="When you place orders, they'll appear here."
    actionLabel="Browse Products"
    onAction={onShop}
  />
);

export const EmptySearch: React.FC<{ query: string }> = ({ query }) => (
  <EmptyState
    icon="search"
    title="No results found"
    description={`We couldn't find anything for "${query}". Try a different search term.`}
  />
);

export const EmptyAddresses: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <EmptyState
    icon="map-pin"
    title="No saved addresses"
    description="Add a delivery address to make checkout faster."
    actionLabel="Add Address"
    onAction={onAdd}
  />
);

export const EmptyFavorites: React.FC<{ onBrowse: () => void }> = ({ onBrowse }) => (
  <EmptyState
    icon="heart"
    title="No favorites yet"
    description="Save your favorite products for quick access."
    actionLabel="Browse Products"
    onAction={onBrowse}
  />
);

export const NetworkError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <EmptyState
    icon="wifi-off"
    title="No internet connection"
    description="Please check your connection and try again."
    actionLabel="Retry"
    onAction={onRetry}
  />
);

export const ServerError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <EmptyState
    icon="alert-circle"
    title="Something went wrong"
    description="We're having trouble loading this page. Please try again."
    actionLabel="Retry"
    onAction={onRetry}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h4,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 160,
  },
});
