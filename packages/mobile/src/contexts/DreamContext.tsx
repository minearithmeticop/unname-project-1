import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dream, DreamFormData } from '../types/dream';

interface DreamContextValue {
  dreams: Dream[];
  loading: boolean;
  addDream: (data: DreamFormData) => Promise<void>;
  updateDream: (id: string, data: Partial<Dream>) => Promise<void>;
  deleteDream: (id: string) => Promise<void>;
  getDreamsByDate: (date: string) => Dream[];
}

const DreamContext = createContext<DreamContextValue | undefined>(undefined);

const STORAGE_KEY = '@daily_checklist:dreams';

export function DreamProvider({ children }: { children: ReactNode }) {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setDreams(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading dreams:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDreams = async (newDreams: Dream[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDreams));
      setDreams(newDreams);
    } catch (error) {
      console.error('Error saving dreams:', error);
    }
  };

  const addDream = async (data: DreamFormData) => {
    const newDream: Dream = {
      id: Date.now().toString(),
      ...data,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveDreams([...dreams, newDream]);
  };

  const updateDream = async (id: string, data: Partial<Dream>) => {
    const updated = dreams.map(dream =>
      dream.id === id
        ? { ...dream, ...data, updatedAt: new Date().toISOString() }
        : dream
    );
    await saveDreams(updated);
  };

  const deleteDream = async (id: string) => {
    const filtered = dreams.filter(dream => dream.id !== id);
    await saveDreams(filtered);
  };

  const getDreamsByDate = (date: string) => {
    return dreams.filter(dream => dream.date === date);
  };

  return (
    <DreamContext.Provider
      value={{
        dreams,
        loading,
        addDream,
        updateDream,
        deleteDream,
        getDreamsByDate,
      }}
    >
      {children}
    </DreamContext.Provider>
  );
}

export function useDream() {
  const context = useContext(DreamContext);
  if (!context) {
    throw new Error('useDream must be used within DreamProvider');
  }
  return context;
}
