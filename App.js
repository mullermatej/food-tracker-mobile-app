import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Animated,
  Easing,
  Platform,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Context and Themes
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import {
  NutritionDataProvider,
  useNutritionDataContext,
} from "./src/context/NutritionDataContext";
import { lightTheme, darkTheme } from "./src/utils/themes";

// Hooks
import { useLocalStorage } from "./src/hooks/useLocalStorage";
import { useHistoryLog } from "./src/hooks/useHistoryLog";

// Components
import { TodayHeader } from "./src/components/ui/TodayHeader";
import { NutritionCard } from "./src/components/ui/NutritionCard";
import { AddButtons } from "./src/components/ui/AddButtons";
import { SupplementSection } from "./src/components/ui/SupplementSection";
import { ResetButton } from "./src/components/ui/ResetButton";
import CalendarScreen from "./src/components/CalendarScreen";
import { SettingsModal } from "./src/components/ui/SettingsModal";
import { FavouritesScreen } from "./src/components/FavouritesScreen";
import { FoodNotesScreen } from "./src/components/FoodNotesScreen";
import { InputPrompt } from "./src/components/ui/InputPrompt";
import { AdminPasswordModal } from "./src/components/ui/AdminPasswordModal";
import AdminScreen from "./src/components/AdminScreen";
import HistoryScreen from "./src/components/HistoryScreen";

// Styles
import { globalStyles } from "./src/styles/globalStyles";

// Utils
import {
  triggerLightHaptic,
  triggerMediumHaptic,
  triggerWarningHaptic,
} from "./src/utils/haptics";
import { parseDecimalInput } from "./src/utils/numberFormat";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation, route, isDarkMode, setIsDarkMode }) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [prompt, setPrompt] = useState(null); // { type: 'calories'|'protein' }
  const [caloriesStr, setCaloriesStr] = useState("");
  const [proteinStr, setProteinStr] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const nutritionData = useNutritionDataContext();
  const todayData = nutritionData.getTodayData();
  const { saveData } = useLocalStorage();
  const { addEntry, checkAndClearIfNewDay } = useHistoryLog();

  // Use darkTheme when dark mode is enabled
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Check if day has changed and clear history if so
  useEffect(() => {
    checkAndClearIfNewDay();
  }, []);

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

  const openFoodNotes = () => {
    navigation.navigate("FoodNotes");
    triggerLightHaptic();
  };

  const addCalories = () => {
    setCaloriesStr("");
    setPrompt({ type: "calories" });
  };

  const addProtein = () => {
    setProteinStr("");
    setPrompt({ type: "protein" });
  };

  const closePrompt = () => setPrompt(null);
  const submitPrompt = () => {
    if (!prompt) return;
    if (prompt.type === "calories") {
      const amount = parseInt(caloriesStr, 10) || 0;
      if (amount > 0) {
        nutritionData.updateTodayData({
          calories: Math.max(0, todayData.calories + amount),
        });
        // Log to history
        addEntry("calories", { calories: amount });
        triggerLightHaptic();
      }
    } else if (prompt.type === "protein") {
      const amount = parseDecimalInput(proteinStr);
      if (amount > 0) {
        nutritionData.updateTodayData({
          protein: Math.max(0, todayData.protein + amount),
        });
        // Log to history
        addEntry("protein", { protein: amount });
        triggerLightHaptic();
      }
    }
    closePrompt();
  };

  const handleAdminPasswordSubmit = (pwd) => {
    if (pwd === "1234") {
      setAdminPassword("");
      closePrompt();
      navigation.navigate("Admin");
      triggerLightHaptic();
    } else {
      Alert.alert("Incorrect password", "Please try again.");
      triggerWarningHaptic();
    }
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
    // Navigate to the dedicated Calendar screen instead of opening a modal
    navigation.navigate("Calendar");
  };

  const openAdmin = () => {
    setAdminPassword("");
    setPrompt({ type: "admin-password" });
  };

  const openHistory = () => {
    navigation.navigate("History");
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
      // Log to history
      addEntry("favourite", {
        calories: item?.calories || 0,
        protein: item?.protein || 0,
        foodName: item?.name || "Unknown",
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
            <TodayHeader
              onSettingsPress={openSettings}
              onNotesPress={openFoodNotes}
            />

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

          {/* Calendar moved to its own screen; modal removed */}

          <SettingsModal
            visible={settingsVisible}
            onClose={closeSettings}
            onToggleTheme={toggleTheme}
            onOpenCalendar={openCalendar}
            onOpenHistory={openHistory}
            onOpenAdmin={openAdmin}
            isDarkMode={isDarkMode}
          />

          {/* Cross-platform input prompt for Android/iOS/web */}
          <InputPrompt
            visible={!!prompt && prompt.type === "calories"}
            title="Add Calories"
            placeholder="Enter the amount to add"
            value={caloriesStr}
            onChangeText={setCaloriesStr}
            keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
            onCancel={closePrompt}
            onSubmit={submitPrompt}
          />
          <InputPrompt
            visible={!!prompt && prompt.type === "protein"}
            title="Add Protein"
            placeholder="Enter grams to add"
            value={proteinStr}
            onChangeText={setProteinStr}
            keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
            onCancel={closePrompt}
            onSubmit={submitPrompt}
          />
          <AdminPasswordModal
            visible={!!prompt && prompt.type === "admin-password"}
            onCancel={() => {
              setAdminPassword("");
              closePrompt();
            }}
            onSubmit={handleAdminPasswordSubmit}
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

  // Keep native root background synced to avoid white flashes on iOS when system overlays appear
  // Note: This hook must be declared before any conditional returns to preserve hook order
  useEffect(() => {
    const bg = (isDarkMode ? darkTheme : lightTheme).background;
    SystemUI.setBackgroundColorAsync(bg).catch(() => {});
  }, [isDarkMode, themeLoaded]);

  // Don't render until theme preference is loaded
  if (!themeLoaded) {
    return null;
  }

  return (
    <NutritionDataProvider>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <View
          style={{
            flex: 1,
            backgroundColor: (isDarkMode ? darkTheme : lightTheme).background,
          }}
        >
          <NavigationContainer
            theme={{
              ...(isDarkMode ? DarkTheme : DefaultTheme),
              colors: {
                ...((isDarkMode ? DarkTheme : DefaultTheme).colors || {}),
                background: (isDarkMode ? darkTheme : lightTheme).background,
                card: (isDarkMode ? darkTheme : lightTheme).background,
                text: (isDarkMode ? darkTheme : lightTheme).text,
                border: (isDarkMode ? darkTheme : lightTheme).border,
                primary: (isDarkMode ? darkTheme : lightTheme).primary,
              },
            }}
          >
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: (isDarkMode ? darkTheme : lightTheme)
                    .background,
                },
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
                  contentStyle: {
                    backgroundColor: (isDarkMode ? darkTheme : lightTheme)
                      .background,
                  },
                }}
              />
              <Stack.Screen
                name="FoodNotes"
                component={FoodNotesScreen}
                options={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: (isDarkMode ? darkTheme : lightTheme)
                      .background,
                  },
                }}
              />
              <Stack.Screen
                name="Calendar"
                component={CalendarScreen}
                options={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: (isDarkMode ? darkTheme : lightTheme)
                      .background,
                  },
                }}
              />
              <Stack.Screen
                name="Admin"
                component={AdminScreen}
                options={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: (isDarkMode ? darkTheme : lightTheme)
                      .background,
                  },
                }}
              />
              <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: (isDarkMode ? darkTheme : lightTheme)
                      .background,
                  },
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </ThemeProvider>
    </NutritionDataProvider>
  );
}
