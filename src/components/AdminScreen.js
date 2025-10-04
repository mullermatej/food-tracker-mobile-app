import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { triggerLightHaptic, triggerWarningHaptic } from "../utils/haptics";

export const AdminScreen = ({ navigation }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [storeItems, setStoreItems] = useState([]); // [{ key, value }]
  const [error, setError] = useState(null);

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
      marginBottom: 16,
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
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    headline: { fontSize: 22, fontWeight: "700", color: theme.text },
    subText: { marginTop: 6, color: theme.textSecondary },
    actionsRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 14,
      marginBottom: 12,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.cardBackground,
    },
    buttonText: { color: theme.text, fontWeight: "600" },
    dangerButton: {
      backgroundColor: theme.danger + "20",
      borderColor: theme.danger,
    },
    dangerText: { color: theme.danger, fontWeight: "700" },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 12,
      marginTop: 10,
    },
    keyText: { fontWeight: "700", color: theme.text },
    valueText: {
      marginTop: 8,
      color: theme.text,
      fontFamily: Platform.select({
        ios: "Menlo",
        android: "monospace",
        default: "monospace",
      }),
    },
    emptyWrap: { alignItems: "center", paddingVertical: 24 },
    emptyText: { color: theme.textSecondary },
  };

  const loadAllStorage = async () => {
    setLoading(true);
    setError(null);
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (!keys || keys.length === 0) {
        setStoreItems([]);
      } else {
        const entries = await AsyncStorage.multiGet(keys);
        const items = entries.map(([key, raw]) => {
          let parsed;
          try {
            parsed = raw ? JSON.parse(raw) : null;
          } catch {
            parsed = raw;
          }
          return { key, value: parsed };
        });
        setStoreItems(items);
      }
    } catch (e) {
      console.error("Failed to read AsyncStorage", e);
      setError("Failed to read local storage.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllStorage();
  }, []);

  const confirmClear = () => {
    triggerWarningHaptic();
    Alert.alert(
      "Delete Local Storage",
      "This will permanently delete ALL local data for this app on this device (nutrition history, favourites, notes, theme). You will lose absolutely everything. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              triggerLightHaptic();
              setStoreItems([]);
            } catch (e) {
              console.error("Failed to clear storage", e);
              setError("Failed to clear local storage.");
            }
          },
        },
      ]
    );
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
        <Text style={styles.title}>Admin</Text>
        <View style={styles.sideRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headline}>Local Storage</Text>
        <Text style={styles.subText}>
          Inspect or clear local storage for this app on this device.
        </Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.button} onPress={loadAllStorage}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={confirmClear}
          >
            <Text style={styles.dangerText}>Delete Local Storage</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ paddingVertical: 24 }}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : error ? (
          <View style={styles.card}>
            <Text style={{ color: theme.danger }}>{error}</Text>
          </View>
        ) : storeItems.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No local storage keys found.</Text>
          </View>
        ) : (
          storeItems.map((item) => (
            <View key={item.key} style={styles.card}>
              <Text style={styles.keyText}>{item.key}</Text>
              <Text selectable style={styles.valueText}>
                {typeof item.value === "string"
                  ? item.value
                  : JSON.stringify(item.value, null, 2)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminScreen;
