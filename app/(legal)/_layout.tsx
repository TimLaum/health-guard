/**
 * Legal Pages Layout - HealthGuard Vision
 */

import { Stack } from 'expo-router';
import { AppColors } from '@/constants/colors';

export default function LegalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: AppColors.background },
        headerTintColor: AppColors.gray900,
        headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="terms"
        options={{ title: 'Terms of Service' }}
      />
      <Stack.Screen
        name="privacy"
        options={{ title: 'Privacy Policy' }}
      />
    </Stack>
  );
}
