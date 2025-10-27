import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, TodoFormData } from '../types/todo';
import { 
  scheduleTaskNotification, 
  cancelTaskNotification,
  registerForPushNotificationsAsync 
} from '../services/notificationService';

interface TodoContextValue {
  todos: Todo[];
  loading: boolean;
  addTodo: (data: TodoFormData) => Promise<void>;
  updateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  getTodosByDate: (date: string) => Todo[];
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

const STORAGE_KEY = '@daily_checklist:todos';

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load todos from storage and register notifications
  useEffect(() => {
    loadTodos();
    registerForPushNotificationsAsync();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setTodos(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      setTodos(newTodos);
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const addTodo = async (data: TodoFormData) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      ...data,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Schedule notification if alert is enabled and startTime exists
    if (data.alert && data.startTime) {
      const notificationId = await scheduleTaskNotification(
        data.title,
        data.startTime,
        newTodo.id
      );
      if (notificationId) {
        newTodo.notificationId = notificationId;
      }
    }

    await saveTodos([...todos, newTodo]);
  };

  const updateTodo = async (id: string, data: Partial<Todo>) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // Cancel old notification if exists
    if (todo.notificationId) {
      await cancelTaskNotification(todo.notificationId);
    }

    // Schedule new notification if alert is enabled and startTime exists
    let notificationId: string | undefined;
    if (data.alert && data.startTime) {
      notificationId = await scheduleTaskNotification(
        data.title || todo.title,
        data.startTime,
        id
      );
    }

    const updated = todos.map(t =>
      t.id === id
        ? { 
            ...t, 
            ...data, 
            notificationId: notificationId || undefined,
            updatedAt: new Date().toISOString() 
          }
        : t
    );
    await saveTodos(updated);
  };

  const deleteTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    
    // Cancel notification if exists
    if (todo?.notificationId) {
      await cancelTaskNotification(todo.notificationId);
    }

    const filtered = todos.filter(todo => todo.id !== id);
    await saveTodos(filtered);
  };

  const toggleTodo = async (id: string) => {
    const updated = todos.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    );
    await saveTodos(updated);
  };

  const getTodosByDate = (date: string) => {
    return todos.filter(todo => todo.date === date);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        getTodosByDate,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within TodoProvider');
  }
  return context;
}
