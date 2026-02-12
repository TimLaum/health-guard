/**
 * Root Layout - HealthGuard Vision
 * Wraps the app with AuthProvider and handles routing based on auth state
 */

import {
  Stack,
  useRouter,
  useSegments,
  useLocalSearchParams,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Animated,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { AppColors } from "@/constants/colors";
import React from "react";

const ONBOARDING_KEY = "healthguard_onboarding_done";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { fromOnboarding } = params;
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  // Check onboarding flag on mount
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setOnboardingDone(value === "true");
    });
  }, []);

  // Animate splash: logo scale-in + text fade-in, then fade out
  useEffect(() => {
    // 1. Animate in
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. After 2.5s total, fade out
    const timer = setTimeout(() => {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setShowSplash(false));
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading || (onboardingDone === null && !fromOnboarding))
      return;

    const rootSegment = segments[0];

    const hasFinishedOnboarding =
      onboardingDone === true || fromOnboarding === "true";

    if (!hasFinishedOnboarding) {
      if (rootSegment !== "onboarding") {
        router.replace("/onboarding");
      }
      return;
    }

    if (!isAuthenticated) {
      const isPublicArea =
        rootSegment === "(auth)" ||
        rootSegment === "(legal)" ||
        rootSegment === "guide";

      if (!isPublicArea) {
        router.replace("/(auth)/login");
      }
    } else {
      const isInsideApp = rootSegment === "(tabs)" || rootSegment === "results";

      if (!isInsideApp) {
        router.replace("/(tabs)");
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    onboardingDone,
    segments,
    isMounted,
    fromOnboarding,
  ]);
  // Show a blank loader only if the onboarding state hasn't resolved yet
  if (isLoading || onboardingDone === null) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: AppColors.background,
        }}
      >
        <ActivityIndicator size="large" color={AppColors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(legal)" />
        <Stack.Screen
          name="guide"
          options={{
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            presentation: "modal",
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
      </Stack>

      {/* Animated Splash Overlay */}
      {showSplash && (
        <Animated.View
          style={[splashStyles.overlay, { opacity: splashOpacity }]}
        >
          <Animated.View style={{ transform: [{ scale: logoScale }] }}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={splashStyles.logo}
              contentFit="contain"
            />
          </Animated.View>
          <Animated.View style={{ opacity: textOpacity }}>
            <Text style={splashStyles.title}>HealthGuard</Text>
            <Text style={splashStyles.subtitle}>
              AI-Powered Health Screening
            </Text>
          </Animated.View>
        </Animated.View>
      )}

      <StatusBar style="dark" />
    </>
  );
}

const splashStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AppColors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: AppColors.primary,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: AppColors.gray500,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
