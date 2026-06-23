import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';

export default function App() {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#0f0f0f' : '#ffffff'}
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
