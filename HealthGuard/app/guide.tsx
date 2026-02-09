/**
 * Guide Screen - HealthGuard Vision
 * User guide / documentation tab explaining how to use the app
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/colors';

interface GuideStep {
  number: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const STEPS: GuideStep[] = [
  {
    number: 1,
    icon: 'scan-outline',
    title: 'Choose a Scan Type',
    description:
      'From the Home screen, select the type of scan you want to perform: Eye Scan (diabetes indicators), Skin Scan (nutritional deficiencies), or Nail Scan (anemia signs).',
    color: AppColors.primary,
    bgColor: AppColors.primaryBg,
  },
  {
    number: 2,
    icon: 'camera-outline',
    title: 'Capture a Photo',
    description:
      'Take a clear photo using your camera or select one from your gallery. Make sure the area is well-lit and the image is focused. Follow the on-screen tips for best results.',
    color: AppColors.eyeScan,
    bgColor: '#F3E8FF',
  },
  {
    number: 3,
    icon: 'analytics-outline',
    title: 'AI Analysis',
    description:
      'Our AI-powered system analyzes your photo using TensorFlow Lite models trained on medical datasets. The analysis takes just a few seconds.',
    color: AppColors.skinScan,
    bgColor: '#FFF7ED',
  },
  {
    number: 4,
    icon: 'document-text-outline',
    title: 'View Results',
    description:
      'Get a detailed report with the detected condition, confidence score, severity level, and personalized health recommendations.',
    color: AppColors.nailScan,
    bgColor: '#FDF2F8',
  },
  {
    number: 5,
    icon: 'time-outline',
    title: 'Track Your History',
    description:
      'All your scans are saved in the History tab. Monitor changes over time and share results with your healthcare provider.',
    color: AppColors.success,
    bgColor: '#ECFDF5',
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Is this a medical diagnosis?',
    answer:
      'No. HealthGuard Vision is a screening assistance tool. It uses AI to identify potential health indicators but does NOT provide medical diagnoses. Always consult a qualified healthcare professional for proper evaluation.',
  },
  {
    question: 'How accurate are the results?',
    answer:
      'Our AI models have been trained on medical datasets and provide a confidence score with each analysis. While accuracy varies by condition, results should be used as preliminary screening indicators, not definitive conclusions.',
  },
  {
    question: 'Is my health data secure?',
    answer:
      'Yes. All data is encrypted in transit and at rest. We follow HIPAA compliance standards. Your images and results are private and never shared with third parties. You can delete your data at any time.',
  },
  {
    question: 'What conditions can the app detect?',
    answer:
      '• Eye Scan: Diabetic retinopathy indicators\n• Skin Scan: Vitamin D and nutritional deficiency signs\n• Nail Scan: Iron deficiency / anemia indicators',
  },
  {
    question: 'How should I take the photos?',
    answer:
      '• Use natural or bright, even lighting\n• Keep the camera steady and focused\n• Eye: Look straight at the camera\n• Skin: Capture the area from 15–20 cm away\n• Nails: Place hand on a flat surface, remove nail polish',
  },
  {
    question: 'Can I delete my data?',
    answer:
      'Yes. Go to Profile → Delete All Data to remove your scan history. To delete your account entirely, contact our support team. All data is permanently removed within 30 days.',
  },
];

export default function GuideScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />
        </View>
        <View>
          <Text style={styles.headerTitle}>User Guide</Text>
          <Text style={styles.headerSubtitle}>Learn how to use HealthGuard</Text>
        </View>
      </View>

      {/* How It Works */}
      <Text style={styles.sectionTitle}>How It Works</Text>
      <Text style={styles.sectionSubtitle}>Follow these simple steps</Text>

      {STEPS.map((step) => (
        <View key={step.number} style={styles.stepCard}>
          <View style={styles.stepLeft}>
            <View style={[styles.stepNumber, { backgroundColor: step.bgColor }]}>
              <Text style={[styles.stepNumberText, { color: step.color }]}>{step.number}</Text>
            </View>
            {step.number < STEPS.length && <View style={styles.stepLine} />}
          </View>
          <View style={styles.stepRight}>
            <View style={[styles.stepIcon, { backgroundColor: step.bgColor }]}>
              <Ionicons name={step.icon} size={22} color={step.color} />
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        </View>
      ))}

      {/* Scan Types */}
      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Scan Types</Text>

      <View style={styles.scanTypesRow}>
        <View style={[styles.scanTypeCard, { borderColor: AppColors.eyeScan + '40' }]}>
          <View style={[styles.scanTypeIcon, { backgroundColor: '#F3E8FF' }]}>
            <Ionicons name="eye-outline" size={26} color={AppColors.eyeScan} />
          </View>
          <Text style={styles.scanTypeName}>Eye</Text>
          <Text style={styles.scanTypeDetects}>Diabetes</Text>
        </View>
        <View style={[styles.scanTypeCard, { borderColor: AppColors.skinScan + '40' }]}>
          <View style={[styles.scanTypeIcon, { backgroundColor: '#FFF7ED' }]}>
            <Ionicons name="body-outline" size={26} color={AppColors.skinScan} />
          </View>
          <Text style={styles.scanTypeName}>Skin</Text>
          <Text style={styles.scanTypeDetects}>Deficiencies</Text>
        </View>
        <View style={[styles.scanTypeCard, { borderColor: AppColors.nailScan + '40' }]}>
          <View style={[styles.scanTypeIcon, { backgroundColor: '#FDF2F8' }]}>
            <Ionicons name="hand-left-outline" size={26} color={AppColors.nailScan} />
          </View>
          <Text style={styles.scanTypeName}>Nail</Text>
          <Text style={styles.scanTypeDetects}>Anemia</Text>
        </View>
      </View>

      {/* FAQ */}
      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Frequently Asked Questions</Text>

      {FAQS.map((faq, index) => (
        <TouchableOpacity
          key={index}
          style={styles.faqCard}
          onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
          activeOpacity={0.7}
        >
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Ionicons
              name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={AppColors.gray400}
            />
          </View>
          {expandedFaq === index && (
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          )}
        </TouchableOpacity>
      ))}

      {/* Important Notice */}
      <View style={styles.noticeCard}>
        <Ionicons name="warning-outline" size={22} color={AppColors.warning} />
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>Important Disclaimer</Text>
          <Text style={styles.noticeText}>
            HealthGuard Vision is an AI-assisted screening tool. It does not replace professional medical
            advice, diagnosis, or treatment. Always seek the advice of your physician or qualified health
            provider with any questions regarding a medical condition.
          </Text>
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.linksCard}>
        <Text style={styles.linksTitle}>Quick Links</Text>
        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/(legal)/terms')}>
          <Ionicons name="document-text-outline" size={18} color={AppColors.primary} />
          <Text style={styles.linkText}>Terms & Conditions</Text>
          <Ionicons name="chevron-forward" size={16} color={AppColors.gray300} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => router.push('/(legal)/privacy')}>
          <Ionicons name="shield-outline" size={18} color={AppColors.primary} />
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={16} color={AppColors.gray300} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.gray500,
    marginTop: 2,
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
    marginBottom: 20,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  stepLeft: {
    alignItems: 'center',
    width: 40,
    marginRight: 14,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 15,
    fontWeight: '800',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: AppColors.gray200,
    marginVertical: 4,
  },
  stepRight: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: AppColors.gray500,
    lineHeight: 20,
  },
  scanTypesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  scanTypeCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  scanTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scanTypeName: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  scanTypeDetects: {
    fontSize: 12,
    color: AppColors.gray400,
    marginTop: 2,
  },
  faqCard: {
    backgroundColor: AppColors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.gray900,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: AppColors.gray600,
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 13,
    color: AppColors.gray600,
    lineHeight: 20,
  },
  linksCard: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  linksTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
  },
});
