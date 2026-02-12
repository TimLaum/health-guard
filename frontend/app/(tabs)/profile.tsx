/**
 * Profile Screen - HealthGuard Vision
 * User settings and account management
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Share,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "@/constants/colors";
import { useAuth } from "@/contexts/auth-context";
import {
  updateProfileApi,
  changePasswordApi,
  exportDataApi,
  deleteHistoryApi,
} from "@/services/api";

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
  const { user, logout, refreshProfile } = useAuth();

  // Edit Profile modal
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState(user?.firstname || "");
  const [editLastName, setEditLastName] = useState(user?.lastname || "");
  const [editLoading, setEditLoading] = useState(false);

  // Change Password modal
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const displayName = user
    ? `${user.firstname} ${user.lastname}`
    : "Utilisateur";
  const displayEmail = user?.email || "";
  const initials = user
    ? `${user.firstname[0]}${user.lastname[0]}`.toUpperCase()
    : "U";

  const scanCount = (user as any)?.scan_count ?? 0;

  // Calculate months since registration
  function getMonthsSince(dateStr?: string): number {
    if (!dateStr) return 0;
    const created = new Date(dateStr);
    if (isNaN(created.getTime())) return 0;
    const now = new Date();
    const months =
      (now.getFullYear() - created.getFullYear()) * 12 +
      (now.getMonth() - created.getMonth());
    return Math.max(months, 1);
  }

  const monthCount = getMonthsSince(user?.created_at);

  // ── Edit Profile ──
  async function handleSaveProfile() {
    if (!editFirstName.trim() || !editLastName.trim()) {
      Alert.alert("Erreur", "Le prénom et le nom sont requis");
      return;
    }
    setEditLoading(true);
    try {
      await updateProfileApi(editFirstName.trim(), editLastName.trim());
      await refreshProfile();
      setShowEditProfile(false);
      Alert.alert("Succès", "Profil mis à jour avec succès");
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de mettre à jour le profil",
      );
    } finally {
      setEditLoading(false);
    }
  }

  // ── Change Password ──
  async function handleChangePassword() {
    if (!oldPassword || !newPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(
        "Erreur",
        "Le nouveau mot de passe doit contenir au moins 6 caractères",
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }
    setPasswordLoading(true);
    try {
      await changePasswordApi(oldPassword, newPassword);
      setShowChangePassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      Alert.alert("Succès", "Mot de passe modifié avec succès");
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de changer le mot de passe",
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  // ── Export Data ──
  async function handleExportData() {
    try {
      const data = await exportDataApi();
      const jsonStr = JSON.stringify(data, null, 2);
      if (Platform.OS === "web") {
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "healthguard_export.json";
        a.click();
      } else {
        await Share.share({
          message: jsonStr,
          title: "Export HealthGuard",
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible d'exporter les données",
      );
    }
  }

  // ── Delete All Data ──
  function handleDeleteAllData() {
    Alert.alert(
      "Supprimer toutes les données",
      "Cette action est irréversible. Tout votre historique de scans sera supprimé. Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await deleteHistoryApi();
              Alert.alert("Succès", result.message || "Historique supprimé");
            } catch (error: any) {
              Alert.alert(
                "Erreur",
                error.message || "Impossible de supprimer les données",
              );
            }
          },
        },
      ],
    );
  }

  function handleLogout() {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: "Compte",
      items: [
        {
          icon: "person-outline",
          label: "Modifier le profil",
          subtitle: "Nom, prénom",
          onPress: () => {
            setEditFirstName(user?.firstname || "");
            setEditLastName(user?.lastname || "");
            setShowEditProfile(true);
          },
        },
        {
          icon: "lock-closed-outline",
          label: "Changer le mot de passe",
          subtitle: "Mettre à jour votre mot de passe",
          onPress: () => {
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setShowChangePassword(true);
          },
        },
        {
          icon: "shield-outline",
          label: "Confidentialité & Sécurité",
          subtitle: "Paramètres de protection des données",
          onPress: () => router.push("/(legal)/privacy"),
        },
      ],
    },
    {
      title: "Données de santé",
      items: [
        {
          icon: "download-outline",
          label: "Exporter les données",
          subtitle: "Télécharger vos données de santé",
          onPress: handleExportData,
        },
        {
          icon: "trash-outline",
          label: "Supprimer toutes les données",
          subtitle: "Effacer tout l'historique de scans",
          color: AppColors.danger,
          danger: true,
          onPress: handleDeleteAllData,
        },
      ],
    },
    {
      title: "Application",
      items: [
        {
          icon: "notifications-outline",
          label: "Notifications",
          subtitle: "Gérer les préférences de notifications",
          onPress: () => {},
        },
        {
          icon: "book-outline",
          label: "Guide d'utilisation",
          subtitle: "Comment utiliser HealthGuard",
          onPress: () => router.push("/guide"),
        },
        {
          icon: "document-text-outline",
          label: "Conditions d'utilisation",
          subtitle: "Termes et conditions",
          onPress: () => router.push("/(legal)/terms"),
        },
        {
          icon: "information-circle-outline",
          label: "À propos de HealthGuard",
          subtitle: "Version 1.0.0",
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
            <Text style={styles.statNumber}>{scanCount}</Text>
            <Text style={styles.statLabel}>Scans</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{monthCount}</Text>
            <Text style={styles.statLabel}>Mois</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: AppColors.success }]}>
              Bon
            </Text>
            <Text style={styles.statLabel}>Statut</Text>
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
                    {
                      backgroundColor: item.danger
                        ? "#FEF2F2"
                        : AppColors.primaryBg,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.color || AppColors.primary}
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text
                    style={[
                      styles.menuLabel,
                      item.danger && { color: AppColors.danger },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={AppColors.gray300}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={AppColors.danger} />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />

      {/* ── Edit Profile Modal ── */}
      <Modal visible={showEditProfile} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>

            <Text style={styles.inputLabel}>Prénom</Text>
            <TextInput
              style={styles.modalInput}
              value={editFirstName}
              onChangeText={setEditFirstName}
              placeholder="Prénom"
              placeholderTextColor={AppColors.gray400}
            />

            <Text style={styles.inputLabel}>Nom</Text>
            <TextInput
              style={styles.modalInput}
              value={editLastName}
              onChangeText={setEditLastName}
              placeholder="Nom"
              placeholderTextColor={AppColors.gray400}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowEditProfile(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSaveBtn, editLoading && { opacity: 0.7 }]}
                onPress={handleSaveProfile}
                disabled={editLoading}
              >
                {editLoading ? (
                  <ActivityIndicator color={AppColors.white} size="small" />
                ) : (
                  <Text style={styles.modalSaveText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Change Password Modal ── */}
      <Modal visible={showChangePassword} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Changer le mot de passe</Text>

            <Text style={styles.inputLabel}>Ancien mot de passe</Text>
            <TextInput
              style={styles.modalInput}
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="Ancien mot de passe"
              placeholderTextColor={AppColors.gray400}
              secureTextEntry
            />

            <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
            <TextInput
              style={styles.modalInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nouveau mot de passe (min. 6 car.)"
              placeholderTextColor={AppColors.gray400}
              secureTextEntry
            />

            <Text style={styles.inputLabel}>Confirmer le mot de passe</Text>
            <TextInput
              style={styles.modalInput}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Confirmer le nouveau mot de passe"
              placeholderTextColor={AppColors.gray400}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowChangePassword(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalSaveBtn,
                  passwordLoading && { opacity: 0.7 },
                ]}
                onPress={handleChangePassword}
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <ActivityIndicator color={AppColors.white} size="small" />
                ) : (
                  <Text style={styles.modalSaveText}>Confirmer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    alignItems: "center",
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: AppColors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: AppColors.gray900,
  },
  email: {
    fontSize: 14,
    color: AppColors.gray500,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
    width: "100%",
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
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
    fontWeight: "600",
    color: AppColors.gray500,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: AppColors.white,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.gray900,
  },
  menuSubtitle: {
    fontSize: 12,
    color: AppColors.gray400,
    marginTop: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: AppColors.white,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginTop: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.danger,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.gray900,
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.gray600,
    marginBottom: 6,
    marginLeft: 4,
  },
  modalInput: {
    backgroundColor: AppColors.inputBg || "#F9FAFB",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 16,
    color: AppColors.gray900,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: AppColors.gray100,
    borderRadius: 14,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.gray600,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: "700",
    color: AppColors.white,
  },
});
