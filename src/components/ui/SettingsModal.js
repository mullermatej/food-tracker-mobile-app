import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { lightTheme } from '../../utils/themes';

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  settingsSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    minHeight: 200,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
    opacity: 0.3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    opacity: 0.7,
    marginLeft: 8,
  },
};

export const SettingsModal = ({ 
  visible, 
  onClose, 
  onToggleTheme, 
  onOpenCalendar, 
  isDarkMode 
}) => {
  const theme = useTheme();

  const handleThemeToggle = () => {
    onToggleTheme();
    onClose();
  };

  const handleCalendarOpen = () => {
    onOpenCalendar();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar style={theme === lightTheme ? "dark" : "light"} />
        
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <View style={[styles.settingsSheet, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.handle, { backgroundColor: theme.text }]} />
          
          <Text style={[styles.title, { color: theme.text }]}>
            Settings
          </Text>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={handleThemeToggle}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>
                {isDarkMode ? "☀️" : "🌙"}
              </Text>
              <Text style={[styles.settingText, { color: theme.text }]}>
                Theme
              </Text>
              <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
                {isDarkMode ? "Switch to Light" : "Switch to Dark"}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem} 
            onPress={handleCalendarOpen}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📅</Text>
              <Text style={[styles.settingText, { color: theme.text }]}>
                Calendar
              </Text>
              <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
                View history
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};