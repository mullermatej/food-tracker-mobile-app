import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { buttonStyles } from '../../styles/buttonStyles';

export const ResetButton = ({ onReset }) => {
  const theme = useTheme();

  return (
    <View style={buttonStyles.resetSection}>
      <TouchableOpacity 
        style={[
          buttonStyles.resetButton, 
          { 
            backgroundColor: theme.danger, 
            shadowColor: theme.danger 
          }
        ]} 
        onPress={onReset}
      >
        <Text style={buttonStyles.resetButtonText}>Reset All Data</Text>
      </TouchableOpacity>
    </View>
  );
};