import React from "react";
import { View, Text, Animated } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { nutritionStyles } from "../../styles/nutritionStyles";

export const NutritionCard = ({ todayData }) => {
  const theme = useTheme();
  return (
    <View style={nutritionStyles.nutritionSection}>
      <Animated.View
        style={[
          nutritionStyles.nutritionCard,
          {
            backgroundColor:
              theme.animated?.cardBackground || theme.cardBackground,
            shadowColor: theme.shadow,
          },
        ]}
      >
        <View style={nutritionStyles.nutritionItem}>
          <Animated.Text
            style={[
              nutritionStyles.nutritionValue,
              { color: theme.animated?.text || theme.text },
            ]}
          >
            {todayData.calories}
          </Animated.Text>
          <Animated.Text
            style={[
              nutritionStyles.nutritionLabel,
              { color: theme.animated?.textSecondary || theme.textSecondary },
            ]}
          >
            Calories
          </Animated.Text>
        </View>
        <Animated.View
          style={[
            nutritionStyles.divider,
            { backgroundColor: theme.animated?.border || theme.border },
          ]}
        />
        <View style={nutritionStyles.nutritionItem}>
          <Animated.Text
            style={[
              nutritionStyles.nutritionValue,
              { color: theme.animated?.text || theme.text },
            ]}
          >
            {todayData.protein}g
          </Animated.Text>
          <Animated.Text
            style={[
              nutritionStyles.nutritionLabel,
              { color: theme.animated?.textSecondary || theme.textSecondary },
            ]}
          >
            Protein
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
};
