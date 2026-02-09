/**
 * Results Screen - HealthGuard Vision
 * Displays analysis results with probability bars and recommendations
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/colors';
import { AnalysisRecord, getAnalysisResult } from '@/services/api';

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

const RESULT_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  diabetes: { label: 'Diabetes', icon: 'eye-outline', color: '#8B5CF6' },
  anemia: { label: 'Anemia', icon: 'water-outline', color: '#EC4899' },
  deficiency: { label: 'Deficiency', icon: 'leaf-outline', color: '#F59E0B' },
};

function deriveSeverity(p: number): 'low' | 'moderate' | 'high' {
  if (p >= 0.7) return 'high';
  if (p >= 0.4) return 'moderate';
  return 'low';
}

function barColor(p: number): string {
  if (p >= 0.7) return AppColors.danger;
  if (p >= 0.4) return AppColors.warning;
  return AppColors.success;
}

const SEVERITY_CONFIG = {
  low: { label: 'Normal', color: AppColors.success, bg: '#ECFDF5', icon: 'checkmark-circle' as const },
  moderate: { label: 'Moderate', color: AppColors.warning, bg: '#FFFBEB', icon: 'alert-circle' as const },
  high: { label: 'High Risk', color: AppColors.danger, bg: '#FEF2F2', icon: 'warning' as const },
};

function getRecommendations(record: AnalysisRecord): string[] {
  const { type, probability } = record.result;
  const recs: string[] = [];

  if (probability >= 0.4) {
    switch (type) {
      case 'diabetes':
        recs.push('Schedule a comprehensive eye examination with an ophthalmologist');
        recs.push('Monitor your blood sugar levels regularly');
        recs.push('Maintain a balanced diet low in processed sugars');
        break;
      case 'anemia':
        recs.push('Consider a complete blood count (CBC) test');
        recs.push('Increase iron-rich foods: red meat, spinach, lentils');
        recs.push('Pair iron foods with Vitamin C for better absorption');
        break;
      case 'deficiency':
        recs.push('Get 15-20 minutes of sunlight daily for Vitamin D');
        recs.push('Include fatty fish, eggs, and fortified foods in your diet');
        recs.push('Schedule a blood test to confirm vitamin levels');
        break;
    }
  } else {
    recs.push('Continue regular health check-ups');
    recs.push('Maintain a balanced and nutritious diet');
    recs.push('Stay hydrated and exercise regularly');
  }

  recs.push('Always consult a qualified healthcare professional for proper evaluation');
  return recs;
}

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type, imageUri, resultId } = useLocalSearchParams<{
    type?: string;
    imageUri?: string;
    resultId?: string;
  }>();

  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResult();
  }, [resultId]);

  async function loadResult() {
    if (!resultId) { setLoading(false); return; }
    try {
      const data = await getAnalysisResult(resultId);
      setRecord(data);
    } catch {
      // API unavailable — stay in loading=false / null state
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={AppColors.primary} />
        <Text style={{ marginTop: 12, color: AppColors.gray500 }}>Loading results...</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={64} color={AppColors.gray300} />
        <Text style={{ marginTop: 12, fontSize: 16, color: AppColors.gray600 }}>
          Result not found
        </Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
          <Text style={{ color: AppColors.primary, fontWeight: '700' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scanType = record.image_type;
  const config = TYPE_CONFIG[scanType];
  const { type: resultType, probability, model_version } = record.result;
  const severity = deriveSeverity(probability);
  const sevConfig = SEVERITY_CONFIG[severity];
  const resultTypeConfig = RESULT_TYPE_CONFIG[resultType] || RESULT_TYPE_CONFIG.diabetes;
  const pct = Math.round(probability * 100);
  const recommendations = getRecommendations(record);
  const displayUri = imageUri || record.image_url;

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
      {displayUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: displayUri }} style={styles.image} contentFit="cover" />
          <View style={[styles.typeBadge, { backgroundColor: config.bgColor }]}>
            <Ionicons name={config.icon} size={16} color={config.color} />
            <Text style={[styles.typeBadgeText, { color: config.color }]}>{config.label}</Text>
          </View>
        </View>
      )}

      {/* Overall Severity Card */}
      <View style={styles.resultCard}>
        <View style={[styles.severityBanner, { backgroundColor: sevConfig.bg }]}>
          <Ionicons name={sevConfig.icon} size={24} color={sevConfig.color} />
          <View>
            <Text style={[styles.severityLabel, { color: sevConfig.color }]}>{sevConfig.label}</Text>
            <Text style={styles.confidenceText}>
              Scanned on {new Date(record.uploaded_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Result */}
        <Text style={styles.sectionLabel}>Detected Condition</Text>
        <View style={styles.probabilityRow}>
          <View style={styles.probLabelRow}>
            <Ionicons name={resultTypeConfig.icon} size={18} color={resultTypeConfig.color} />
            <Text style={styles.probLabel}>{resultTypeConfig.label}</Text>
            <Text style={[styles.probValue, { color: barColor(probability) }]}>{pct}%</Text>
          </View>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.barFill,
                { width: `${pct}%`, backgroundColor: barColor(probability) },
              ]}
            />
          </View>
          <Text style={styles.modelVersion}>Model: {model_version}</Text>
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.recommendationsCard}>
        <View style={styles.recommendationsHeader}>
          <Ionicons name="medical" size={22} color={AppColors.primary} />
          <Text style={styles.recommendationsTitle}>Recommendations</Text>
        </View>

        {recommendations.map((rec, index) => (
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
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 14,
  },
  probabilityRow: {
    marginBottom: 14,
  },
  probLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  probLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
  },
  probValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  barContainer: {
    height: 8,
    backgroundColor: AppColors.gray100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  modelVersion: {
    fontSize: 11,
    color: AppColors.gray400,
    marginTop: 6,
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
