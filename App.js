import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function App() {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [history, setHistory] = useState([]);

  const addValues = () => {
    Alert.prompt(
      "Add Food",
      "Enter calories and protein values",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Add",
          onPress: (input) => {
            if (input) {
              const values = input.split(",");
              if (values.length === 2) {
                const caloriesValue = parseInt(values[0].trim()) || 0;
                const proteinValue = parseInt(values[1].trim()) || 0;

                // Save current state to history for undo
                setHistory([...history, { calories, protein }]);

                // Update values
                setCalories(calories + caloriesValue);
                setProtein(protein + proteinValue);
              } else {
                Alert.alert(
                  "Error",
                  "Please enter values as: calories, protein (e.g., 200, 15)"
                );
              }
            }
          },
        },
      ],
      "plain-text",
      "calories, protein (e.g., 200, 15)"
    );
  };

  const undoLastEntry = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setCalories(lastState.calories);
      setProtein(lastState.protein);
      setHistory(history.slice(0, -1));
    } else {
      Alert.alert("Nothing to undo", "No previous entries to undo.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <View style={styles.header}>
          <Text style={styles.title}>Food Tracker</Text>
        </View>

        <View style={styles.countersContainer}>
          <View style={styles.counterCard}>
            <Text style={styles.counterLabel}>Calories</Text>
            <Text style={styles.counterValue}>{calories}</Text>
            <Text style={styles.counterUnit}>kcal</Text>
          </View>

          <View style={styles.counterCard}>
            <Text style={styles.counterLabel}>Protein</Text>
            <Text style={styles.counterValue}>{protein}</Text>
            <Text style={styles.counterUnit}>g</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.addButton} onPress={addValues}>
            <Text style={styles.addButtonText}>+</Text>
            <Text style={styles.buttonLabel}>Add Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.undoButton,
              history.length === 0 && styles.disabledButton,
            ]}
            onPress={undoLastEntry}
            disabled={history.length === 0}
          >
            <Text
              style={[
                styles.undoButtonText,
                history.length === 0 && styles.disabledText,
              ]}
            >
              ↶
            </Text>
            <Text
              style={[
                styles.buttonLabel,
                history.length === 0 && styles.disabledText,
              ]}
            >
              Undo
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  countersContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 30,
  },
  counterCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  counterLabel: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  counterValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#333",
  },
  counterUnit: {
    fontSize: 16,
    color: "#999",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 40,
    gap: 20,
  },
  addButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
  },
  undoButton: {
    flex: 1,
    backgroundColor: "#FF9800",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  undoButtonText: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
  },
  buttonLabel: {
    fontSize: 16,
    color: "white",
    marginTop: 5,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  disabledText: {
    color: "#999999",
  },
});
