/**
 * Forgot Password Screen - HealthGuard Vision
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "@/constants/colors";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleResetPassword() {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre adresse email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return;
    }

    setIsLoading(true);
    try {
      // In production: call your Flask API endpoint for password reset
      // await requestPasswordReset(email.trim());

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSent(true);
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible d'envoyer l'email de réinitialisation",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={AppColors.gray700} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={isSent ? "mail-open-outline" : "key-outline"}
              size={48}
              color={AppColors.primary}
            />
          </View>
          <Text style={styles.title}>
            {isSent ? "Vérifiez vos emails" : "Mot de passe oublié ?"}
          </Text>
          <Text style={styles.subtitle}>
            {isSent
              ? `Nous avons envoyé un lien de réinitialisation à\n${email.trim()}`
              : "Pas de souci ! Entrez votre adresse email et nous vous enverrons un lien de réinitialisation."}
          </Text>
        </View>

        {!isSent ? (
          /* Reset Form */
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={AppColors.gray400}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor={AppColors.gray400}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                autoFocus
              />
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={AppColors.white} />
              ) : (
                <Text style={styles.buttonText}>Envoyer le lien</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* Success State */
          <View style={styles.form}>
            <View style={styles.successInfo}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={AppColors.gray500}
                />
                <Text style={styles.infoText}>
                  Le lien expire dans 15 minutes
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name="folder-outline"
                  size={18}
                  color={AppColors.gray500}
                />
                <Text style={styles.infoText}>
                  Vérifiez aussi votre dossier spam
                </Text>
              </View>
            </View>

            {/* Resend Button */}
            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => {
                setIsSent(false);
                setEmail("");
              }}
            >
              <Ionicons
                name="refresh-outline"
                size={18}
                color={AppColors.primary}
              />
              <Text style={styles.outlineButtonText}>
                Essayer un autre email
              </Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.buttonText}>Retour à la connexion</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Footer */}
        {!isSent && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Vous vous souvenez du mot de passe ?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Se connecter</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: AppColors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: AppColors.gray900,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: AppColors.gray500,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    backgroundColor: AppColors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: AppColors.gray900,
  },
  button: {
    backgroundColor: AppColors.primary,
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
    gap: 8,
  },
  outlineButtonText: {
    color: AppColors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  successInfo: {
    gap: 12,
    paddingVertical: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: AppColors.gray600,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: AppColors.gray500,
  },
  footerLink: {
    fontSize: 15,
    color: AppColors.primary,
    fontWeight: "700",
  },
});
