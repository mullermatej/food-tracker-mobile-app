import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useHistoryLog } from "../hooks/useHistoryLog";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import { formatDecimalWithComma } from "../utils/numberFormat";

export const HistoryScreen = ({ navigation }) => {
  const theme = useTheme();
  const { getHistory } = useHistoryLog();
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const formatDateHeader = (dateKey) => {
    const date = parseISO(dateKey);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, d MMMM yyyy");
  };

  const formatTime = (timestamp) => {
    return format(parseISO(timestamp), "HH:mm");
  };

  const getEntryIcon = (type) => {
    switch (type) {
      case "calories":
        return "🔥";
      case "protein":
        return "💪";
      case "favourite":
        return "⭐";
      default:
        return "📝";
    }
  };

  const getEntryDescription = (entry) => {
    switch (entry.type) {
      case "calories":
        return `${entry.data.calories} cal added manually`;
      case "protein":
        return `${formatDecimalWithComma(
          entry.data.protein
        )}g protein added manually`;
      case "favourite":
        return `${entry.data.foodName} - ${
          entry.data.calories
        } cal, ${formatDecimalWithComma(entry.data.protein)}g protein`;
      default:
        return "Unknown entry";
    }
  };

  // Sort dates descending (newest first)
  const sortedDates = Object.keys(history).sort((a, b) => b.localeCompare(a));

  const styles = {
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sideLeft: {
      width: 72,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    sideRight: {
      width: 72,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    backHit: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 22,
      backgroundColor: theme.cardBackground,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    backText: { fontSize: 19, color: theme.textSecondary },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.text,
      textAlign: "center",
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
    },
    dateSection: {
      marginBottom: 24,
    },
    dateHeader: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 12,
    },
    entryCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    entryIcon: {
      fontSize: 24,
      marginRight: 12,
      width: 32,
      textAlign: "center",
    },
    entryContent: {
      flex: 1,
    },
    entryDescription: {
      fontSize: 15,
      color: theme.text,
      fontWeight: "500",
      marginBottom: 4,
    },
    entryTime: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    emptyWrap: {
      alignItems: "center",
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    emptyEmoji: {
      fontSize: 48,
      marginBottom: 12,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 6,
    },
    emptyText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
    },
    loadingWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sideLeft}>
          <Pressable
            style={({ pressed }) => [
              styles.backHit,
              pressed && { backgroundColor: theme.primary + "10" },
            ]}
            onPress={() => navigation.goBack()}
            android_ripple={{ color: theme.primary + "20", borderless: false }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>History</Text>
        <View style={styles.sideRight} />
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={theme.primary} size="large" />
        </View>
      ) : sortedDates.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptyText}>
            Your nutrition additions will appear here
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
            />
          }
        >
          {sortedDates.map((dateKey) => {
            const entries = history[dateKey] || [];
            // Sort entries by timestamp descending (newest first)
            const sortedEntries = [...entries].sort((a, b) =>
              b.timestamp.localeCompare(a.timestamp)
            );

            return (
              <View key={dateKey} style={styles.dateSection}>
                <Text style={styles.dateHeader}>
                  {formatDateHeader(dateKey)}
                </Text>
                {sortedEntries.map((entry) => (
                  <View key={entry.id} style={styles.entryCard}>
                    <Text style={styles.entryIcon}>
                      {getEntryIcon(entry.type)}
                    </Text>
                    <View style={styles.entryContent}>
                      <Text style={styles.entryDescription}>
                        {getEntryDescription(entry)}
                      </Text>
                      <Text style={styles.entryTime}>
                        {formatTime(entry.timestamp)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HistoryScreen;
