/**
 * Onboarding Screen - HealthGuard Vision
 * 3-slide intro shown on first launch only
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  ViewToken,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppColors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');

const ONBOARDING_KEY = 'healthguard_onboarding_done';

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  features: { icon: keyof typeof Ionicons.glyphMap; text: string }[];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: 'shield-checkmark',
    iconColor: AppColors.primary,
    iconBg: AppColors.primaryBg,
    title: 'AI-Powered\nHealth Screening',
    subtitle:
      'Advanced artificial intelligence analyzes your photos to detect early signs of health conditions — quick, easy, and non-invasive.',
    features: [
      { icon: 'flash-outline', text: 'Results in seconds' },
      { icon: 'lock-closed-outline', text: 'Private & secure' },
      { icon: 'cloud-outline', text: 'Cloud-powered AI models' },
    ],
  },
  {
    id: '2',
    icon: 'scan',
    iconColor: AppColors.secondary,
    iconBg: '#EEF2FF',
    title: 'Scan Eyes,\nSkin & Nails',
    subtitle:
      'Three specialized scans target different health indicators. Simply take a photo and let our AI do the rest.',
    features: [
      { icon: 'eye-outline', text: 'Eye scan — Diabetes indicators' },
      { icon: 'body-outline', text: 'Skin scan — Nutritional deficiencies' },
      { icon: 'hand-left-outline', text: 'Nail scan — Anemia markers' },
    ],
  },
  {
    id: '3',
    icon: 'analytics',
    iconColor: AppColors.success,
    iconBg: '#ECFDF5',
    title: 'Instant Results\n& Guidance',
    subtitle:
      'Get a clear probability score with personalized recommendations. Track your history and monitor changes over time.',
    features: [
      { icon: 'bar-chart-outline', text: 'Clear probability scores' },
      { icon: 'medical-outline', text: 'Personalized health tips' },
      { icon: 'time-outline', text: 'Track your scan history' },
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  async function completeOnboarding() {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(auth)/login');
  }

  function handleNext() {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      completeOnboarding();
    }
  }

  function renderSlide({ item }: { item: Slide }) {
    return (
      <View style={styles.slide}>
        {/* Icon Circle */}
        <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
          <View style={[styles.iconInner, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={56} color={item.iconColor} />
          </View>
        </View>

        {/* Text */}
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>

        {/* Feature List */}
        <View style={styles.featureList}>
          {item.features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIconBg}>
                <Ionicons name={f.icon} size={18} color={AppColors.primary} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomContainer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: 'clamp',
            });

            const dotOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: AppColors.primary,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Next / Get Started Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            currentIndex === SLIDES.length - 1 && styles.getStartedButton,
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          {currentIndex === SLIDES.length - 1 ? (
            <>
              <Text style={styles.getStartedText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={20} color={AppColors.white} />
            </>
          ) : (
            <>
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color={AppColors.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.gray100,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray500,
  },
  slide: {
    width,
    paddingHorizontal: 32,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    // Outer glow ring
    shadowColor: '#0891B2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  iconInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: AppColors.gray900,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  slideSubtitle: {
    fontSize: 15,
    color: AppColors.gray500,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  featureList: {
    width: '100%',
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: AppColors.gray50,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  featureIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: AppColors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 20,
    gap: 24,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 18,
    borderRadius: 18,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
  getStartedButton: {
    backgroundColor: AppColors.success,
    shadowColor: AppColors.success,
  },
  getStartedText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.white,
  },
});
