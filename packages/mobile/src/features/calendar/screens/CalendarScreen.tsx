import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { useTodo } from '../../../contexts/TodoContext';
import { useDream } from '../../../contexts/DreamContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { CalendarGrid } from '../components/CalendarGrid';
import { DayDetails } from '../components/DayDetails';
import { COLORS, SPACING } from '../../../constants';

export function CalendarScreen() {
  const { todos } = useTodo();
  const { dreams } = useDream();
  const { theme } = useTheme();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const isDark = theme === 'dark';
  const bgColor = isDark ? COLORS.background.dark : COLORS.background.light;
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;

  // Navigate months
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Get events for selected date
  const dateTodos = todos.filter(t => t.date === selectedDate);
  const dateDreams = dreams.filter(d => d.date === selectedDate);

  // Format month/year
  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Typography variant="h2" style={{ color: textColor }}>
            {monthYear}
          </Typography>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
            <Typography variant="caption" style={{ color: COLORS.primary, fontWeight: '600' }}>
              Today
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Month Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Calendar Grid */}
        <CalendarGrid
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          todos={todos}
          dreams={dreams}
        />

        {/* Day Details */}
        <DayDetails
          date={selectedDate}
          todos={dateTodos}
          dreams={dateDreams}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '20',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: 8,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
  },
});
