/**
 * Sign Up Screen - HealthGuard Vision
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
  Pressable,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/auth-context";
import { AppColors } from "@/constants/colors";

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup() {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !sex.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(
        firstName.trim(),
        lastName.trim(),
        sex.trim(),
        email.trim(),
        password,
      );
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message || "Could not create account");
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
          <Text style={styles.appName}>HealthGuard</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start monitoring your health today
          </Text>

          {/* First Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={AppColors.gray400}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor={AppColors.gray400}
              value={firstName}
              onChangeText={setFirstName}
              autoComplete="given-name"
            />
          </View>

          {/* Last Name Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={AppColors.gray400}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor={AppColors.gray400}
              value={lastName}
              onChangeText={setLastName}
              autoComplete="family-name"
            />
          </View>

          {/* Sex Selection */}
          <View style={styles.sexContainer}>
            <View style={styles.sexLabelRow}>
              <Ionicons
                name="male-female-outline"
                size={20}
                color={AppColors.gray400}
                style={styles.inputIcon}
              />
              <Text style={styles.sexLabel}>Sex</Text>
            </View>
            <View style={styles.radioGroup}>
              <Pressable
                style={[
                  styles.radioOption,
                  sex === "M" && styles.radioOptionSelected,
                ]}
                onPress={() => setSex("M")}
              >
                <View
                  style={[
                    styles.radioButton,
                    sex === "M" && styles.radioButtonSelected,
                  ]}
                >
                  {sex === "M" && <View style={styles.radioButtonInner} />}
                </View>
                <Text
                  style={[
                    styles.radioText,
                    sex === "M" && styles.radioTextSelected,
                  ]}
                >
                  Male
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.radioOption,
                  sex === "F" && styles.radioOptionSelected,
                ]}
                onPress={() => setSex("F")}
              >
                <View
                  style={[
                    styles.radioButton,
                    sex === "F" && styles.radioButtonSelected,
                  ]}
                >
                  {sex === "F" && <View style={styles.radioButtonInner} />}
                </View>
                <Text
                  style={[
                    styles.radioText,
                    sex === "F" && styles.radioTextSelected,
                  ]}
                >
                  Female
                </Text>
              </Pressable>
            </View>
          </View>

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
              placeholder="Email address"
              placeholderTextColor={AppColors.gray400}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={AppColors.gray400}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password (min. 6 characters)"
              placeholderTextColor={AppColors.gray400}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={AppColors.gray400}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={AppColors.gray400}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={AppColors.gray400}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          {/* Terms */}
          <View style={styles.termsRow}>
            <Text style={styles.terms}>By signing up, you agree to our </Text>
            <Link href="/(legal)/terms" asChild>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Terms of Service</Text>
              </TouchableOpacity>
            </Link>
            <Text style={styles.terms}> and </Text>
            <Link href="/(legal)/privacy" asChild>
              <TouchableOpacity>
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={AppColors.white} />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
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
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: AppColors.primaryBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: AppColors.primary,
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
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: AppColors.gray900,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.gray500,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  eyeIcon: {
    padding: 4,
  },
  sexContainer: {
    marginBottom: 16,
  },
  sexLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sexLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.gray900,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 16,
  },
  radioOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: AppColors.inputBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: AppColors.gray200,
  },
  radioOptionSelected: {
    borderColor: AppColors.primary,
    backgroundColor: `${AppColors.primary}10`,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AppColors.gray300,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: AppColors.primary,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.primary,
  },
  radioText: {
    fontSize: 15,
    color: AppColors.gray700,
    fontWeight: "500",
  },
  radioTextSelected: {
    color: AppColors.primary,
    fontWeight: "600",
  },
  terms: {
    fontSize: 13,
    color: AppColors.gray500,
    lineHeight: 18,
  },
  termsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  termsLink: {
    fontSize: 13,
    color: AppColors.primary,
    fontWeight: "600",
    lineHeight: 18,
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
