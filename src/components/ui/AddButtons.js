import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { buttonStyles } from "../../styles/buttonStyles";

export const AddButtons = ({ onAddCalories, onAddProtein }) => {
  const theme = useTheme();

  return (
    <View style={buttonStyles.addButtonsSection}>
      <TouchableOpacity
        style={[
          buttonStyles.addButton,
          {
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
          },
        ]}
        onPress={onAddCalories}
      >
        <Text style={buttonStyles.addButtonText}>+ Calories</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          buttonStyles.addButton,
          {
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
          },
        ]}
        onPress={onAddProtein}
      >
        <Text style={buttonStyles.addButtonText}>+ Protein</Text>
      </TouchableOpacity>
    </View>
  );
};
