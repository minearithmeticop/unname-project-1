import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { PomodoroPhase, PomodoroSettings, PomodoroState, DEFAULT_SETTINGS } from '../types/pomodoro';

interface PomodoroContextType {
  state: PomodoroState;
  settings: PomodoroSettings;
  startPomodoro: (taskTitle?: string) => void;
  pausePomodoro: () => void;
  resumePomodoro: () => void;
  stopPomodoro: () => void;
  skipPhase: () => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [state, setState] = useState<PomodoroState>({
    phase: 'idle',
    timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
    isRunning: false,
    sessionCount: 0,
    currentTask: undefined,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const backgroundTimeRef = useRef<number>(Date.now());

  // Handle app going to background/foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [state.isRunning]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && state.isRunning) {
      // App came to foreground, calculate time elapsed
      const now = Date.now();
      const elapsed = Math.floor((now - backgroundTimeRef.current) / 1000);
      
      setState(prev => {
        const newTimeRemaining = Math.max(0, prev.timeRemaining - elapsed);
        if (newTimeRemaining === 0) {
          handlePhaseComplete(prev);
          return prev;
        }
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      // App going to background, record time
      backgroundTimeRef.current = Date.now();
    }
  };

  // Timer countdown
  useEffect(() => {
    if (state.isRunning && state.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            handlePhaseComplete(prev);
            return { ...prev, timeRemaining: 0, isRunning: false };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.timeRemaining]);

  const handlePhaseComplete = (currentState: PomodoroState) => {
    const newSessionCount = currentState.phase === 'work' 
      ? currentState.sessionCount + 1 
      : currentState.sessionCount;

    let nextPhase: PomodoroPhase;
    let nextDuration: number;

    if (currentState.phase === 'work') {
      // Work phase completed
      if (newSessionCount % settings.sessionsUntilLongBreak === 0) {
        nextPhase = 'longBreak';
        nextDuration = settings.longBreakDuration * 60;
      } else {
        nextPhase = 'shortBreak';
        nextDuration = settings.shortBreakDuration * 60;
      }
    } else {
      // Break completed, back to work
      nextPhase = 'work';
      nextDuration = settings.workDuration * 60;
    }

    setState({
      phase: nextPhase,
      timeRemaining: nextDuration,
      isRunning: false, // Auto-pause after phase complete
      sessionCount: newSessionCount,
      currentTask: currentState.currentTask,
    });
  };

  const startPomodoro = (taskTitle?: string) => {
    setState({
      phase: 'work',
      timeRemaining: settings.workDuration * 60,
      isRunning: true,
      sessionCount: 0,
      currentTask: taskTitle,
    });
    backgroundTimeRef.current = Date.now();
  };

  const pausePomodoro = () => {
    setState(prev => ({ ...prev, isRunning: false }));
  };

  const resumePomodoro = () => {
    setState(prev => ({ ...prev, isRunning: true }));
    backgroundTimeRef.current = Date.now();
  };

  const stopPomodoro = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setState({
      phase: 'idle',
      timeRemaining: settings.workDuration * 60,
      isRunning: false,
      sessionCount: 0,
      currentTask: undefined,
    });
  };

  const skipPhase = () => {
    handlePhaseComplete(state);
  };

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <PomodoroContext.Provider
      value={{
        state,
        settings,
        startPomodoro,
        pausePomodoro,
        resumePomodoro,
        stopPomodoro,
        skipPhase,
        updateSettings,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within PomodoroProvider');
  }
  return context;
};
