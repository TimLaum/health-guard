/**
 * Privacy Policy - HealthGuard Vision
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/colors';

const LAST_UPDATED = 'February 9, 2026';

const HIGHLIGHTS = [
  { icon: 'shield-checkmark-outline' as const, text: 'HIPAA-compliant data handling' },
  { icon: 'lock-closed-outline' as const, text: 'End-to-end encryption for images' },
  { icon: 'trash-outline' as const, text: 'Right to delete all your data' },
  { icon: 'cloud-offline-outline' as const, text: 'Images not shared with third parties' },
];

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content:
      'We collect the following types of information:\n\n• Account Information: Full name, email address, and encrypted password when you create an account.\n\n• Health Images: Photographs of eyes, skin, and nails that you voluntarily upload for analysis.\n\n• Analysis Results: AI-generated screening results, confidence scores, and recommendations.\n\n• Usage Data: App usage patterns, device information, and crash reports to improve our service.\n\n• Technical Data: Device type, operating system, IP address, and app version.',
  },
  {
    title: '2. How We Use Your Information',
    content:
      'Your information is used to:\n\n• Provide AI-powered health screening analysis\n• Store and display your analysis history\n• Improve our AI models and detection accuracy\n• Send important service notifications\n• Comply with legal and regulatory requirements\n• Ensure the security and integrity of our service',
  },
  {
    title: '3. HIPAA Compliance',
    content:
      'HealthGuard Vision is designed with HIPAA (Health Insurance Portability and Accountability Act) compliance in mind:\n\n• All health data is encrypted at rest and in transit\n• Access to patient data is strictly controlled and logged\n• We maintain audit trails for all data access\n• Data is stored in secure, HIPAA-compliant cloud infrastructure\n• Business Associate Agreements (BAAs) are in place with all data processors',
  },
  {
    title: '4. Data Storage & Security',
    content:
      'Your data is stored securely using:\n\n• AES-256 encryption for data at rest\n• TLS 1.3 for data in transit\n• MongoDB with encryption at rest on Azure cloud infrastructure\n• JWT-based authentication with token rotation\n• Regular security audits and penetration testing\n\nImages are stored separately from personal identifiers to minimize risk.',
  },
  {
    title: '5. Data Sharing',
    content:
      'We do NOT sell your personal data. We may share data only:\n\n• With your explicit consent\n• With service providers who assist in operating the App (under strict data protection agreements)\n• When required by law or legal process\n• To protect the safety and security of our users\n\nAI model training uses anonymized and de-identified data only.',
  },
  {
    title: '6. Your Rights',
    content:
      'You have the right to:\n\n• Access: Request a copy of all data we hold about you\n• Correction: Update or correct your personal information\n• Deletion: Request complete deletion of your account and all associated data\n• Export: Download your health records in a standard format\n• Restriction: Limit how we process your data\n• Withdraw Consent: Opt out of data processing at any time\n\nTo exercise these rights, use the settings in your Profile or contact us directly.',
  },
  {
    title: '7. Data Retention',
    content:
      'We retain your data as follows:\n\n• Account data: Until you delete your account\n• Health images: 12 months after upload, then automatically deleted\n• Analysis results: Until you delete your account\n• Usage logs: 90 days\n\nYou can delete all your data at any time from the Profile settings.',
  },
  {
    title: '8. Children\'s Privacy',
    content:
      'HealthGuard Vision is not intended for use by individuals under 16 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child under 16, we will delete it immediately.',
  },
  {
    title: '9. Changes to This Policy',
    content:
      'We may update this Privacy Policy periodically. We will notify you of significant changes via in-app notification or email. Your continued use of the App after changes constitutes acceptance of the updated policy.',
  },
  {
    title: '10. Contact Us',
    content:
      'For privacy-related inquiries:\n\nData Protection Officer\nEmail: privacy@healthguard-vision.app\nAddress: HealthGuard Vision, University Project\n\nWe aim to respond to all privacy requests within 30 days.',
  },
];

export default function PrivacyScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: {LAST_UPDATED}</Text>
      </View>

      {/* Highlights */}
      <View style={styles.highlightsCard}>
        <Text style={styles.highlightsTitle}>Key Highlights</Text>
        {HIGHLIGHTS.map((item, index) => (
          <View key={index} style={styles.highlightRow}>
            <Ionicons name={item.icon} size={18} color={AppColors.success} />
            <Text style={styles.highlightText}>{item.text}</Text>
          </View>
        ))}
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
    marginBottom: 20,
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
  highlightsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  highlightsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.success,
    marginBottom: 12,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 14,
    color: AppColors.gray700,
    fontWeight: '500',
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
