
import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      route: '/(tabs)/(home)',
      label: 'Tiles',
      icon: 'square.grid.3x3',
    },
    {
      route: '/(tabs)/history',
      label: 'History',
      icon: 'clock.fill',
    },
    {
      route: '/(tabs)/profile',
      label: 'Settings',
      icon: 'gear',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="(home)" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ title: 'History' }} />
        <Stack.Screen name="profile" options={{ title: 'Settings' }} />
      </Stack>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="history" />
        <Stack.Screen name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
