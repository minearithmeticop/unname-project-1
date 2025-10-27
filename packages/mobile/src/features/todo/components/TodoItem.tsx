import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { useTheme } from '../../../contexts/ThemeContext';
import { Todo } from '../../../types/todo';
import { COLORS, SPACING } from '../../../constants';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const cardBg = isDark ? '#2a2a2a' : '#ffffff';
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;

  const priorityColors = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336',
  };

  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      {/* Priority Indicator */}
      <View style={[styles.priorityBar, { backgroundColor: priorityColors[todo.priority] }]} />

      {/* Checkbox */}
      <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
        <Ionicons
          name={todo.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={todo.completed ? COLORS.primary : COLORS.textSecondary}
        />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Typography
          variant="body"
          style={[
            { color: textColor, fontWeight: '600' },
            todo.completed && styles.completedText,
          ]}
        >
          {todo.title}
        </Typography>
        {todo.description && (
          <Typography
            variant="caption"
            style={[
              { color: COLORS.textSecondary, marginTop: 4 },
              todo.completed && styles.completedText,
            ]}
          >
            {todo.description}
          </Typography>
        )}
        {todo.time && (
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Typography variant="caption" style={{ color: COLORS.textSecondary, marginLeft: 4 }}>
              {todo.time}
            </Typography>
          </View>
        )}
      </View>

      {/* Delete Button */}
      <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color="#F44336" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  priorityBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  checkbox: {
    marginLeft: 8,
    marginRight: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
});
