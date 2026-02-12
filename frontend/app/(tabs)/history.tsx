/**
 * History Screen - HealthGuard Vision
 * Shows past analysis results
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "@/constants/colors";
import { HistoryRecord, getAnalysisHistory } from "@/services/api";

// ─── Helpers ─────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  eye: {
    icon: "eye-outline" as const,
    label: "Eye Scan",
    color: AppColors.eyeScan,
    bgColor: "#F3E8FF",
  },
  skin: {
    icon: "body-outline" as const,
    label: "Skin Scan",
    color: AppColors.skinScan,
    bgColor: "#FFF7ED",
  },
  nail: {
    icon: "hand-left-outline" as const,
    label: "Nail Scan",
    color: AppColors.nailScan,
    bgColor: "#FDF2F8",
  },
};

type FilterType = "all" | "eye" | "skin" | "nail";

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>("all");
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      const data = await getAnalysisHistory();
      setHistory(data);
    } catch {
      // API not available yet — show empty state
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredHistory =
    filter === "all" ? history : history.filter((item) => item.type === filter);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function renderItem({ item }: { item: HistoryRecord }) {
    const typeConfig = TYPE_CONFIG[item.type];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/results",
            params: { historyData: JSON.stringify(item), type: item.type },
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.cardLeft}>
          <View
            style={[styles.typeIcon, { backgroundColor: typeConfig.bgColor }]}
          >
            <Ionicons
              name={typeConfig.icon}
              size={22}
              color={typeConfig.color}
            />
          </View>
        </View>

        <View style={styles.cardCenter}>
          <Text style={styles.cardType}>{typeConfig.label}</Text>
          <Text style={styles.cardCondition} numberOfLines={1}>
            {item.message}
          </Text>
          <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
        </View>

        {item.hb_level ? (
          <View style={styles.cardRight}>
            <Text style={styles.hbBadgeText}>{item.hb_level}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  }

  function renderEmpty() {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="document-text-outline"
          size={64}
          color={AppColors.gray300}
        />
        <Text style={styles.emptyTitle}>No scans yet</Text>
        <Text style={styles.emptySubtitle}>
          Your analysis history will appear here after your first scan
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push("/(tabs)/capture")}
        >
          <Text style={styles.emptyButtonText}>Start Your First Scan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>{history.length} total scans</Text>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {(["all", "eye", "skin", "nail"] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f === "all" ? "All" : TYPE_CONFIG[f].label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
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
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: AppColors.gray900,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.gray500,
    marginTop: 2,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  filterChipActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.gray600,
  },
  filterTextActive: {
    color: AppColors.white,
  },
  listContent: {
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: {
    marginRight: 14,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCenter: {
    flex: 1,
  },
  cardType: {
    fontSize: 15,
    fontWeight: "700",
    color: AppColors.gray900,
  },
  cardCondition: {
    fontSize: 13,
    color: AppColors.gray500,
    marginTop: 2,
  },
  cardDate: {
    fontSize: 12,
    color: AppColors.gray400,
    marginTop: 4,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  hbBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: AppColors.primary,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AppColors.gray700,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.gray400,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: 24,
    backgroundColor: AppColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptyButtonText: {
    color: AppColors.white,
    fontSize: 15,
    fontWeight: "700",
  },
});
