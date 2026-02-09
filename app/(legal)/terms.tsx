/**
 * Terms of Service - HealthGuard Vision
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppColors } from '@/constants/colors';

const LAST_UPDATED = 'February 9, 2026';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By downloading, installing, or using the HealthGuard Vision application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the App.',
  },
  {
    title: '2. Description of Service',
    content:
      'HealthGuard Vision is a mobile health screening application that uses artificial intelligence to analyze photographs of eyes, skin, and nails to provide preliminary health assessments. The App is designed for informational and educational purposes only.',
  },
  {
    title: '3. Medical Disclaimer',
    content:
      'THE APP IS NOT A MEDICAL DEVICE AND IS NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY DISEASE OR HEALTH CONDITION. The results provided by the App are preliminary screenings based on AI analysis and should NOT be considered as medical diagnoses. Always consult a qualified healthcare professional for proper medical evaluation, diagnosis, and treatment. Never disregard professional medical advice or delay seeking it because of information obtained through the App.',
  },
  {
    title: '4. User Accounts',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate, current, and complete information during registration. You must notify us immediately of any unauthorized use of your account.',
  },
  {
    title: '5. User Responsibilities',
    content:
      'You agree to: (a) use the App only for its intended purpose; (b) not upload images that are not your own without proper consent; (c) not attempt to reverse-engineer, decompile, or modify the App; (d) not use the App for any unlawful purpose; (e) ensure any images uploaded are appropriate and relevant to health screening.',
  },
  {
    title: '6. Data Collection & Usage',
    content:
      'We collect and process health-related images and personal data as described in our Privacy Policy. By using the App, you consent to the collection, processing, and storage of your data in accordance with our Privacy Policy and applicable data protection laws, including HIPAA compliance standards.',
  },
  {
    title: '7. Intellectual Property',
    content:
      'The App, including its AI models, design, code, and content, is the intellectual property of HealthGuard Vision. You are granted a limited, non-exclusive, non-transferable license to use the App for personal, non-commercial purposes.',
  },
  {
    title: '8. Limitation of Liability',
    content:
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, HEALTHGUARD VISION SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE APP. Our total liability shall not exceed the amount paid by you for the App in the twelve (12) months preceding the claim.',
  },
  {
    title: '9. Termination',
    content:
      'We reserve the right to suspend or terminate your access to the App at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.',
  },
  {
    title: '10. Changes to Terms',
    content:
      'We may update these Terms from time to time. We will notify you of significant changes through the App or via email. Your continued use of the App after changes constitutes acceptance of the revised Terms.',
  },
  {
    title: '11. Governing Law',
    content:
      'These Terms are governed by and construed in accordance with the laws of the applicable jurisdiction. Any disputes arising from these Terms shall be resolved through binding arbitration.',
  },
  {
    title: '12. Contact',
    content:
      'For questions about these Terms, please contact us at:\n\nEmail: legal@healthguard-vision.app\nAddress: HealthGuard Vision, University Project\n\nThis application is developed as part of an M1 academic project.',
  },
];

export default function TermsScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last updated: {LAST_UPDATED}</Text>
      </View>

      {/* Sections */}
      {SECTIONS.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}

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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 13,
    color: AppColors.gray400,
  },
  section: {
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.gray900,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: AppColors.gray600,
    lineHeight: 22,
  },
});
