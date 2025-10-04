import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { format } from "date-fns";
import { triggerLightHaptic } from "../utils/haptics";

// Storage key for notes
const NOTES_KEY = "foodNotes";

export const FoodNotesScreen = ({ navigation }) => {
  const theme = useTheme();
  const { loadData, saveData } = useLocalStorage();
  const [text, setText] = useState("");
  const [savedDisplayDate, setSavedDisplayDate] = useState(null); // e.g., 2.10.2025
  const [justSaved, setJustSaved] = useState(false);

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todayDisplay = format(new Date(), "d.M.yyyy");

  // Clear notes if saved date is not today (run on focus and first mount)
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const stored = await loadData(NOTES_KEY);
      if (stored?.dateKey === todayKey) {
        setText(stored.text || "");
        setSavedDisplayDate(stored.displayDate || todayDisplay);
      } else {
        // Outdated or no notes -> clear
        setText("");
        setSavedDisplayDate(null);
        await saveData(NOTES_KEY, {
          text: "",
          dateKey: null,
          displayDate: null,
        });
      }
    });
    return unsubscribe;
  }, [navigation]);

  const handleSave = async () => {
    await saveData(NOTES_KEY, {
      text,
      dateKey: todayKey,
      displayDate: todayDisplay,
    });
    setSavedDisplayDate(todayDisplay);
    triggerLightHaptic();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1200);
  };

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
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      color: theme.text,
      backgroundColor: theme.cardBackground,
      textAlignVertical: "top",
      fontSize: 16,
      minHeight: 220,
      maxHeight: 360,
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    savedText: { fontSize: 12, color: theme.textSecondary },
    savedPill: { fontSize: 12, color: theme.textSecondary },
    saveButton: {
      marginTop: 12,
      alignSelf: "center",
      alignItems: "center",
      minWidth: 140,
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 12,
      backgroundColor: theme.primary,
    },
    saveText: { color: "#fff", fontWeight: "700" },
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
        <Text style={styles.title}>Food Notes</Text>
        <View style={styles.sideRight} />
      </View>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              placeholder="Jot down foods you ate when macros are unknown..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={8}
              value={text}
              onChangeText={setText}
              accessibilityLabel="Food notes input"
            />
            <View style={styles.metaRow}>
              <Text style={styles.savedText}>
                {savedDisplayDate
                  ? `Saved for ${savedDisplayDate}`
                  : "Not saved yet"}
              </Text>
              {justSaved ? <Text style={styles.savedPill}>Saved ✓</Text> : null}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save Notes</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
