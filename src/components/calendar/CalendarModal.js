import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import { useTheme } from "../../context/ThemeContext";
import { calendarStyles } from "../../styles/calendarStyles";
import { lightTheme } from "../../utils/themes";

export const CalendarModal = ({
  visible,
  onClose,
  nutritionData,
  onDateSelect,
  selectedDate,
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editVisible, setEditVisible] = useState(false);
  const [caloriesStr, setCaloriesStr] = useState("");
  const [proteinStr, setProteinStr] = useState("");
  const [creatine, setCreatine] = useState(false);
  const [fishOil, setFishOil] = useState(false);
  const gridAnim = useRef(new Animated.Value(1)).current; // 0 hidden, 1 visible
  const creatineAnim = useRef(new Animated.Value(0)).current;
  const fishOilAnim = useRef(new Animated.Value(0)).current;

  const todayStart = startOfDay(new Date());
  const isEditableDate =
    !!selectedDate && isBefore(startOfDay(selectedDate), todayStart);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => {
    const today = new Date();
    Animated.timing(gridAnim, {
      toValue: 0,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCurrentMonth(today);
      onDateSelect && onDateSelect(today);
      Animated.timing(gridAnim, {
        toValue: 1,
        duration: 180,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
  };

  const renderDayCell = (day) => {
    const dayData = nutritionData.getDataForDate(day);
    const hasData =
      dayData.calories > 0 ||
      dayData.protein > 0 ||
      dayData.creatine ||
      dayData.fishOil;
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    const isTodayDate = isToday(day);

    return (
      <TouchableOpacity
        key={day.toISOString()}
        style={[
          calendarStyles.dayCell,
          { borderColor: theme.border },
          hasData && { backgroundColor: theme.success + "20" },
          isSelected && {
            backgroundColor: theme.primary,
            borderColor: theme.primary,
          },
          isTodayDate && { borderColor: theme.primary, borderWidth: 2 },
        ]}
        onPress={() => onDateSelect(day)}
      >
        <Text
          style={[
            calendarStyles.dayText,
            { color: theme.text },
            isSelected && { color: "#ffffff" },
          ]}
        >
          {format(day, "d")}
        </Text>
        {hasData && !isSelected && (
          <View
            style={[
              calendarStyles.dayIndicator,
              { backgroundColor: theme.success },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectedDateSummary = () => {
    if (!selectedDate) return null;

    const dayData = nutritionData.getDataForDate(selectedDate);
    const isSelectedToday = isToday(selectedDate);

    const entryStyles = {
      card: {
        backgroundColor: theme.cardBackground,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 20,
      },
      headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      },
      dateText: { fontSize: 16, fontWeight: "700", color: theme.text },
      todayBadge: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: theme.primary + "20",
      },
      todayBadgeText: { color: theme.primary, fontSize: 12, fontWeight: "600" },
      divider: {
        height: 1,
        backgroundColor: theme.border,
        marginVertical: 10,
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 6,
      },
      label: { color: theme.textSecondary, fontSize: 14 },
      valueWrap: { flexDirection: "row", alignItems: "baseline" },
      value: { color: theme.text, fontSize: 18, fontWeight: "700" },
      unit: { color: theme.textSecondary, fontSize: 12, marginLeft: 6 },
      supRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: "flex-start",
        paddingTop: 6,
      },
      chip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
      },
      chipText: { fontSize: 12, fontWeight: "600" },
    };

    const Chip = ({ active, label }) => (
      <View
        style={[
          entryStyles.chip,
          {
            backgroundColor: active
              ? theme.successBackground
              : theme.cardBackground,
            borderColor: active ? theme.success : theme.border,
          },
        ]}
      >
        <Text
          style={[
            entryStyles.chipText,
            { color: active ? theme.success : theme.textSecondary },
          ]}
        >
          {label} {active ? "✓" : "—"}
        </Text>
      </View>
    );

    return (
      <View style={entryStyles.card}>
        <View style={entryStyles.headerRow}>
          <Text style={entryStyles.dateText}>
            {format(selectedDate, "EEEE, MMM d, yyyy")}
          </Text>
          {isSelectedToday && (
            <View style={entryStyles.todayBadge}>
              <Text style={entryStyles.todayBadgeText}>Today</Text>
            </View>
          )}
        </View>

        <View style={entryStyles.divider} />

        <View style={entryStyles.row}>
          <Text style={entryStyles.label}>Calories</Text>
          <View style={entryStyles.valueWrap}>
            <Text style={entryStyles.value}>{dayData.calories}</Text>
            <Text style={entryStyles.unit}>kcal</Text>
          </View>
        </View>

        <View style={entryStyles.row}>
          <Text style={entryStyles.label}>Protein</Text>
          <View style={entryStyles.valueWrap}>
            <Text style={entryStyles.value}>{dayData.protein}</Text>
            <Text style={entryStyles.unit}>g</Text>
          </View>
        </View>

        <View style={entryStyles.divider} />

        <Text style={[entryStyles.label, { marginBottom: 4 }]}>
          Supplements
        </Text>
        <View style={entryStyles.supRow}>
          <Chip active={!!dayData.creatine} label="Creatine" />
          <Chip active={!!dayData.fishOil} label="Fish Oil" />
        </View>
      </View>
    );
  };

  const openEdit = () => {
    if (!isEditableDate) return;
    const dayData = nutritionData.getDataForDate(selectedDate);
    setCaloriesStr(String(dayData.calories || 0));
    setProteinStr(String(dayData.protein || 0));
    setCreatine(!!dayData.creatine);
    setFishOil(!!dayData.fishOil);
    setEditVisible(true);
  };

  const saveEdit = () => {
    const calories = Math.max(0, parseInt(caloriesStr, 10) || 0);
    const protein = Math.max(0, parseInt(proteinStr, 10) || 0);
    nutritionData.updateDataForDate(selectedDate, {
      calories,
      protein,
      creatine,
      fishOil,
    });
    setEditVisible(false);
  };

  const editStyles = {
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: theme.cardBackground,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 24,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    title: { fontSize: 18, fontWeight: "600", color: theme.text },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 8,
    },
    label: { fontSize: 16, color: theme.text },
    input: {
      width: 120,
      height: 40,
      borderRadius: 8,
      paddingHorizontal: 10,
      backgroundColor: theme.background,
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
    },
    switchWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 12,
      gap: 12,
    },
    actionButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: theme.primary,
    },
    cancelButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: "rgba(128,128,128,0.15)",
    },
    actionText: { color: "#fff", fontWeight: "600" },
    cancelText: { color: theme.text },
    // Animated Toggle styles (match SettingsModal)
    toggleSwitch: {
      width: 50,
      height: 28,
      borderRadius: 14,
      paddingHorizontal: 2,
      justifyContent: "center",
    },
    toggleThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3,
      elevation: 5,
    },
  };

  // Animate switches when values change
  useEffect(() => {
    Animated.timing(creatineAnim, {
      toValue: creatine ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [creatine]);

  useEffect(() => {
    Animated.timing(fishOilAnim, {
      toValue: fishOil ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [fishOil]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          calendarStyles.modalContainer,
          { backgroundColor: theme.background },
        ]}
      >
        <StatusBar style={theme === lightTheme ? "dark" : "light"} />

        {/* Modal Header */}
        <View
          style={[
            calendarStyles.modalHeader,
            { borderBottomColor: theme.border },
          ]}
        >
          <TouchableOpacity onPress={onClose}>
            <Text
              style={[calendarStyles.closeButton, { color: theme.primary }]}
            >
              Done
            </Text>
          </TouchableOpacity>
          <Text style={[calendarStyles.modalTitle, { color: theme.text }]}>
            Calendar
          </Text>
          {isEditableDate ? (
            <TouchableOpacity onPress={openEdit}>
              <Text
                style={[calendarStyles.closeButton, { color: theme.primary }]}
              >
                Edit
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 50 }} />
          )}
        </View>

        {/* Month Navigation */}
        <View style={calendarStyles.monthNavigation}>
          <TouchableOpacity
            onPress={previousMonth}
            style={calendarStyles.navButton}
          >
            <Text
              style={[calendarStyles.navButtonText, { color: theme.primary }]}
            >
              ‹
            </Text>
          </TouchableOpacity>
          <Animated.Text
            style={[
              calendarStyles.monthTitle,
              { color: theme.text, opacity: gridAnim },
            ]}
          >
            {format(currentMonth, "MMMM yyyy")}
          </Animated.Text>
          <TouchableOpacity
            onPress={nextMonth}
            style={calendarStyles.navButton}
          >
            <Text
              style={[calendarStyles.navButtonText, { color: theme.primary }]}
            >
              ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today Button */}
        <View
          style={{
            paddingHorizontal: 24,
            marginTop: -8,
            marginBottom: 18,
          }}
        >
          <TouchableOpacity
            onPress={goToToday}
            style={{
              alignSelf: "center",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 14,
              backgroundColor: theme.cardBackground,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Text style={{ color: theme.textSecondary, fontWeight: "600" }}>
              Jump to Today
            </Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <Animated.View
          style={[
            calendarStyles.calendarGrid,
            {
              opacity: gridAnim,
              transform: [
                {
                  translateY: gridAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [6, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text
              key={day}
              style={[calendarStyles.dayHeader, { color: theme.textSecondary }]}
            >
              {day}
            </Text>
          ))}
          {days.map(renderDayCell)}
        </Animated.View>

        {/* Selected Date Summary */}
        {renderSelectedDateSummary()}

        {/* Edit Day Modal */}
        <Modal
          visible={editVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setEditVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={editStyles.overlay}
            onPress={() => setEditVisible(false)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
              style={{ width: "100%" }}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={editStyles.sheet}
                onPress={() => {}}
              >
                <View style={editStyles.sheetHeader}>
                  <Text style={editStyles.title}>Edit Day</Text>
                  <Text
                    style={[
                      calendarStyles.summaryText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {selectedDate ? format(selectedDate, "MMM d, yyyy") : ""}
                  </Text>
                </View>

                <View style={editStyles.row}>
                  <Text style={editStyles.label}>Calories</Text>
                  <TextInput
                    style={editStyles.input}
                    value={caloriesStr}
                    onChangeText={setCaloriesStr}
                    inputMode="numeric"
                    keyboardType="number-pad"
                  />
                </View>

                <View style={editStyles.row}>
                  <Text style={editStyles.label}>Protein (g)</Text>
                  <TextInput
                    style={editStyles.input}
                    value={proteinStr}
                    onChangeText={setProteinStr}
                    inputMode="numeric"
                    keyboardType="number-pad"
                  />
                </View>

                <View style={editStyles.row}>
                  <Text style={editStyles.label}>Creatine</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setCreatine((v) => !v)}
                  >
                    <Animated.View
                      style={[
                        editStyles.toggleSwitch,
                        {
                          backgroundColor: creatineAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["#E5E5EA", "#4CD964"],
                          }),
                        },
                      ]}
                    >
                      <Animated.View
                        style={[
                          editStyles.toggleThumb,
                          {
                            transform: [
                              {
                                translateX: creatineAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 22],
                                }),
                              },
                            ],
                          },
                        ]}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                </View>

                <View style={editStyles.row}>
                  <Text style={editStyles.label}>Fish Oil</Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setFishOil((v) => !v)}
                  >
                    <Animated.View
                      style={[
                        editStyles.toggleSwitch,
                        {
                          backgroundColor: fishOilAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["#E5E5EA", "#4CD964"],
                          }),
                        },
                      ]}
                    >
                      <Animated.View
                        style={[
                          editStyles.toggleThumb,
                          {
                            transform: [
                              {
                                translateX: fishOilAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, 22],
                                }),
                              },
                            ],
                          },
                        ]}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                </View>

                <View style={editStyles.buttonRow}>
                  <TouchableOpacity
                    style={editStyles.cancelButton}
                    onPress={() => setEditVisible(false)}
                  >
                    <Text style={editStyles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={editStyles.actionButton}
                    onPress={saveEdit}
                  >
                    <Text style={editStyles.actionText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};
