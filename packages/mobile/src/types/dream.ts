export interface Dream {
  id: string;
  title: string;
  content: string;
  mood?: 'happy' | 'sad' | 'neutral' | 'scary' | 'exciting';
  tags?: string[];
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface DreamFormData {
  title: string;
  content: string;
  mood?: 'happy' | 'sad' | 'neutral' | 'scary' | 'exciting';
  tags?: string[];
}
