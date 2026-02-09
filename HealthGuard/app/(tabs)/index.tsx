/**
 * Home Dashboard - HealthGuard Vision
 * Main landing page after login with scan options and recent results
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';

const { width } = Dimensions.get('window');

interface ScanOption {
  id: 'eye' | 'skin' | 'nail';
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  detects: string;
}

const SCAN_OPTIONS: ScanOption[] = [
  {
    id: 'eye',
    title: 'Eye Scan',
    subtitle: 'Retinal analysis',
    icon: 'eye-outline',
    color: AppColors.eyeScan,
    bgColor: '#F3E8FF',
    detects: 'Diabetes indicators',
  },
  {
    id: 'skin',
    title: 'Skin Scan',
    subtitle: 'Dermal analysis',
    icon: 'body-outline',
    color: AppColors.skinScan,
    bgColor: '#FFF7ED',
    detects: 'Nutritional deficiencies',
  },
  {
    id: 'nail',
    title: 'Nail Scan',
    subtitle: 'Nail bed analysis',
    icon: 'hand-left-outline',
    color: AppColors.nailScan,
    bgColor: '#FDF2F8',
    detects: 'Anemia signs',
  },
];

const HEALTH_TIPS = [
  { icon: 'water-outline' as const, text: 'Stay hydrated — drink 8 glasses daily', color: AppColors.info },
  { icon: 'sunny-outline' as const, text: 'Get 15 min of sunlight for Vitamin D', color: AppColors.warning },
  { icon: 'nutrition-outline' as const, text: 'Eat iron-rich foods to prevent anemia', color: AppColors.success },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const firstName = user?.first_name || 'User';

  function handleScan(type: 'eye' | 'skin' | 'nail') {
    router.push({ pathname: '/(tabs)/capture', params: { type } });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
          <Text style={styles.headerSubtitle}>How are you feeling today?</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color={AppColors.gray700} />
        </TouchableOpacity>
      </View>

      {/* Quick Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons name="shield-checkmark" size={24} color={AppColors.white} />
          <Text style={styles.statusTitle}>Health Status</Text>
        </View>
        <Text style={styles.statusText}>
          Take a scan to get your health insights
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>No recent scans</Text>
        </View>
      </View>

      {/* Scan Options */}
      <Text style={styles.sectionTitle}>Start a Scan</Text>
      <Text style={styles.sectionSubtitle}>Choose what you'd like to analyze</Text>

      <View style={styles.scanGrid}>
        {SCAN_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.scanCard}
            onPress={() => handleScan(option.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.scanIconContainer, { backgroundColor: option.bgColor }]}>
              <Ionicons name={option.icon} size={32} color={option.color} />
            </View>
            <Text style={styles.scanTitle}>{option.title}</Text>
            <Text style={styles.scanSubtitle}>{option.subtitle}</Text>
            <View style={[styles.scanDetectsBadge, { backgroundColor: option.bgColor }]}>
              <Text style={[styles.scanDetectsText, { color: option.color }]}>
                {option.detects}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Health Tips */}
      <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Daily Health Tips</Text>

      <View style={styles.tipsContainer}>
        {HEALTH_TIPS.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <View style={[styles.tipIconContainer, { backgroundColor: tip.color + '15' }]}>
              <Ionicons name={tip.icon} size={20} color={tip.color} />
            </View>
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={16} color={AppColors.gray400} />
        <Text style={styles.disclaimerText}>
          HealthGuard provides screening assistance only. Always consult a healthcare professional for diagnosis.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  headerSubtitle: {
    fontSize: 15,
    color: AppColors.gray500,
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statusCard: {
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.white,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: AppColors.gray500,
    marginBottom: 16,
  },
  scanGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  scanCard: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  scanIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  scanTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 2,
  },
  scanSubtitle: {
    fontSize: 11,
    color: AppColors.gray400,
    marginBottom: 8,
  },
  scanDetectsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scanDetectsText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  tipsContainer: {
    marginTop: 12,
    gap: 10,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: AppColors.gray700,
    lineHeight: 20,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 4,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: AppColors.gray400,
    lineHeight: 18,
  },
});
