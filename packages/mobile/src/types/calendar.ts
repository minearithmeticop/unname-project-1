import { Todo } from './todo';
import { Dream } from './dream';

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  todos: Todo[];
  dreams: Dream[];
  hasEvents: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-11
  days: CalendarDay[];
}
