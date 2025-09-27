import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { useTheme } from '../../context/ThemeContext';
import { calendarStyles } from '../../styles/calendarStyles';
import { lightTheme } from '../../utils/themes';

export const CalendarModal = ({ visible, onClose, nutritionData, onDateSelect, selectedDate }) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderDayCell = (day) => {
    const dayData = nutritionData.getDataForDate(day);
    const hasData = dayData.calories > 0 || dayData.protein > 0 || dayData.creatine || dayData.fishOil;
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    const isTodayDate = isToday(day);

    return (
      <TouchableOpacity
        key={day.toISOString()}
        style={[
          calendarStyles.dayCell,
          { borderColor: theme.border },
          hasData && { backgroundColor: theme.success + "20" },
          isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
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
          <View style={[calendarStyles.dayIndicator, { backgroundColor: theme.success }]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectedDateSummary = () => {
    if (!selectedDate) return null;
    
    const dayData = nutritionData.getDataForDate(selectedDate);
    const isSelectedToday = isToday(selectedDate);

    return (
      <View style={[calendarStyles.dateSummary, { backgroundColor: theme.cardBackground }]}>
        <Text style={[calendarStyles.dateSummaryTitle, { color: theme.text }]}>
          {format(selectedDate, "EEEE, MMM d, yyyy")}
          {isSelectedToday && " (Today)"}
        </Text>
        <View style={calendarStyles.summaryGrid}>
          <Text style={[calendarStyles.summaryText, { color: theme.textSecondary }]}>
            {dayData.calories} calories • {dayData.protein}g protein
          </Text>
          <Text style={[calendarStyles.summaryText, { color: theme.textSecondary }]}>
            Creatine: {dayData.creatine ? "✓" : "✗"} • Fish Oil: {dayData.fishOil ? "✓" : "✗"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[calendarStyles.modalContainer, { backgroundColor: theme.background }]}>
        <StatusBar style={theme === lightTheme ? "dark" : "light"} />
        
        {/* Modal Header */}
        <View style={[calendarStyles.modalHeader, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[calendarStyles.closeButton, { color: theme.primary }]}>Done</Text>
          </TouchableOpacity>
          <Text style={[calendarStyles.modalTitle, { color: theme.text }]}>Calendar</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Month Navigation */}
        <View style={calendarStyles.monthNavigation}>
          <TouchableOpacity onPress={previousMonth} style={calendarStyles.navButton}>
            <Text style={[calendarStyles.navButtonText, { color: theme.primary }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[calendarStyles.monthTitle, { color: theme.text }]}>
            {format(currentMonth, "MMMM yyyy")}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={calendarStyles.navButton}>
            <Text style={[calendarStyles.navButtonText, { color: theme.primary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={calendarStyles.calendarGrid}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Text key={day} style={[calendarStyles.dayHeader, { color: theme.textSecondary }]}>
              {day}
            </Text>
          ))}
          {days.map(renderDayCell)}
        </View>

        {/* Selected Date Summary */}
        {renderSelectedDateSummary()}
      </SafeAreaView>
    </Modal>
  );
};