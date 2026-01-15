import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from '@/navigation';
import { useAuthStore } from '@/store';
import { ToastProvider } from '@/components/common';
import { analytics } from '@/utils';
import { colors } from '@/theme';

// Ignore specific warnings (can be removed in production)
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App: React.FC = () => {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    // Initialize analytics
    analytics.initialize();
    
    // Check if user is already logged in on app start
    loadUser();
  }, [loadUser]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ToastProvider>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={colors.background.primary}
          />
          <AppNavigator />
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
