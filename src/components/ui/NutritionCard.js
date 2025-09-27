import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { nutritionStyles } from "../../styles/nutritionStyles";

export const NutritionCard = ({ todayData }) => {
  const theme = useTheme();

  return (
    <View style={nutritionStyles.nutritionSection}>
      <View
        style={[
          nutritionStyles.nutritionCard,
          {
            backgroundColor: theme.cardBackground,
            shadowColor: theme.shadow,
          },
        ]}
      >
        <View style={nutritionStyles.nutritionItem}>
          <Text style={[nutritionStyles.nutritionValue, { color: theme.text }]}>
            {todayData.calories}
          </Text>
          <Text
            style={[
              nutritionStyles.nutritionLabel,
              { color: theme.textSecondary },
            ]}
          >
            Calories
          </Text>
        </View>
        <View
          style={[nutritionStyles.divider, { backgroundColor: theme.border }]}
        />
        <View style={nutritionStyles.nutritionItem}>
          <Text style={[nutritionStyles.nutritionValue, { color: theme.text }]}>
            {todayData.protein}g
          </Text>
          <Text
            style={[
              nutritionStyles.nutritionLabel,
              { color: theme.textSecondary },
            ]}
          >
            Protein
          </Text>
        </View>
      </View>
    </View>
  );
};
