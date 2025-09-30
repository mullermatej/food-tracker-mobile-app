import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, Animated, Easing } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Context and Themes
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { lightTheme, darkTheme } from "./src/utils/themes";

// Hooks
import { useNutritionData } from "./src/hooks/useNutritionData";
import { useLocalStorage } from "./src/hooks/useLocalStorage";

// Components
import { TodayHeader } from "./src/components/ui/TodayHeader";
import { NutritionCard } from "./src/components/ui/NutritionCard";
import { AddButtons } from "./src/components/ui/AddButtons";
import { SupplementSection } from "./src/components/ui/SupplementSection";
import { ResetButton } from "./src/components/ui/ResetButton";
import { CalendarModal } from "./src/components/calendar/CalendarModal";
import { SettingsModal } from "./src/components/ui/SettingsModal";
import { FavouritesScreen } from "./src/components/FavouritesScreen";

// Styles
import { globalStyles } from "./src/styles/globalStyles";

// Utils
import {
  triggerLightHaptic,
  triggerMediumHaptic,
  triggerWarningHaptic,
} from "./src/utils/haptics";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, route, isDarkMode, setIsDarkMode }) {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const nutritionData = useNutritionData();
  const todayData = nutritionData.getTodayData();
  const { saveData } = useLocalStorage();

  // Use darkTheme when dark mode is enabled
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Animated background cross-fade between dark and light backgrounds
  const bgAnim = useRef(new Animated.Value(isDarkMode ? 0 : 1)).current; // 0 = dark, 1 = light

  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: isDarkMode ? 0 : 1,
      duration: 450,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false, // color/layout animations require native driver off
    }).start();
  }, [isDarkMode, bgAnim]);

  const interpolatedBg = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [darkTheme.background, lightTheme.background],
  });

  // Animated theme colors for smooth transitions across the UI
  const animated = {
    background: interpolatedBg,
    cardBackground: bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [darkTheme.cardBackground, lightTheme.cardBackground],
    }),
    text: bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [darkTheme.text, lightTheme.text],
    }),
    textSecondary: bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [darkTheme.textSecondary, lightTheme.textSecondary],
    }),
    border: bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [darkTheme.border, lightTheme.border],
    }),
    primary: bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [darkTheme.primary, lightTheme.primary],
    }),
    success: bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [darkTheme.success, lightTheme.success],
    }),
    successBackground: bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [darkTheme.successBackground, lightTheme.successBackground],
    }),
    danger: bgAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [darkTheme.danger, lightTheme.danger],
    }),
  };

  const addToToday = (item) => {
    nutritionData.updateTodayData({
      calories: todayData.calories + item.calories,
      protein: todayData.protein + item.protein,
    });
    triggerLightHaptic();
  };

  const openFavourites = () => {
    navigation.navigate("Favourites");
  };

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

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await saveData("theme_preference", newTheme);
    triggerMediumHaptic();
  };

  const openCalendar = () => {
    setSelectedCalendarDate(new Date());
    setCalendarVisible(true);
  };

  const handleDateSelect = (date) => {
    setSelectedCalendarDate(date);
  };

  const openSettings = () => {
    setSettingsVisible(true);
  };

  const closeSettings = () => {
    setSettingsVisible(false);
  };

  // Subscribe to add events from Favourites so that screen can stay mounted
  useEffect(() => {
    const { on } = require("./src/utils/eventBus");
    const unsubscribe = on("add-from-favourites", (item) => {
      nutritionData.updateTodayData({
        calories: todayData.calories + (item?.calories || 0),
        protein: todayData.protein + (item?.protein || 0),
      });
      triggerLightHaptic();
    });
    return unsubscribe;
  }, [todayData.calories, todayData.protein]);

  return (
    <ThemeProvider theme={{ ...theme, animated }}>
      <SafeAreaProvider>
        <SafeAreaView
          style={[globalStyles.container, { backgroundColor: "transparent" }]}
        >
          {/* Animated background layer: only the app background fades; content colors follow theme instantly */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: interpolatedBg,
            }}
          />
          <StatusBar
            style={isDarkMode ? "light" : "dark"}
            backgroundColor={
              isDarkMode ? darkTheme.background : lightTheme.background
            }
          />

          <ScrollView
            style={globalStyles.scrollView}
            contentContainerStyle={globalStyles.content}
            showsVerticalScrollIndicator={false}
          >
            <TodayHeader onSettingsPress={openSettings} />

            <NutritionCard todayData={todayData} />

            <AddButtons
              onAddCalories={addCalories}
              onAddProtein={addProtein}
              onOpenFavourites={openFavourites}
            />

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

          <SettingsModal
            visible={settingsVisible}
            onClose={closeSettings}
            onToggleTheme={toggleTheme}
            onOpenCalendar={openCalendar}
            isDarkMode={isDarkMode}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const { loadData } = useLocalStorage();

  // Load theme preference on app start
  useEffect(() => {
    const loadThemePreference = async () => {
      const savedTheme = await loadData("theme_preference");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme);
      }
      setThemeLoaded(true);
    };
    loadThemePreference();
  }, [loadData]);

  // Don't render until theme preference is loaded
  if (!themeLoaded) {
    return null;
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen
                {...props}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Favourites"
            component={FavouritesScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
