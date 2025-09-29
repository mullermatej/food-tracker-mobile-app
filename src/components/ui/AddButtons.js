import React from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { buttonStyles } from "../../styles/buttonStyles";

export const AddButtons = ({ onAddCalories, onAddProtein }) => {
  const theme = useTheme();
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={buttonStyles.addButtonsSection}>
      <AnimatedTouchableOpacity
        style={[
          buttonStyles.addButton,
          {
            backgroundColor: theme.animated?.primary || theme.primary,
            shadowColor: theme.animated?.primary || theme.primary,
          },
        ]}
        onPress={onAddCalories}
      >
        <Text style={buttonStyles.addButtonText}>+ Calories</Text>
      </AnimatedTouchableOpacity>
      <AnimatedTouchableOpacity
        style={[
          buttonStyles.addButton,
          {
            backgroundColor: theme.animated?.primary || theme.primary,
            shadowColor: theme.animated?.primary || theme.primary,
          },
        ]}
        onPress={onAddProtein}
      >
        <Text style={buttonStyles.addButtonText}>+ Protein</Text>
      </AnimatedTouchableOpacity>
    </View>
  );
};
