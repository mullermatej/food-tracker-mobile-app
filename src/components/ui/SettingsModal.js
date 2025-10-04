import React, { useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../context/ThemeContext";
import { lightTheme } from "../../utils/themes";
import AppSymbol from "./AppSymbol";

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  settingsSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: 200,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: "600",
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 2,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: "center",
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingValue: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 8,
  },
};

export const SettingsModal = ({
  visible,
  onClose,
  onToggleTheme,
  onOpenCalendar,
  onOpenHistory,
  onOpenAdmin,
  isDarkMode,
}) => {
  const theme = useTheme();
  const thumbPosition = useRef(new Animated.Value(isDarkMode ? 0 : 1)).current;
  const backgroundColor = useRef(
    new Animated.Value(isDarkMode ? 0 : 1)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(thumbPosition, {
        toValue: isDarkMode ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundColor, {
        toValue: isDarkMode ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    onToggleTheme();
  };

  const handleCalendarOpen = () => {
    onOpenCalendar();
    onClose();
  };

  const handleHistoryOpen = () => {
    if (onOpenHistory) {
      onOpenHistory();
    }
    onClose();
  };

  const handleAdminOpen = () => {
    if (onOpenAdmin) {
      onOpenAdmin();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <StatusBar style={theme?.background === "#f8f9fa" ? "dark" : "light"} />

        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={[
            styles.settingsSheet,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <View style={styles.headerContainer}>
            <View style={{ width: 32 }} />
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeIcon, { color: theme.textSecondary }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleThemeToggle}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={{ width: 24, marginRight: 12, alignItems: "center" }}
              >
                <AppSymbol
                  name={isDarkMode ? "moon.fill" : "sun.max.fill"}
                  size={20}
                  color={theme.text}
                  fallback={
                    <Text style={[styles.settingIcon, { color: theme.text }]}>
                      {isDarkMode ? "🌙" : "☀️"}
                    </Text>
                  }
                />
              </View>
              <Text style={[styles.settingText, { color: theme.text }]}>
                Theme
              </Text>
            </View>
            <Animated.View
              style={[
                styles.toggleSwitch,
                {
                  backgroundColor: backgroundColor.interpolate({
                    inputRange: [0, 1],
                    // 0 = dark mode, 1 = light mode. Green when ON (dark), gray when OFF (light)
                    outputRange: ["#4CD964", "#E5E5EA"],
                  }),
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.toggleThumb,
                  {
                    transform: [
                      {
                        translateX: thumbPosition.interpolate({
                          inputRange: [0, 1],
                          // Move thumb to right when dark (ON)
                          outputRange: [22, 0],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleCalendarOpen}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={{ width: 24, marginRight: 12, alignItems: "center" }}
              >
                <AppSymbol
                  name="calendar"
                  size={20}
                  color={theme.text}
                  fallback={
                    <Text style={[styles.settingIcon, { color: theme.text }]}>
                      📅
                    </Text>
                  }
                />
              </View>
              <Text style={[styles.settingText, { color: theme.text }]}>
                Calendar
              </Text>
            </View>
            <View style={{ width: 24, alignItems: "center" }}>
              <AppSymbol
                name="chevron.right"
                size={16}
                color={theme.textSecondary}
                fallback={
                  <Text style={{ fontSize: 18, color: theme.textSecondary }}>
                    ›
                  </Text>
                }
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleHistoryOpen}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={{ width: 24, marginRight: 12, alignItems: "center" }}
              >
                <AppSymbol
                  name="clock.arrow.circlepath"
                  size={20}
                  color={theme.text}
                  fallback={
                    <Text style={[styles.settingIcon, { color: theme.text }]}>
                      🕐
                    </Text>
                  }
                />
              </View>
              <Text style={[styles.settingText, { color: theme.text }]}>
                History
              </Text>
            </View>
            <View style={{ width: 24, alignItems: "center" }}>
              <AppSymbol
                name="chevron.right"
                size={16}
                color={theme.textSecondary}
                fallback={
                  <Text style={{ fontSize: 18, color: theme.textSecondary }}>
                    ›
                  </Text>
                }
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleAdminOpen}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View
                style={{ width: 24, marginRight: 12, alignItems: "center" }}
              >
                <AppSymbol
                  name="gearshape.2.fill"
                  size={20}
                  color={theme.text}
                  fallback={
                    <Text style={[styles.settingIcon, { color: theme.text }]}>
                      🛠️
                    </Text>
                  }
                />
              </View>
              <Text style={[styles.settingText, { color: theme.text }]}>
                Admin
              </Text>
            </View>
            <View style={{ width: 24, alignItems: "center" }}>
              <AppSymbol
                name="chevron.right"
                size={16}
                color={theme.textSecondary}
                fallback={
                  <Text style={{ fontSize: 18, color: theme.textSecondary }}>
                    ›
                  </Text>
                }
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
