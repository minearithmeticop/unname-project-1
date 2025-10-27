import { Modal, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert, Switch } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTodo } from '../../../contexts/TodoContext';
import { Todo } from '../../../types/todo';
import { COLORS, SPACING } from '../../../constants';

interface EditTodoModalProps {
  visible: boolean;
  onClose: () => void;
  todo: Todo | null;
}

export function EditTodoModal({ visible, onClose, todo }: EditTodoModalProps) {
  const { theme } = useTheme();
  const { updateTodo } = useTodo();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [alert, setAlert] = useState(false);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;
  const inputBg = isDark ? '#2a2a2a' : '#f5f5f5';

  // Load todo data when modal opens
  useEffect(() => {
    if (visible && todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority);
      setAlert(todo.alert || false);

      // Parse time strings to Date objects
      if (todo.startTime) {
        const [hours, minutes] = todo.startTime.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        setStartTime(date);
      } else {
        setStartTime(null);
      }

      if (todo.endTime) {
        const [hours, minutes] = todo.endTime.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        setEndTime(date);
      } else {
        setEndTime(null);
      }
    }
  }, [visible, todo]);

  const formatTime = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartTime(selectedDate);
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndTime(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      if (Platform.OS === 'web') {
        (global as any).alert?.('Please enter a title');
      } else {
        Alert.alert('Error', 'Please enter a title');
      }
      return;
    }

    if (!todo) return;

    await updateTodo(todo.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      alert,
      priority,
    });

    onClose();
  };

  const priorityOptions: Array<{ value: 'low' | 'medium' | 'high'; label: string; color: string }> = [
    { value: 'low', label: 'Low', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'high', label: 'High', color: '#F44336' },
  ];

  if (!todo) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: bgColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h2" style={{ color: textColor }}>
              Edit Task
            </Typography>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Title */}
            <View style={styles.field}>
              <Typography variant="body" style={{ color: textColor, marginBottom: 8, fontWeight: '600' }}>
                Title *
              </Typography>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="Enter task title"
                placeholderTextColor={COLORS.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Typography variant="body" style={{ color: textColor, marginBottom: 8, fontWeight: '600' }}>
                Description
              </Typography>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: inputBg, color: textColor }]}
                placeholder="Enter description (optional)"
                placeholderTextColor={COLORS.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Time Range */}
            <View style={styles.field}>
              <Typography variant="body" style={{ color: textColor, marginBottom: 8, fontWeight: '600' }}>
                Time Range
              </Typography>
              
              {/* Start Time */}
              <View style={styles.timeRow}>
                <View style={styles.timeLabel}>
                  <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                  <Typography variant="caption" style={{ color: textColor, marginLeft: 6 }}>
                    Start Time
                  </Typography>
                </View>
                <TouchableOpacity
                  style={[styles.timeButton, { backgroundColor: inputBg }]}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Typography variant="body" style={{ color: startTime ? textColor : COLORS.textSecondary }}>
                    {startTime ? formatTime(startTime) : 'Set time'}
                  </Typography>
                  <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* End Time */}
              <View style={[styles.timeRow, { marginTop: 8 }]}>
                <View style={styles.timeLabel}>
                  <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                  <Typography variant="caption" style={{ color: textColor, marginLeft: 6 }}>
                    End Time
                  </Typography>
                </View>
                <TouchableOpacity
                  style={[styles.timeButton, { backgroundColor: inputBg }]}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Typography variant="body" style={{ color: endTime ? textColor : COLORS.textSecondary }}>
                    {endTime ? formatTime(endTime) : 'Set time'}
                  </Typography>
                  <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Duration Display */}
              {startTime && endTime && (
                <View style={styles.durationDisplay}>
                  <Ionicons name="hourglass-outline" size={16} color={COLORS.primary} />
                  <Typography variant="caption" style={{ color: COLORS.primary, marginLeft: 4 }}>
                    Duration: {Math.abs(endTime.getHours() - startTime.getHours())} hours{' '}
                    {Math.abs(endTime.getMinutes() - startTime.getMinutes())} minutes
                  </Typography>
                </View>
              )}
            </View>

            {/* Alert Toggle */}
            <View style={styles.field}>
              <View style={styles.alertRow}>
                <View style={styles.alertLabel}>
                  <Ionicons name="notifications-outline" size={20} color={textColor} />
                  <View style={{ marginLeft: 8 }}>
                    <Typography variant="body" style={{ color: textColor, fontWeight: '600' }}>
                      Set Alert
                    </Typography>
                    <Typography variant="caption" style={{ color: COLORS.textSecondary }}>
                      Get notified at start time
                    </Typography>
                  </View>
                </View>
                <Switch
                  value={alert}
                  onValueChange={setAlert}
                  trackColor={{ false: '#767577', true: COLORS.primary + '80' }}
                  thumbColor={alert ? COLORS.primary : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Priority */}
            <View style={styles.field}>
              <Typography variant="body" style={{ color: textColor, marginBottom: 8, fontWeight: '600' }}>
                Priority
              </Typography>
              <View style={styles.priorityContainer}>
                {priorityOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.priorityButton,
                      priority === option.value && { backgroundColor: option.color },
                    ]}
                    onPress={() => setPriority(option.value)}
                  >
                    <Typography
                      variant="caption"
                      style={{
                        color: priority === option.value ? '#fff' : textColor,
                        fontWeight: priority === option.value ? '600' : '400',
                      }}
                    >
                      {option.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Button title="Cancel" onPress={onClose} variant="outline" style={{ flex: 1, marginRight: 8 }} />
            <Button title="Save Changes" onPress={handleSubmit} variant="primary" style={{ flex: 1 }} />
          </View>
        </View>
      </View>

      {/* Time Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startTime || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleStartTimeChange}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endTime || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleEndTimeChange}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    padding: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  input: {
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.sm,
    borderRadius: 8,
    minWidth: 120,
  },
  durationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: SPACING.xs,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 6,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
