import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Feather';
import { colors, typography, spacing } from '@/theme';

interface NetworkStatusBarProps {
  showWhenOnline?: boolean;
}

export const NetworkStatusBar: React.FC<NetworkStatusBarProps> = ({
  showWhenOnline = false,
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const shouldShow = !isConnected || !isInternetReachable || showWhenOnline;
    
    Animated.timing(slideAnim, {
      toValue: shouldShow ? 0 : -50,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isConnected, isInternetReachable, showWhenOnline]);

  const getStatusConfig = () => {
    if (!isConnected) {
      return {
        backgroundColor: colors.error,
        icon: 'wifi-off',
        message: 'No internet connection',
      };
    }
    if (!isInternetReachable) {
      return {
        backgroundColor: colors.warning,
        icon: 'alert-triangle',
        message: 'Limited connectivity',
      };
    }
    return {
      backgroundColor: colors.success,
      icon: 'wifi',
      message: 'Connected',
    };
  };

  const config = getStatusConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: config.backgroundColor, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Icon name={config.icon} size={16} color={colors.neutral.white} />
      <Text style={styles.text}>{config.message}</Text>
    </Animated.View>
  );
};

// Hook for network status
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true);
      setIsInternetReachable(state.isInternetReachable ?? true);
    });

    return () => unsubscribe();
  }, []);

  return {
    isConnected,
    isInternetReachable,
    isOnline: isConnected && isInternetReachable,
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  text: {
    ...typography.labelSmall,
    color: colors.neutral.white,
  },
});
