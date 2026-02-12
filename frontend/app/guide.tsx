/**
 * Guide Screen - HealthGuard Vision
 * User guide / documentation tab explaining how to use the app
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "@/constants/colors";

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
    icon: "scan-outline",
    title: "Choisir un type de scan",
    description:
      "Depuis l'écran d'accueil, sélectionnez le type de scan à effectuer : Scan Oculaire (indicateurs de diabète), Scan Cutané (carences nutritionnelles), ou Scan Ongles (signes d'anémie).",
    color: AppColors.primary,
    bgColor: AppColors.primaryBg,
  },
  {
    number: 2,
    icon: "camera-outline",
    title: "Prendre une photo",
    description:
      "Prenez une photo nette avec votre caméra ou sélectionnez-en une depuis votre galerie. Assurez-vous que la zone est bien éclairée et que l'image est nette. Suivez les conseils à l'écran pour de meilleurs résultats.",
    color: AppColors.eyeScan,
    bgColor: "#F3E8FF",
  },
  {
    number: 3,
    icon: "analytics-outline",
    title: "Analyse par IA",
    description:
      "Notre système d'IA analyse votre photo à l'aide de modèles TensorFlow Lite entraînés sur des jeux de données médicales. L'analyse ne prend que quelques secondes.",
    color: AppColors.skinScan,
    bgColor: "#FFF7ED",
  },
  {
    number: 4,
    icon: "document-text-outline",
    title: "Voir les résultats",
    description:
      "Obtenez un rapport détaillé avec la condition détectée, le score de confiance, le niveau de sévérité et des recommandations de santé personnalisées.",
    color: AppColors.nailScan,
    bgColor: "#FDF2F8",
  },
  {
    number: 5,
    icon: "time-outline",
    title: "Suivre votre historique",
    description:
      "Tous vos scans sont sauvegardés dans l'onglet Historique. Surveillez les changements au fil du temps et partagez les résultats avec votre médecin.",
    color: AppColors.success,
    bgColor: "#ECFDF5",
  },
];

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Est-ce un diagnostic médical ?",
    answer:
      "Non. HealthGuard Vision est un outil d'aide au dépistage. Il utilise l'IA pour identifier des indicateurs de santé potentiels mais NE fournit PAS de diagnostic médical. Consultez toujours un professionnel de santé qualifié pour une évaluation complète.",
  },
  {
    question: "Quelle est la précision des résultats ?",
    answer:
      "Nos modèles d'IA ont été entraînés sur des jeux de données médicales et fournissent un score de confiance avec chaque analyse. Bien que la précision varie selon la condition, les résultats doivent être utilisés comme indicateurs de dépistage préliminaires, pas comme des conclusions définitives.",
  },
  {
    question: "Mes données de santé sont-elles sécurisées ?",
    answer:
      "Oui. Toutes les données sont chiffrées en transit et au repos. Nous respectons les normes de conformité HIPAA. Vos images et résultats sont privés et jamais partagés avec des tiers. Vous pouvez supprimer vos données à tout moment.",
  },
  {
    question: "Quelles conditions l'application peut-elle détecter ?",
    answer:
      "• Scan Oculaire : Indicateurs de rétinopathie diabétique\n• Scan Cutané : Signes de carence en vitamine D et nutritionnelles\n• Scan Ongles : Indicateurs de carence en fer / anémie",
  },
  {
    question: "Comment prendre les photos ?",
    answer:
      "• Utilisez un éclairage naturel ou vif et uniforme\n• Gardez la caméra stable et bien focalisée\n• Yeux : Regardez droit vers la caméra\n• Peau : Capturez la zone à 15–20 cm\n• Ongles : Placez la main sur une surface plane, retirez le vernis",
  },
  {
    question: "Puis-je supprimer mes données ?",
    answer:
      "Oui. Allez dans Profil → Supprimer toutes les données pour effacer votre historique de scans. Pour supprimer entièrement votre compte, contactez notre équipe support. Toutes les données sont définitivement supprimées sous 30 jours.",
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
            source={require("@/assets/images/logo.png")}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />
        </View>
        <View>
          <Text style={styles.headerTitle}>Guide d'utilisation</Text>
          <Text style={styles.headerSubtitle}>
            Apprenez à utiliser HealthGuard
          </Text>
        </View>
      </View>

      {/* How It Works */}
      <Text style={styles.sectionTitle}>Comment ça marche</Text>
      <Text style={styles.sectionSubtitle}>Suivez ces étapes simples</Text>

      {STEPS.map((step) => (
        <View key={step.number} style={styles.stepCard}>
          <View style={styles.stepLeft}>
            <View
              style={[styles.stepNumber, { backgroundColor: step.bgColor }]}
            >
              <Text style={[styles.stepNumberText, { color: step.color }]}>
                {step.number}
              </Text>
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
      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
        Types de scan
      </Text>

      <View style={styles.scanTypesRow}>
        <View
          style={[
            styles.scanTypeCard,
            { borderColor: AppColors.eyeScan + "40" },
          ]}
        >
          <View style={[styles.scanTypeIcon, { backgroundColor: "#F3E8FF" }]}>
            <Ionicons name="eye-outline" size={26} color={AppColors.eyeScan} />
          </View>
          <Text style={styles.scanTypeName}>Yeux</Text>
          <Text style={styles.scanTypeDetects}>Diabète</Text>
        </View>
        <View
          style={[
            styles.scanTypeCard,
            { borderColor: AppColors.skinScan + "40" },
          ]}
        >
          <View style={[styles.scanTypeIcon, { backgroundColor: "#FFF7ED" }]}>
            <Ionicons
              name="body-outline"
              size={26}
              color={AppColors.skinScan}
            />
          </View>
          <Text style={styles.scanTypeName}>Peau</Text>
          <Text style={styles.scanTypeDetects}>Carences</Text>
        </View>
        <View
          style={[
            styles.scanTypeCard,
            { borderColor: AppColors.nailScan + "40" },
          ]}
        >
          <View style={[styles.scanTypeIcon, { backgroundColor: "#FDF2F8" }]}>
            <Ionicons
              name="hand-left-outline"
              size={26}
              color={AppColors.nailScan}
            />
          </View>
          <Text style={styles.scanTypeName}>Ongles</Text>
          <Text style={styles.scanTypeDetects}>Anémie</Text>
        </View>
      </View>

      {/* FAQ */}
      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
        Questions fréquentes
      </Text>

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
              name={expandedFaq === index ? "chevron-up" : "chevron-down"}
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
          <Text style={styles.noticeTitle}>Avertissement important</Text>
          <Text style={styles.noticeText}>
            HealthGuard Vision est un outil de dépistage assisté par IA. Il ne
            remplace pas les conseils médicaux professionnels, le diagnostic ou
            le traitement. Consultez toujours l'avis de votre médecin ou d'un
            professionnel de santé qualifié pour toute question concernant une
            condition médicale.
          </Text>
        </View>
      </View>

      {/* Quick Links */}
      <View style={styles.linksCard}>
        <Text style={styles.linksTitle}>Liens rapides</Text>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => router.push("/(legal)/terms")}
        >
          <Ionicons
            name="document-text-outline"
            size={18}
            color={AppColors.primary}
          />
          <Text style={styles.linkText}>Conditions d'utilisation</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={AppColors.gray300}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => router.push("/(legal)/privacy")}
        >
          <Ionicons name="shield-outline" size={18} color={AppColors.primary} />
          <Text style={styles.linkText}>Politique de confidentialité</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={AppColors.gray300}
          />
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
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: AppColors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: AppColors.gray900,
  },
  headerSubtitle: {
    fontSize: 14,
    color: AppColors.gray500,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.gray900,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: AppColors.gray500,
    marginBottom: 20,
  },
  stepCard: {
    flexDirection: "row",
    marginBottom: 4,
  },
  stepLeft: {
    alignItems: "center",
    width: 40,
    marginRight: 14,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontSize: 15,
    fontWeight: "800",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: AppColors.gray900,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 13,
    color: AppColors.gray500,
    lineHeight: 20,
  },
  scanTypesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  scanTypeCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  scanTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  scanTypeName: {
    fontSize: 15,
    fontWeight: "700",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
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
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 15,
    fontWeight: "700",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  linksTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: AppColors.gray900,
    marginBottom: 12,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray100,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.gray700,
  },
});
