/**
 * Profile Screen - HealthGuard Vision
 * User settings and account management
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  color?: string;
  onPress: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const displayName = user ? `${user.first_name} ${user.last_name}` : 'User';
  const displayEmail = user?.email || '';
  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : 'U';

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          label: 'Edit Profile',
          subtitle: 'Name, email, photo',
          onPress: () => {},
        },
        {
          icon: 'lock-closed-outline',
          label: 'Change Password',
          subtitle: 'Update your password',
          onPress: () => {},
        },
        {
          icon: 'shield-outline',
          label: 'Privacy & Security',
          subtitle: 'Data protection settings',
          onPress: () => router.push('/(legal)/privacy'),
        },
      ],
    },
    {
      title: 'Health Data',
      items: [
        {
          icon: 'download-outline',
          label: 'Export Data',
          subtitle: 'Download your health records',
          onPress: () => Alert.alert('Export', 'Your data export will be ready shortly'),
        },
        {
          icon: 'trash-outline',
          label: 'Delete All Data',
          subtitle: 'Remove all scan history',
          color: AppColors.danger,
          danger: true,
          onPress: () =>
            Alert.alert('Delete All Data', 'This action cannot be undone. Continue?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => {} },
            ]),
        },
      ],
    },
    {
      title: 'App',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Notifications',
          subtitle: 'Manage notification preferences',
          onPress: () => {},
        },
        {
          icon: 'book-outline',
          label: 'App Guide',
          subtitle: 'How to use HealthGuard',
          onPress: () => router.push('/guide'),
        },
        {
          icon: 'document-text-outline',
          label: 'Terms of Service',
          subtitle: 'Terms & conditions',
          onPress: () => router.push('/(legal)/terms'),
        },
        {
          icon: 'information-circle-outline',
          label: 'About HealthGuard',
          subtitle: 'Version 1.0.0',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Scans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Months</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: AppColors.success }]}>Good</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </View>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < section.items.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
                activeOpacity={0.6}
              >
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: item.danger ? '#FEF2F2' : AppColors.primaryBg },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.color || AppColors.primary}
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuLabel, item.danger && { color: AppColors.danger }]}>
                    {item.label}
                  </Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={18} color={AppColors.gray300} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={AppColors.danger} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

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
  profileHeader: {
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  email: {
    fontSize: 14,
    color: AppColors.gray500,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
    width: '100%',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  statLabel: {
    fontSize: 12,
    color: AppColors.gray400,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: AppColors.gray200,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray500,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray100,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.gray900,
  },
  menuSubtitle: {
    fontSize: 12,
    color: AppColors.gray400,
    marginTop: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.white,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.danger,
  },
});
