import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { formatDate } from "../../utils/dateUtils";
import { headerStyles } from "../../styles/headerStyles";

export const TodayHeader = ({ onThemeToggle, onCalendarPress, isDarkMode }) => {
  const theme = useTheme();

  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.headerTop}>
        <TouchableOpacity
          style={headerStyles.themeButton}
          onPress={onThemeToggle}
        >
          <Text style={headerStyles.themeButtonText}>
            {isDarkMode ? "☀️" : "🌙"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={headerStyles.calendarButton}
          onPress={onCalendarPress}
        >
          <Text style={headerStyles.calendarButtonText}>📅</Text>
        </TouchableOpacity>
      </View>
      <Text style={[headerStyles.dateText, { color: theme.text }]}>
        {formatDate(new Date())}
      </Text>
      <Text style={[headerStyles.subtitle, { color: theme.textSecondary }]}>
        Today's Nutrition
      </Text>
    </View>
  );
};
