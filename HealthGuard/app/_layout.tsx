/**
 * Root Layout - HealthGuard Vision
 * Wraps the app with AuthProvider and handles routing based on auth state
 */

import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { AppColors } from '@/constants/colors';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inPublicGroup = segments[0] === '(legal)' || segments[0] === 'guide';

    if (!isAuthenticated && !inAuthGroup && !inPublicGroup) {
      // Not logged in → redirect to login
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Logged in but on auth screen → redirect to home
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: AppColors.background }}>
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(legal)" />
        <Stack.Screen
          name="guide"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
