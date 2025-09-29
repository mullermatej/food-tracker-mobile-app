import React from "react";
import { View, TouchableOpacity, Text, Animated } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { buttonStyles } from "../../styles/buttonStyles";

export const ResetButton = ({ onReset }) => {
  const theme = useTheme();
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <View style={buttonStyles.resetSection}>
      <AnimatedTouchableOpacity
        style={[
          buttonStyles.resetButton,
          {
            backgroundColor: theme.animated?.danger || theme.danger,
            shadowColor: theme.animated?.danger || theme.danger,
          },
        ]}
        onPress={onReset}
      >
        <Text style={buttonStyles.resetButtonText}>Reset Today</Text>
      </AnimatedTouchableOpacity>
    </View>
  );
};
