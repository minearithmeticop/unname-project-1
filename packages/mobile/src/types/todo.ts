export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string; // ISO date string
  time?: string; // HH:MM format
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
  date: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
}
