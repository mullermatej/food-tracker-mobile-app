import React, { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Context and Themes
import { ThemeProvider } from "./src/context/ThemeContext";
import { lightTheme, darkTheme } from "./src/utils/themes";

// Hooks
import { useNutritionData } from "./src/hooks/useNutritionData";

// Components
import { TodayHeader } from "./src/components/ui/TodayHeader";
import { NutritionCard } from "./src/components/ui/NutritionCard";
import { AddButtons } from "./src/components/ui/AddButtons";
import { SupplementSection } from "./src/components/ui/SupplementSection";
import { ResetButton } from "./src/components/ui/ResetButton";
import { CalendarModal } from "./src/components/calendar/CalendarModal";

// Styles
import { globalStyles } from "./src/styles/globalStyles";

// Utils
import {
  triggerLightHaptic,
  triggerMediumHaptic,
  triggerWarningHaptic,
} from "./src/utils/haptics";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const nutritionData = useNutritionData();
  const todayData = nutritionData.getTodayData();

  const theme = isDarkMode ? lightTheme : darkTheme;

  const addCalories = () => {
    Alert.prompt(
      "Add Calories",
      "Enter the amount to add",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: (value) => {
            const amount = parseInt(value) || 0;
            if (amount > 0) {
              nutritionData.updateTodayData({
                calories: Math.max(0, todayData.calories + amount),
              });
              triggerLightHaptic();
            }
          },
        },
      ],
      "plain-text",
      "",
      "number-pad"
    );
  };

  const addProtein = () => {
    Alert.prompt(
      "Add Protein",
      "Enter grams to add",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: (value) => {
            const amount = parseInt(value) || 0;
            if (amount > 0) {
              nutritionData.updateTodayData({
                protein: Math.max(0, todayData.protein + amount),
              });
              triggerLightHaptic();
            }
          },
        },
      ],
      "plain-text",
      "",
      "number-pad"
    );
  };

  const toggleCreatine = () => {
    nutritionData.updateTodayData({
      creatine: !todayData.creatine,
    });
    triggerLightHaptic();
  };

  const toggleFishOil = () => {
    nutritionData.updateTodayData({
      fishOil: !todayData.fishOil,
    });
    triggerLightHaptic();
  };

  const resetToday = () => {
    Alert.alert(
      "Reset Today",
      "This will clear today's nutrition data (calories, protein, supplements).",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Today",
          style: "destructive",
          onPress: () => {
            nutritionData.updateTodayData({
              calories: 0,
              protein: 0,
              creatine: false,
              fishOil: false,
            });
            triggerLightHaptic();
          },
        },
      ]
    );
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    triggerMediumHaptic();
  };

  const openCalendar = () => {
    setSelectedCalendarDate(new Date());
    setCalendarVisible(true);
  };

  const handleDateSelect = (date) => {
    setSelectedCalendarDate(date);
  };

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[
            globalStyles.container,
            { backgroundColor: theme.background },
          ]}
        >
          <StatusBar
            style={isDarkMode ? "light" : "dark"}
            backgroundColor={theme.background}
          />

          <ScrollView
            style={globalStyles.scrollView}
            contentContainerStyle={globalStyles.content}
            showsVerticalScrollIndicator={false}
          >
            <TodayHeader
              onThemeToggle={toggleTheme}
              onCalendarPress={openCalendar}
              isDarkMode={isDarkMode}
            />

            <NutritionCard todayData={todayData} />

            <AddButtons onAddCalories={addCalories} onAddProtein={addProtein} />

            <SupplementSection
              todayData={todayData}
              onToggleCreatine={toggleCreatine}
              onToggleFishOil={toggleFishOil}
            />

            <ResetButton onReset={resetToday} />
          </ScrollView>

          <CalendarModal
            visible={calendarVisible}
            onClose={() => setCalendarVisible(false)}
            nutritionData={nutritionData}
            onDateSelect={handleDateSelect}
            selectedDate={selectedCalendarDate}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
