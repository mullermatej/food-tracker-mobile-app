import React from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { buttonStyles } from "../../styles/buttonStyles";

export const AddButtons = ({
  onAddCalories,
  onAddProtein,
  onOpenFavourites,
}) => {
  const theme = useTheme();
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={buttonStyles.addButtonsSection}>
      {/* First row with + Calories and + Protein */}
      <View style={buttonStyles.topButtonsRow}>
        <AnimatedTouchableOpacity
          style={[
            buttonStyles.addButton,
            buttonStyles.topRowButton,
            {
              backgroundColor: theme.animated?.primary || theme.primary,
              shadowColor: theme.animated?.primary || theme.primary,
            },
          ]}
          onPress={onAddCalories}
        >
          <Text style={buttonStyles.addButtonText}>Add calories</Text>
        </AnimatedTouchableOpacity>
        <AnimatedTouchableOpacity
          style={[
            buttonStyles.addButton,
            buttonStyles.topRowButton,
            {
              backgroundColor: theme.animated?.primary || theme.primary,
              shadowColor: theme.animated?.primary || theme.primary,
            },
          ]}
          onPress={onAddProtein}
        >
          <Text style={buttonStyles.addButtonText}>Add protein</Text>
        </AnimatedTouchableOpacity>
      </View>

      {/* Second row with Favourites button spanning full width */}
      <AnimatedTouchableOpacity
        style={[
          buttonStyles.addButton,
          buttonStyles.favouritesButton,
          {
            backgroundColor: theme.animated?.primary || theme.primary,
            shadowColor: theme.animated?.primary || theme.primary,
          },
        ]}
        onPress={onOpenFavourites}
      >
        <Text style={buttonStyles.addButtonText}>View favourites</Text>
      </AnimatedTouchableOpacity>
    </View>
  );
};
