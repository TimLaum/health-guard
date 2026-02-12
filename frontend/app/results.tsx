/**
 * Results Screen - HealthGuard Vision
 * Displays analysis results from /predict or history records
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "@/constants/colors";
import {
  type AnalysisResult,
  type HistoryRecord,
  type SkinAnalysisResult,
  type AnemiaAnalysisResult,
  isSkinResult,
} from "@/services/api";

const { width } = Dimensions.get("window");

const TYPE_CONFIG = {
  eye: {
    icon: "eye-outline" as const,
    label: "Eye Analysis",
    color: AppColors.eyeScan,
    bgColor: "#F3E8FF",
  },
  skin: {
    icon: "body-outline" as const,
    label: "Skin Analysis",
    color: AppColors.skinScan,
    bgColor: "#FFF7ED",
  },
  nail: {
    icon: "hand-left-outline" as const,
    label: "Nail Analysis",
    color: AppColors.nailScan,
    bgColor: "#FDF2F8",
  },
};

const SEVERITY_CONFIG = {
  severe: {
    label: "Severe",
    color: AppColors.danger,
    bg: "#FEF2F2",
    icon: "warning" as const,
  },
  moderate: {
    label: "Moderate",
    color: AppColors.warning,
    bg: "#FFFBEB",
    icon: "alert-circle" as const,
  },
  light: {
    label: "Light",
    color: "#F59E0B",
    bg: "#FFFBEB",
    icon: "alert-circle" as const,
  },
  normal: {
    label: "Normal",
    color: AppColors.success,
    bg: "#ECFDF5",
    icon: "checkmark-circle" as const,
  },
};

function getSeverityConfig(severity: string | null, status?: string) {
  if (severity && severity in SEVERITY_CONFIG) {
    return SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG];
  }
  if (status === "elevated") {
    return {
      label: "Elevated",
      color: AppColors.warning,
      bg: "#FFFBEB",
      icon: "alert-circle" as const,
    };
  }
  return SEVERITY_CONFIG.normal;
}

function getRecommendations(
  analysisType: string,
  severity: string | null,
  status?: string,
): string[] {
  const recs: string[] = [];

  if (analysisType === "skin") {
    recs.push("Consultez un dermatologue pour un diagnostic approfondi");
    recs.push("Évitez l'exposition prolongée au soleil");
    recs.push("Maintenez une bonne hygiène de la peau");
  } else {
    // eye or nail — anemia analysis
    if (severity === "severe" || severity === "moderate") {
      recs.push(
        "Consultez un médecin rapidement pour un bilan sanguin complet",
      );
      recs.push(
        "Augmentez les aliments riches en fer : viande rouge, épinards, lentilles",
      );
      recs.push("Associez les aliments riches en fer avec de la vitamine C");
    } else if (severity === "light") {
      recs.push("Envisagez un bilan sanguin (NFS) de contrôle");
      recs.push("Augmentez les aliments riches en fer dans votre alimentation");
      recs.push("Surveillez votre état de santé régulièrement");
    } else if (status === "elevated") {
      recs.push("Consultez un médecin pour vérifier votre taux d'hémoglobine");
      recs.push("Restez bien hydraté");
    } else {
      recs.push("Continuez à maintenir une alimentation équilibrée");
      recs.push("Restez hydraté et faites de l'exercice régulièrement");
    }
  }

  recs.push(
    "Consultez toujours un professionnel de santé pour un diagnostic complet",
  );
  return recs;
}

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type, imageUri, resultData, historyData } = useLocalSearchParams<{
    type?: string;
    imageUri?: string;
    resultData?: string;
    historyData?: string;
  }>();

  // Parse analysis result (from capture) or history record (from history list)
  const analysisResult: AnalysisResult | null = resultData
    ? JSON.parse(resultData)
    : null;
  const historyRecord: HistoryRecord | null = historyData
    ? JSON.parse(historyData)
    : null;

  // Determine the scan type
  const scanType = (analysisResult?.analysis_type ||
    historyRecord?.type ||
    type ||
    "skin") as "eye" | "skin" | "nail";
  const config = TYPE_CONFIG[scanType];

  // If we have neither result data nor history data, show empty state
  if (!analysisResult && !historyRecord) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={AppColors.gray300}
        />
        <Text style={{ marginTop: 12, fontSize: 16, color: AppColors.gray600 }}>
          Result not found
        </Text>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => router.back()}
        >
          <Text style={{ color: AppColors.primary, fontWeight: "700" }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Render for fresh analysis result from /predict ───
  function renderAnalysisResult(result: AnalysisResult) {
    if (isSkinResult(result)) {
      return renderSkinResult(result);
    }
    return renderAnemiaResult(result);
  }

  function renderSkinResult(result: SkinAnalysisResult) {
    const recommendations = getRecommendations("skin", null);

    return (
      <>
        {/* Main Diagnosis */}
        <View style={styles.resultCard}>
          <View style={[styles.severityBanner, { backgroundColor: "#FFF7ED" }]}>
            <Ionicons
              name="body-outline"
              size={24}
              color={AppColors.skinScan}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[styles.severityLabel, { color: AppColors.skinScan }]}
              >
                {result.primary_diagnosis}
              </Text>
              <Text style={styles.confidenceText}>
                Confidence: {result.confidence}%
              </Text>
            </View>
          </View>

          {/* All Predictions */}
          <Text style={styles.sectionLabel}>Top Predictions</Text>
          {result.predictions.map((pred, index) => (
            <View key={index} style={styles.predictionRow}>
              <View style={styles.predRank}>
                <Text style={styles.predRankText}>{index + 1}</Text>
              </View>
              <Text style={styles.predDisease}>{pred.disease}</Text>
              <Text style={styles.predConfidence}>{pred.confidence}%</Text>
            </View>
          ))}
        </View>

        {renderRecommendations(recommendations)}
      </>
    );
  }

  function renderAnemiaResult(result: AnemiaAnalysisResult) {
    const sevConfig = getSeverityConfig(result.severity, result.status);
    const recommendations = getRecommendations(
      result.analysis_type,
      result.severity,
      result.status,
    );

    return (
      <>
        <View style={styles.resultCard}>
          {/* Severity Banner */}
          <View
            style={[styles.severityBanner, { backgroundColor: sevConfig.bg }]}
          >
            <Ionicons name={sevConfig.icon} size={24} color={sevConfig.color} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.severityLabel, { color: sevConfig.color }]}>
                {sevConfig.label}
              </Text>
            </View>
          </View>

          {/* Message */}
          <Text style={styles.sectionLabel}>Diagnosis</Text>
          <Text style={styles.messageText}>{result.message}</Text>

          {/* Hemoglobin Level */}
          <View style={styles.hbContainer}>
            <Ionicons name="water" size={20} color={AppColors.primary} />
            <Text style={styles.hbLabel}>Hemoglobin Level</Text>
            <Text style={styles.hbValue}>{result.hb_level}</Text>
          </View>
        </View>

        {renderRecommendations(recommendations)}
      </>
    );
  }

  // ─── Render for history record ───
  function renderHistoryRecord(record: HistoryRecord) {
    const recommendations = getRecommendations(record.type, null);

    return (
      <>
        <View style={styles.resultCard}>
          <View
            style={[styles.severityBanner, { backgroundColor: config.bgColor }]}
          >
            <Ionicons name={config.icon} size={24} color={config.color} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.severityLabel, { color: config.color }]}>
                {config.label}
              </Text>
              <Text style={styles.confidenceText}>
                {new Date(record.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Result</Text>
          <Text style={styles.messageText}>{record.message}</Text>

          {record.hb_level ? (
            <View style={styles.hbContainer}>
              <Ionicons name="water" size={20} color={AppColors.primary} />
              <Text style={styles.hbLabel}>Hemoglobin Level</Text>
              <Text style={styles.hbValue}>{record.hb_level}</Text>
            </View>
          ) : null}
        </View>

        {renderRecommendations(recommendations)}
      </>
    );
  }

  function renderRecommendations(recommendations: string[]) {
    return (
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
    );
  }

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
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
          />
          <View style={[styles.typeBadge, { backgroundColor: config.bgColor }]}>
            <Ionicons name={config.icon} size={16} color={config.color} />
            <Text style={[styles.typeBadgeText, { color: config.color }]}>
              {config.label}
            </Text>
          </View>
        </View>
      )}

      {/* Results Content */}
      {analysisResult
        ? renderAnalysisResult(analysisResult)
        : historyRecord
          ? renderHistoryRecord(historyRecord)
          : null}

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="warning-outline" size={18} color={AppColors.warning} />
        <Text style={styles.disclaimerText}>
          This is an AI-assisted screening tool and not a medical diagnosis.
          Always consult a qualified healthcare professional for proper
          evaluation and treatment.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="home-outline" size={20} color={AppColors.white} />
          <Text style={styles.primaryActionText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryAction}
          onPress={() => router.replace("/(tabs)/capture")}
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
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  typeBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: AppColors.white,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  severityBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  severityLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  confidenceText: {
    fontSize: 12,
    color: AppColors.gray500,
    marginTop: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.gray900,
    marginBottom: 14,
  },
  messageText: {
    fontSize: 15,
    color: AppColors.gray700,
    lineHeight: 22,
    marginBottom: 16,
  },
  hbContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: AppColors.primaryBg,
    padding: 14,
    borderRadius: 14,
  },
  hbLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.gray700,
  },
  hbValue: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.primary,
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray100,
  },
  predRank: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: AppColors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  predRankText: {
    fontSize: 13,
    fontWeight: "700",
    color: AppColors.primary,
  },
  predDisease: {
    flex: 1,
    fontSize: 14,
    color: AppColors.gray700,
  },
  predConfidence: {
    fontSize: 14,
    fontWeight: "700",
    color: AppColors.gray900,
  },
  recommendationsCard: {
    backgroundColor: AppColors.white,
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  recommendationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.gray900,
  },
  recItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  recNumber: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: AppColors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
  },
  recNumberText: {
    fontSize: 13,
    fontWeight: "700",
    color: AppColors.primary,
  },
  recText: {
    flex: 1,
    fontSize: 14,
    color: AppColors.gray700,
    lineHeight: 20,
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: AppColors.gray600,
    lineHeight: 19,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "700",
  },
  secondaryAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "700",
  },
});
