import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { supplementStyles } from "../../styles/supplementStyles";

export const SupplementSection = ({
  todayData,
  onToggleCreatine,
  onToggleFishOil,
}) => {
  const theme = useTheme();

  return (
    <View style={supplementStyles.supplementsSection}>
      <Text style={[supplementStyles.sectionTitle, { color: theme.text }]}>
        Daily Supplements
      </Text>

      <TouchableOpacity
        style={[
          supplementStyles.toggleButton,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
            shadowColor: theme.shadow,
          },
          todayData.creatine && {
            borderColor: theme.success,
            backgroundColor: theme.successBackground,
          },
        ]}
        onPress={onToggleCreatine}
      >
        <View style={supplementStyles.toggleContent}>
          <Text style={supplementStyles.toggleIcon}>💊</Text>
          <Text
            style={[
              supplementStyles.toggleText,
              { color: theme.textSecondary },
              todayData.creatine && { color: theme.success, fontWeight: "600" },
            ]}
          >
            Creatine
          </Text>
        </View>
        <View
          style={[
            supplementStyles.toggleIndicator,
            { backgroundColor: theme.border, borderColor: theme.border },
            todayData.creatine && {
              backgroundColor: theme.success,
              borderColor: theme.success,
            },
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          supplementStyles.toggleButton,
          {
            backgroundColor: theme.cardBackground,
            borderColor: theme.border,
            shadowColor: theme.shadow,
          },
          todayData.fishOil && {
            borderColor: theme.success,
            backgroundColor: theme.successBackground,
          },
        ]}
        onPress={onToggleFishOil}
      >
        <View style={supplementStyles.toggleContent}>
          <Text style={supplementStyles.toggleIcon}>🐟</Text>
          <Text
            style={[
              supplementStyles.toggleText,
              { color: theme.textSecondary },
              todayData.fishOil && { color: theme.success, fontWeight: "600" },
            ]}
          >
            Fish Oil
          </Text>
        </View>
        <View
          style={[
            supplementStyles.toggleIndicator,
            { backgroundColor: theme.border, borderColor: theme.border },
            todayData.fishOil && {
              backgroundColor: theme.success,
              borderColor: theme.success,
            },
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};
