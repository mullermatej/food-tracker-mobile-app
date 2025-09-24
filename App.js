import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [creatineTaken, setCreatineTaken] = useState(false);
  const [fishOilTaken, setFishOilTaken] = useState(false);

  const addCalories = () => {
    Alert.prompt(
      'Add Calories',
      'Enter the amount to add',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (value) => {
            const amount = parseInt(value) || 0;
            if (amount > 0) {
              setCalories(prev => prev + amount);
            }
          }
        }
      ],
      'plain-text',
      '',
      'number-pad'
    );
  };

  const addProtein = () => {
    Alert.prompt(
      'Add Protein',
      'Enter grams to add',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (value) => {
            const amount = parseInt(value) || 0;
            if (amount > 0) {
              setProtein(prev => prev + amount);
            }
          }
        }
      ],
      'plain-text',
      '',
      'number-pad'
    );
  };

  const toggleCreatine = () => {
    setCreatineTaken(prev => !prev);
  };

  const toggleFishOil = () => {
    setFishOilTaken(prev => !prev);
  };

  const resetAll = () => {
    Alert.alert(
      'Reset Today',
      'This will clear all values. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setCalories(0);
            setProtein(0);
            setCreatineTaken(false);
            setFishOilTaken(false);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor="#f8f9fa" />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Today's Nutrition</Text>
            <Text style={styles.subtitle}>Track your daily intake</Text>
          </View>

          {/* Nutrition Display */}
          <View style={styles.nutritionSection}>
            <View style={styles.nutritionCard}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{calories}</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
            </View>
          </View>

          {/* Add Buttons */}
          <View style={styles.addButtonsSection}>
            <TouchableOpacity style={styles.addButton} onPress={addCalories}>
              <Text style={styles.addButtonText}>+ Calories</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={addProtein}>
              <Text style={styles.addButtonText}>+ Protein</Text>
            </TouchableOpacity>
          </View>

          {/* Supplements */}
          <View style={styles.supplementsSection}>
            <Text style={styles.sectionTitle}>Daily Supplements</Text>
            
            <TouchableOpacity 
              style={[styles.toggleButton, creatineTaken && styles.toggleButtonActive]}
              onPress={toggleCreatine}
            >
              <View style={styles.toggleContent}>
                <Text style={styles.toggleIcon}>💊</Text>
                <Text style={[styles.toggleText, creatineTaken && styles.toggleTextActive]}>
                  Creatine
                </Text>
              </View>
              <View style={[styles.toggleIndicator, creatineTaken && styles.toggleIndicatorActive]} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.toggleButton, fishOilTaken && styles.toggleButtonActive]}
              onPress={toggleFishOil}
            >
              <View style={styles.toggleContent}>
                <Text style={styles.toggleIcon}>🐟</Text>
                <Text style={[styles.toggleText, fishOilTaken && styles.toggleTextActive]}>
                  Fish Oil
                </Text>
              </View>
              <View style={[styles.toggleIndicator, fishOilTaken && styles.toggleIndicatorActive]} />
            </TouchableOpacity>
          </View>

          {/* Reset Button */}
          <View style={styles.resetSection}>
            <TouchableOpacity style={styles.resetButton} onPress={resetAll}>
              <Text style={styles.resetButtonText}>Reset Day</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '400',
  },
  
  // Nutrition Display
  nutritionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  nutritionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  
  // Add Buttons
  addButtonsSection: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Supplements
  supplementsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  toggleButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#f3f4f6',
  },
  toggleButtonActive: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  toggleTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  toggleIndicatorActive: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  
  // Reset Button
  resetSection: {
    paddingHorizontal: 24,
  },
  resetButton: {
    backgroundColor: '#ef4444',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});