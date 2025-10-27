import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography } from '../../../components/atoms/Typography';
import { useTheme } from '../../../contexts/ThemeContext';
import { COLORS, SPACING } from '../../../constants';
import { Todo } from '../../../types/todo';
import { Dream } from '../../../types/dream';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  todos: Todo[];
  dreams: Dream[];
}

export function CalendarGrid({ 
  currentMonth, 
  selectedDate, 
  onSelectDate,
  todos,
  dreams 
}: CalendarGridProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Sunday before first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Generate 42 days (6 weeks)
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const isSelected = dateStr === selectedDate;
      
      // Check if day has events
      const hasTodos = todos.some(t => t.date === dateStr);
      const hasDreams = dreams.some(d => d.date === dateStr);
      
      days.push({
        date: new Date(currentDate),
        dateStr,
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        hasTodos,
        hasDreams,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      {/* Week day headers */}
      <View style={styles.weekDaysRow}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Typography 
              variant="caption" 
              style={{ 
                color: isDark ? COLORS.text.light : COLORS.text.dark,
                fontWeight: '600' 
              }}
            >
              {day}
            </Typography>
          </View>
        ))}
      </View>

      {/* Calendar days */}
      <View style={styles.daysGrid}>
        {calendarDays.map((dayInfo, index) => {
          const textColor = !dayInfo.isCurrentMonth 
            ? '#999'
            : isDark 
            ? COLORS.text.light 
            : COLORS.text.dark;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                dayInfo.isToday && styles.todayCell,
                dayInfo.isSelected && styles.selectedCell,
              ]}
              onPress={() => onSelectDate(dayInfo.dateStr)}
              disabled={!dayInfo.isCurrentMonth}
            >
              <Typography 
                variant="body" 
                style={{ 
                  color: dayInfo.isSelected ? '#fff' : textColor,
                  fontWeight: dayInfo.isToday ? 'bold' : 'normal',
                }}
              >
                {dayInfo.day}
              </Typography>
              
              {/* Event indicators */}
              {(dayInfo.hasTodos || dayInfo.hasDreams) && (
                <View style={styles.indicators}>
                  {dayInfo.hasTodos && (
                    <View style={[styles.indicator, { backgroundColor: COLORS.primary }]} />
                  )}
                  {dayInfo.hasDreams && (
                    <View style={[styles.indicator, { backgroundColor: '#9C27B0' }]} />
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 4,
    position: 'relative',
  },
  todayCell: {
    backgroundColor: COLORS.primary + '20',
  },
  selectedCell: {
    backgroundColor: COLORS.primary,
  },
  indicators: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    gap: 3,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
