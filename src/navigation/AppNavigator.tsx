import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';

import {
  HomeScreen,
  SearchScreen,
  CategoriesScreen,
  FavoritesScreen,
  ProfileScreen,
  MangaDetailScreen,
  ChapterReaderScreen,
  VoteScreen,
  EBScreen,
} from '../screens';
import { RootStackParamList, MainTabParamList } from '../types/manga';
import { Colors } from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    Home: '🏠',
    Search: '🔍',
    Categories: '📚',
    Library: '❤️',
    EB: '📋',
  };

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        {icons[name]}
      </Text>
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
};

const MainTabs = () => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarLabel: ({ focused }) => (
          <Text
            style={[
              styles.tabLabel,
              { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary },
              focused && styles.tabLabelFocused,
            ]}
          >
            {route.name}
          </Text>
        ),
        tabBarStyle: {
          backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface,
          borderTopColor: isDark ? Colors.dark.border : Colors.light.border,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.dark.textMuted,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Library" component={FavoritesScreen} />
      <Tab.Screen name="EB" component={EBScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: Colors.primary,
          background: isDark ? Colors.dark.background : Colors.light.background,
          card: isDark ? Colors.dark.surface : Colors.light.surface,
          text: isDark ? Colors.dark.text : Colors.light.text,
          border: isDark ? Colors.dark.border : Colors.light.border,
          notification: Colors.primary,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' as const },
          medium: { fontFamily: 'System', fontWeight: '500' as const },
          bold: { fontFamily: 'System', fontWeight: '700' as const },
          heavy: { fontFamily: 'System', fontWeight: '900' as const },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
          },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen 
          name="MangaDetail" 
          component={MangaDetailScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="ChapterReader" 
          component={ChapterReaderScreen}
          options={{
            animation: 'fade',
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen 
          name="Vote" 
          component={VoteScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    opacity: 0.6,
  },
  tabIconFocused: {
    opacity: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
  tabLabelFocused: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
