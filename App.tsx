import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Platform } from 'react-native';
import { store } from './store';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import LoadingScreen from './src/components/LoadingScreen';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';

// Create a basic AppNavigator if it doesn't exist
const App = () => {
  // Determine the default status bar style based on platform
  const statusBarStyle = Platform.select({
    ios: 'dark-content',
    android: 'light-content',
    default: 'auto',
  }) as 'dark-content' | 'light-content' | 'auto';

  return (
    <Provider store={store}>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <StatusBar barStyle={statusBarStyle} />
                <Suspense 
                  fallback={<LoadingScreen />}
                  // Add error boundary for Suspense
                  onError={(error: Error) => {
                    console.error('Suspense error:', error);
                  }}
                >
                  <AppNavigator />
                </Suspense>
              </NavigationContainer>
            </SafeAreaProvider>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;

