export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak' | 'idle';

export interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsUntilLongBreak: number;
}

export interface PomodoroState {
  phase: PomodoroPhase;
  timeRemaining: number; // seconds
  isRunning: boolean;
  sessionCount: number;
  currentTask?: string;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};
