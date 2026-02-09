/**
 * Capture Screen - HealthGuard Vision
 * Camera / photo picker for taking health scan images
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/colors';
import { uploadImageForAnalysis } from '@/services/api';

const { width } = Dimensions.get('window');

const SCAN_CONFIG = {
  eye: {
    title: 'Eye Scan',
    instruction: 'Take a clear photo of your eye in good lighting',
    tips: ['Look straight at the camera', 'Ensure bright, even lighting', 'Hold steady for a clear shot'],
    icon: 'eye-outline' as const,
    color: AppColors.eyeScan,
    bgColor: '#F3E8FF',
  },
  skin: {
    title: 'Skin Scan',
    instruction: 'Take a photo of the skin area you want to analyze',
    tips: ['Capture the affected area clearly', 'Use natural light if possible', 'Keep camera 15-20cm away'],
    icon: 'body-outline' as const,
    color: AppColors.skinScan,
    bgColor: '#FFF7ED',
  },
  nail: {
    title: 'Nail Scan',
    instruction: 'Take a photo of your fingernails on a flat surface',
    tips: ['Place hand on a flat, well-lit surface', 'Capture all nails if possible', 'Remove nail polish first'],
    icon: 'hand-left-outline' as const,
    color: AppColors.nailScan,
    bgColor: '#FDF2F8',
  },
};

export default function CaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const scanType = (type as 'eye' | 'skin' | 'nail') || 'eye';
  const config = SCAN_CONFIG[scanType];

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
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
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Gallery access is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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
      const record = await uploadImageForAnalysis(imageUri, scanType);
      setIsAnalyzing(false);
      router.push({
        pathname: '/results',
        params: {
          type: scanType,
          imageUri,
          resultId: record._id,
        },
      });
    } catch (error: any) {
      setIsAnalyzing(false);
      Alert.alert(
        'Analysis Failed',
        error.message || 'Could not analyze the image. Please try again.',
      );
    }
  }

  function resetImage() {
    setImageUri(null);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerIconContainer, { backgroundColor: config.bgColor }]}>
          <Ionicons name={config.icon} size={24} color={config.color} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{config.title}</Text>
          <Text style={styles.headerSubtitle}>{config.instruction}</Text>
        </View>
      </View>

      {/* Image Preview or Capture Area */}
      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.previewImage} contentFit="cover" />
          <TouchableOpacity style={styles.retakeBtn} onPress={resetImage}>
            <Ionicons name="refresh" size={20} color={AppColors.white} />
            <Text style={styles.retakeBtnText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.captureArea}>
          <View style={[styles.captureIconBg, { backgroundColor: config.bgColor }]}>
            <Ionicons name={config.icon} size={64} color={config.color} />
          </View>

          {/* Tips */}
          <View style={styles.tipsContainer}>
            {config.tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={18} color={AppColors.success} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          {/* Capture Buttons */}
          <View style={styles.captureButtons}>
            <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
              <Ionicons name="camera" size={28} color={AppColors.white} />
              <Text style={styles.cameraButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
              <Ionicons name="images-outline" size={24} color={AppColors.primary} />
              <Text style={styles.galleryButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Analyze Button */}
      {imageUri && (
        <View style={styles.analyzeContainer}>
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={analyzeImage}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <View style={styles.analyzingContent}>
                <ActivityIndicator color={AppColors.white} />
                <Text style={styles.analyzeButtonText}>Analyzing...</Text>
              </View>
            ) : (
              <View style={styles.analyzingContent}>
                <Ionicons name="scan" size={22} color={AppColors.white} />
                <Text style={styles.analyzeButtonText}>Analyze Image</Text>
              </View>
            )}
          </TouchableOpacity>

          {isAnalyzing && (
            <Text style={styles.analyzingHint}>
              Our AI is processing your image...
            </Text>
          )}
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
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
    overflow: 'hidden',
    backgroundColor: AppColors.gray100,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  retakeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retakeBtnText: {
    color: AppColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  captureArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureIconBg: {
    width: 120,
    height: 120,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  tipsContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 36,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: AppColors.white,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
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
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cameraButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '700',
  },
  galleryButton: {
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
  galleryButtonText: {
    color: AppColors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  analyzeContainer: {
    paddingTop: 16,
    alignItems: 'center',
  },
  analyzeButton: {
    width: '100%',
    backgroundColor: AppColors.success,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  analyzeButtonText: {
    color: AppColors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  analyzingHint: {
    marginTop: 12,
    fontSize: 13,
    color: AppColors.gray500,
  },
});
