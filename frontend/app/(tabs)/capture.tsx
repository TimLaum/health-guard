/**
 * Capture Screen - HealthGuard Vision
 * Camera / photo picker for taking health scan images
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "@/constants/colors";
import { uploadImageForAnalysis } from "@/services/api";

const { width } = Dimensions.get("window");

const SCAN_CONFIG = {
  eye: {
    title: "Scan Oculaire",
    instruction: "Prenez une photo claire de votre œil avec un bon éclairage",
    tips: [
      "Regardez droit vers la caméra",
      "Assurez un éclairage vif et uniforme",
      "Restez stable pour une photo nette",
    ],
    icon: "eye-outline" as const,
    color: AppColors.eyeScan,
    bgColor: "#F3E8FF",
  },
  skin: {
    title: "Scan Cutané",
    instruction: "Prenez une photo de la zone de peau à analyser",
    tips: [
      "Capturez clairement la zone concernée",
      "Utilisez la lumière naturelle si possible",
      "Gardez la caméra à 15-20 cm",
    ],
    icon: "body-outline" as const,
    color: AppColors.skinScan,
    bgColor: "#FFF7ED",
  },
  nail: {
    title: "Scan Ongles",
    instruction: "Prenez une photo de vos ongles sur une surface plane",
    tips: [
      "Placez la main sur une surface plane bien éclairée",
      "Capturez tous les ongles si possible",
      "Retirez le vernis à ongles au préalable",
    ],
    icon: "hand-left-outline" as const,
    color: AppColors.nailScan,
    bgColor: "#FDF2F8",
  },
};

export default function CaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const [scanType, setScanType] = useState<"eye" | "skin" | "nail">(
    (type as "eye" | "skin" | "nail") || null,
  );
  const config = scanType ? SCAN_CONFIG[scanType] : null;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "L'accès à la caméra est nécessaire pour prendre des photos",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "L'accès à la galerie est nécessaire pour sélectionner des photos",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function analyzeImage() {
    if (!imageUri) return;

    setIsAnalyzing(true);

    try {
      const result = await uploadImageForAnalysis(imageUri, scanType);
      setIsAnalyzing(false);
      router.push({
        pathname: "/results",
        params: {
          type: scanType,
          imageUri,
          resultData: JSON.stringify(result),
        },
      });
    } catch (error: any) {
      setIsAnalyzing(false);
      Alert.alert(
        "Analyse échouée",
        error.message || "Échec de l'analyse de l'image. Veuillez réessayer.",
      );
    }
  }

  function resetImage() {
    setImageUri(null);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Type Selector */}
      {!scanType ? (
        <View style={styles.typeSelectorContainer}>
          <Text style={styles.selectorTitle}>Choisir le type de scan</Text>
          <Text style={styles.selectorSubtitle}>
            Sélectionnez ce que vous souhaitez analyser
          </Text>

          <View style={styles.typeButtonsGrid}>
            {(Object.keys(SCAN_CONFIG) as Array<"eye" | "skin" | "nail">).map(
              (key) => {
                const scanConfig = SCAN_CONFIG[key];
                return (
                  <TouchableOpacity
                    key={key}
                    style={styles.typeCard}
                    onPress={() => setScanType(key)}
                  >
                    <View
                      style={[
                        styles.typeCardIconBg,
                        { backgroundColor: scanConfig.bgColor },
                      ]}
                    >
                      <Ionicons
                        name={scanConfig.icon}
                        size={36}
                        color={scanConfig.color}
                      />
                    </View>
                    <Text style={styles.typeCardTitle}>{scanConfig.title}</Text>
                  </TouchableOpacity>
                );
              },
            )}
          </View>
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[
                styles.headerIconContainer,
                { backgroundColor: config.bgColor },
              ]}
            >
              <Ionicons name={config.icon} size={24} color={config.color} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{config.title}</Text>
              <Text style={styles.headerSubtitle}>{config.instruction}</Text>
            </View>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setScanType(null)}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={AppColors.gray700}
              />
            </TouchableOpacity>
          </View>

          {/* Image Preview or Capture Area */}
          {imageUri ? (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                contentFit="cover"
              />
              <TouchableOpacity style={styles.retakeBtn} onPress={resetImage}>
                <Ionicons name="refresh" size={20} color={AppColors.white} />
                <Text style={styles.retakeBtnText}>Reprendre</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.captureArea}>
              <View
                style={[
                  styles.captureIconBg,
                  { backgroundColor: config.bgColor },
                ]}
              >
                <Ionicons name={config.icon} size={64} color={config.color} />
              </View>

              {/* Tips */}
              <View style={styles.tipsContainer}>
                {config.tips.map((tip, index) => (
                  <View key={index} style={styles.tipRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={AppColors.success}
                    />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>

              {/* Capture Buttons */}
              <View style={styles.captureButtons}>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={takePhoto}
                >
                  <Ionicons name="camera" size={28} color={AppColors.white} />
                  <Text style={styles.cameraButtonText}>Prendre une photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.galleryButton}
                  onPress={pickFromGallery}
                >
                  <Ionicons
                    name="images-outline"
                    size={24}
                    color={AppColors.primary}
                  />
                  <Text style={styles.galleryButtonText}>Galerie</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Analyze Button */}
          {imageUri && (
            <View style={styles.analyzeContainer}>
              <TouchableOpacity
                style={[
                  styles.analyzeButton,
                  isAnalyzing && styles.analyzeButtonDisabled,
                ]}
                onPress={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <View style={styles.analyzingContent}>
                    <ActivityIndicator color={AppColors.white} />
                    <Text style={styles.analyzeButtonText}>
                      Analyse en cours...
                    </Text>
                  </View>
                ) : (
                  <View style={styles.analyzingContent}>
                    <Ionicons name="scan" size={22} color={AppColors.white} />
                    <Text style={styles.analyzeButtonText}>
                      Analyser l'image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {isAnalyzing && (
                <Text style={styles.analyzingHint}>
                  Notre IA traite votre image...
                </Text>
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    padding: 20,
  },
  typeSelectorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectorTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: AppColors.gray900,
    marginBottom: 8,
    textAlign: "center",
  },
  selectorSubtitle: {
    fontSize: 16,
    color: AppColors.gray500,
    marginBottom: 36,
    textAlign: "center",
  },
  typeButtonsGrid: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    width: "100%",
    flexWrap: "wrap",
  },
  typeCard: {
    width: (width - 72) / 3,
    aspectRatio: 1,
    backgroundColor: AppColors.white,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  typeCardIconBg: {
    width: 70,
    height: 70,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  typeCardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.gray800,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: AppColors.gray900,
  },
  headerSubtitle: {
    fontSize: 13,
    color: AppColors.gray500,
    marginTop: 2,
  },
  previewContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: AppColors.gray100,
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  retakeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retakeBtnText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  captureArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  captureIconBg: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  tipsContainer: {
    width: "100%",
    gap: 10,
    marginBottom: 36,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: AppColors.white,
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tipText: {
    fontSize: 14,
    color: AppColors.gray700,
    flex: 1,
  },
  captureButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cameraButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cameraButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  galleryButton: {
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
  galleryButtonText: {
    color: AppColors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  analyzeContainer: {
    paddingTop: 16,
    alignItems: "center",
  },
  analyzeButton: {
    width: "100%",
    backgroundColor: AppColors.success,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppColors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonDisabled: {
    opacity: 0.8,
  },
  analyzingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  analyzeButtonText: {
    color: AppColors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  analyzingHint: {
    marginTop: 12,
    fontSize: 13,
    color: AppColors.gray500,
  },
});
