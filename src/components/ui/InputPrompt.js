import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const InputPrompt = ({
  visible,
  title,
  placeholder,
  value,
  onChangeText,
  keyboardType = Platform.OS === "ios" ? "number-pad" : "numeric",
  onCancel,
  onSubmit,
  cancelLabel = "Cancel",
  submitLabel = "Add",
}) => {
  const theme = useTheme();

  const styles = {
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    card: {
      width: "100%",
      borderRadius: 16,
      backgroundColor: theme.cardBackground,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.text,
      backgroundColor: theme.background,
    },
    actions: { flexDirection: "row", marginTop: 12, gap: 8 },
    secondary: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    secondaryText: { color: theme.text, fontWeight: "600" },
    primary: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: theme.primary,
      alignItems: "center",
    },
    primaryText: { color: "#fff", fontWeight: "700" },
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
          }}
          onPress={onCancel}
        />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={theme.textSecondary}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            style={styles.input}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondary} onPress={onCancel}>
              <Text style={styles.secondaryText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primary} onPress={onSubmit}>
              <Text style={styles.primaryText}>{submitLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
