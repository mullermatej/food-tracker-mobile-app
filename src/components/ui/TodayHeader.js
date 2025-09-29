import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { formatDate } from "../../utils/dateUtils";

const styles = {
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  settingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(128, 128, 128, 0.1)",
  },
  settingsIcon: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
};

export const TodayHeader = ({ onSettingsPress }) => {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={{ width: 32 }} />
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onSettingsPress}
        >
          <Animated.Text
            style={[
              styles.settingsIcon,
              { color: theme.animated?.textSecondary || theme.textSecondary },
            ]}
          >
            ⚙️
          </Animated.Text>
        </TouchableOpacity>
      </View>
      <Animated.Text
        style={[styles.dateText, { color: theme.animated?.text || theme.text }]}
      >
        {formatDate(new Date())}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.subtitle,
          { color: theme.animated?.textSecondary || theme.textSecondary },
        ]}
      >
        Today's Nutrition
      </Animated.Text>
    </View>
  );
};
