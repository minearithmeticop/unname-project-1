export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  date: string; // ISO date string
  time?: string; // HH:MM format (deprecated, use startTime/endTime)
  startTime?: string; // HH:MM format
  endTime?: string; // HH:MM format
  alert?: boolean; // Set alert notification
  notificationId?: string; // Expo notification ID
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
  date: string;
  time?: string; // deprecated
  startTime?: string;
  endTime?: string;
  alert?: boolean;
  priority: 'low' | 'medium' | 'high';
}
