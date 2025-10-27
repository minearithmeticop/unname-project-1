import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { useTodo } from '../../../contexts/TodoContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { TodoItem } from '../components/TodoItem';
import { AddTodoModal } from '../components/AddTodoModal';
import { COLORS, SPACING } from '../../../constants';

export function TodoScreen() {
  const { todos, toggleTodo, deleteTodo } = useTodo();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const isDark = theme === 'dark';
  const bgColor = isDark ? COLORS.background.dark : COLORS.background.light;
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  const todayTodos = todos.filter(todo => todo.date === today);

  // Separate completed and pending
  const pendingTodos = todayTodos.filter(t => !t.completed);
  const completedTodos = todayTodos.filter(t => t.completed);

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header Stats */}
      <View style={styles.header}>
        <View>
          <Typography variant="h2" style={{ color: textColor }}>
            Today's Tasks
          </Typography>
          <Typography variant="body" style={{ color: COLORS.textSecondary, marginTop: 4 }}>
            {pendingTodos.length} pending, {completedTodos.length} completed
          </Typography>
        </View>
      </View>

      {/* Todo List */}
      <FlatList
        data={todayTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => toggleTodo(item.id)}
            onDelete={() => deleteTodo(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={64} color={COLORS.textSecondary} />
            <Typography variant="body" style={{ color: COLORS.textSecondary, marginTop: 16 }}>
              No tasks for today. Add one to get started!
            </Typography>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Todo Modal */}
      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
