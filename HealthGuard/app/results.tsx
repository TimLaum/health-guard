/**
 * Results Screen - HealthGuard Vision
 * Displays analysis results with diagnosis and recommendations
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
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/colors';

const { width } = Dimensions.get('window');

const TYPE_CONFIG = {
  eye: {
    icon: 'eye-outline' as const,
    label: 'Eye Analysis',
    color: AppColors.eyeScan,
    bgColor: '#F3E8FF',
  },
  skin: {
    icon: 'body-outline' as const,
    label: 'Skin Analysis',
    color: AppColors.skinScan,
    bgColor: '#FFF7ED',
  },
  nail: {
    icon: 'hand-left-outline' as const,
    label: 'Nail Analysis',
    color: AppColors.nailScan,
    bgColor: '#FDF2F8',
  },
};

// Demo result data — in production, fetch from API
const DEMO_RESULTS = {
  eye: {
    condition: 'No diabetic retinopathy detected',
    confidence: 0.92,
    severity: 'low' as const,
    description:
      'The AI analysis of your retinal image did not find significant indicators of diabetic retinopathy. Your eye appears healthy based on the visible features.',
    recommendations: [
      'Continue regular annual eye check-ups',
      'Monitor blood sugar levels regularly',
      'Maintain a balanced diet rich in omega-3',
      'Protect your eyes from prolonged screen exposure',
      'Stay hydrated throughout the day',
    ],
  },
  skin: {
    condition: 'Possible Vitamin D deficiency signs',
    confidence: 0.85,
    severity: 'moderate' as const,
    description:
      'The analysis detected possible indicators of Vitamin D deficiency in your skin tone and texture patterns. This is a preliminary screening result.',
    recommendations: [
      'Get 15-20 minutes of sunlight daily',
      'Consider Vitamin D supplements (consult your doctor)',
      'Include fatty fish, eggs, and fortified foods in your diet',
      'Schedule a blood test to confirm Vitamin D levels',
      'Consult a dermatologist for a thorough evaluation',
    ],
  },
  nail: {
    condition: 'Mild iron deficiency indicators',
    confidence: 0.78,
    severity: 'moderate' as const,
    description:
      'The nail bed analysis shows some indicators that may suggest iron deficiency (anemia). Pale nail beds and slight spoon-shaped appearance were detected.',
    recommendations: [
      'Increase iron-rich foods: red meat, spinach, lentils',
      'Pair iron foods with Vitamin C for better absorption',
      'Schedule a complete blood count (CBC) test',
      'Avoid tea/coffee during meals (they inhibit iron absorption)',
      'Consult a doctor if you experience fatigue or dizziness',
    ],
  },
};

const SEVERITY_CONFIG = {
  low: { label: 'Normal', color: AppColors.success, bg: '#ECFDF5', icon: 'checkmark-circle' as const },
  moderate: { label: 'Moderate', color: AppColors.warning, bg: '#FFFBEB', icon: 'alert-circle' as const },
  high: { label: 'High Risk', color: AppColors.danger, bg: '#FEF2F2', icon: 'warning' as const },
};

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type, imageUri } = useLocalSearchParams<{
    type?: string;
    imageUri?: string;
    resultId?: string;
  }>();

  const scanType = (type as 'eye' | 'skin' | 'nail') || 'eye';
  const config = TYPE_CONFIG[scanType];
  const result = DEMO_RESULTS[scanType];
  const severity = SEVERITY_CONFIG[result.severity];
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={AppColors.gray700} />
      </TouchableOpacity>

      {/* Image Preview */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} contentFit="cover" />
          <View style={[styles.typeBadge, { backgroundColor: config.bgColor }]}>
            <Ionicons name={config.icon} size={16} color={config.color} />
            <Text style={[styles.typeBadgeText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>
      )}

      {/* Result Card */}
      <View style={styles.resultCard}>
        {/* Severity Badge */}
        <View style={[styles.severityBanner, { backgroundColor: severity.bg }]}>
          <Ionicons name={severity.icon} size={24} color={severity.color} />
          <View>
            <Text style={[styles.severityLabel, { color: severity.color }]}>{severity.label}</Text>
            <Text style={styles.confidenceText}>Confidence: {confidencePercent}%</Text>
          </View>
        </View>

        {/* Condition */}
        <Text style={styles.conditionTitle}>{result.condition}</Text>
        <Text style={styles.conditionDescription}>{result.description}</Text>

        {/* Confidence Bar */}
        <View style={styles.confidenceBar}>
          <Text style={styles.confidenceBarLabel}>AI Confidence</Text>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${confidencePercent}%`,
                  backgroundColor: severity.color,
                },
              ]}
            />
          </View>
          <Text style={styles.confidenceBarValue}>{confidencePercent}%</Text>
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.recommendationsCard}>
        <View style={styles.recommendationsHeader}>
          <Ionicons name="medical" size={22} color={AppColors.primary} />
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
        </View>

        {result.recommendations.map((rec, index) => (
          <View key={index} style={styles.recItem}>
            <View style={styles.recNumber}>
              <Text style={styles.recNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.recText}>{rec}</Text>
          </View>
        ))}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="warning-outline" size={18} color={AppColors.warning} />
        <Text style={styles.disclaimerText}>
          This is an AI-assisted screening tool and not a medical diagnosis.
          Always consult a qualified healthcare professional for proper evaluation and treatment.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => router.replace('/(tabs)')}
        >
          <Ionicons name="home-outline" size={20} color={AppColors.white} />
          <Text style={styles.primaryActionText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryAction}
          onPress={() => router.push('/(tabs)/capture')}
        >
          <Ionicons name="scan-outline" size={20} color={AppColors.primary} />
          <Text style={styles.secondaryActionText}>New Scan</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
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
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: AppColors.white,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  severityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  severityLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  confidenceText: {
    fontSize: 12,
    color: AppColors.gray500,
    marginTop: 1,
  },
  conditionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 8,
  },
  conditionDescription: {
    fontSize: 14,
    color: AppColors.gray600,
    lineHeight: 22,
    marginBottom: 20,
  },
  confidenceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  confidenceBarLabel: {
    fontSize: 12,
    color: AppColors.gray500,
    fontWeight: '600',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: AppColors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceBarValue: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.gray700,
    width: 36,
    textAlign: 'right',
  },
  recommendationsCard: {
    backgroundColor: AppColors.white,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  recItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  recNumber: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: AppColors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: AppColors.primary,
  },
  recText: {
    flex: 1,
    fontSize: 14,
    color: AppColors.gray700,
    lineHeight: 20,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: AppColors.gray600,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    color: AppColors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.white,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  secondaryActionText: {
    color: AppColors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
