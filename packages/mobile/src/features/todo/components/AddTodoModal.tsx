import { Modal, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTodo } from '../../../contexts/TodoContext';
import { TodoFormData } from '../../../types/todo';
import { COLORS, SPACING } from '../../../constants';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddTodoModal({ visible, onClose }: AddTodoModalProps) {
  const { theme } = useTheme();
  const { addTodo } = useTodo();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;
  const inputBg = isDark ? '#2a2a2a' : '#f5f5f5';

  const handleSubmit = async () => {
    if (!title.trim()) {
      if (Platform.OS === 'web') {
        (global as any).alert?.('Please enter a title');
      } else {
        Alert.alert('Error', 'Please enter a title');
      }
      return;
    }

    const formData: TodoFormData = {
      title: title.trim(),
      description: description.trim() || undefined,
      date: new Date().toISOString().split('T')[0], // Today
      time: time.trim() || undefined,
      priority,
    };

    await addTodo(formData);
    
    // Reset form
    setTitle('');
    setDescription('');
    setTime('');
    setPriority('medium');
    onClose();
  };

  const priorityOptions: Array<{ value: 'low' | 'medium' | 'high'; label: string; color: string }> = [
    { value: 'low', label: 'Low', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'high', label: 'High', color: '#F44336' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: bgColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h2" style={{ color: textColor }}>
              Add New Task
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

            {/* Time */}
            <View style={styles.field}>
              <Typography variant="body" style={{ color: textColor, marginBottom: 8, fontWeight: '600' }}>
                Time
              </Typography>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="HH:MM (e.g., 09:00)"
                placeholderTextColor={COLORS.textSecondary}
                value={time}
                onChangeText={setTime}
              />
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
            <Button title="Add Task" onPress={handleSubmit} variant="primary" style={{ flex: 1 }} />
          </View>
        </View>
      </View>
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
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
