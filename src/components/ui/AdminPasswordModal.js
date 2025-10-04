import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TextInput,
  Animated,
  Easing,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const AdminPasswordModal = ({ visible, onCancel, onSubmit }) => {
  const theme = useTheme();
  const [password, setPassword] = useState("");
  const inputRef = useRef(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const dotAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (visible) {
      setPassword("");
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  useEffect(() => {
    // Animate dots as user types
    const length = password.length;
    dotAnims.forEach((anim, idx) => {
      Animated.spring(anim, {
        toValue: idx < length ? 1 : 0,
        useNativeDriver: true,
        friction: 6,
        tension: 80,
      }).start();
    });

    // Auto-submit when 4 digits entered
    if (length === 4) {
      setTimeout(() => {
        onSubmit(password);
        setPassword("");
      }, 300);
    }
  }, [password]);

  const handleCancel = () => {
    setPassword("");
    onCancel();
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleChangeText = (text) => {
    // Only allow numeric input, max 4 digits
    const numeric = text.replace(/[^0-9]/g, "").slice(0, 4);
    setPassword(numeric);
  };

  const styles = {
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      paddingBottom: 120,
    },
    card: {
      width: "100%",
      maxWidth: 340,
      borderRadius: 30,
      backgroundColor: theme.cardBackground,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 28,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 32,
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
      marginBottom: 32,
    },
    dot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: theme.border,
      backgroundColor: "transparent",
    },
    dotFilled: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    hiddenInput: {
      position: "absolute",
      opacity: 0,
      width: 1,
      height: 1,
    },
    cancelButton: {
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      backgroundColor: theme.background,
    },
    cancelText: { color: theme.text, fontWeight: "600", fontSize: 16 },
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            inputRef.current?.focus();
          }}
        >
          <Animated.View
            style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}
          >
            <Text style={styles.title}>Enter Admin Password</Text>
            <Text style={styles.subtitle}>Enter 4-digit code</Text>

            <View style={styles.dotsContainer}>
              {dotAnims.map((anim, idx) => (
                <Animated.View
                  key={idx}
                  style={[
                    styles.dot,
                    {
                      transform: [
                        {
                          scale: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                        },
                      ],
                      opacity: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                      }),
                    },
                    password.length > idx && styles.dotFilled,
                  ]}
                />
              ))}
            </View>

            <TextInput
              ref={inputRef}
              value={password}
              onChangeText={handleChangeText}
              keyboardType="number-pad"
              maxLength={4}
              autoFocus
              style={styles.hiddenInput}
              secureTextEntry={false}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
