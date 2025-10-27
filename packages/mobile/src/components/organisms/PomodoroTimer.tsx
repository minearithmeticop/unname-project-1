import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../atoms/Typography';
import { PomodoroSettingsModal } from './PomodoroSettingsModal';
import { usePomodoro } from '../../contexts/PomodoroContext';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, SPACING } from '../../constants';

interface PomodoroTimerProps {
  compact?: boolean;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ compact = false }) => {
  const { state, startPomodoro, pausePomodoro, resumePomodoro, stopPomodoro, skipPhase } = usePomodoro();
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e1e1e' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (state.phase) {
      case 'work':
        return '#EF4444'; // Red
      case 'shortBreak':
        return '#10B981'; // Green
      case 'longBreak':
        return '#3B82F6'; // Blue
      default:
        return COLORS.primary;
    }
  };

  const getPhaseLabel = () => {
    switch (state.phase) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Pomodoro';
    }
  };

  const getPhaseIcon = () => {
    switch (state.phase) {
      case 'work':
        return 'flash';
      case 'shortBreak':
        return 'cafe';
      case 'longBreak':
        return 'bed';
      default:
        return 'timer-outline';
    }
  };

  if (compact) {
    // Compact view for Dashboard
    return (
      <View style={[styles.compactContainer, { backgroundColor: cardBg }]}>
        <View style={[styles.phaseIndicator, { backgroundColor: getPhaseColor() }]} />
        
        <View style={styles.compactMainContent}>
          <View style={styles.compactTimer}>
            <Ionicons name={getPhaseIcon()} size={24} color={getPhaseColor()} />
            <View style={styles.compactInfo}>
              <Typography variant="caption" style={{ color: COLORS.textSecondary }}>
                {getPhaseLabel()}
              </Typography>
              <Typography variant="h3" style={{ color: textColor }}>
                {formatTime(state.timeRemaining)}
              </Typography>
            </View>
          </View>

          <View style={styles.compactButtons}>
            {state.phase === 'idle' ? (
              <>
                <TouchableOpacity
                  style={styles.compactButton}
                  onPress={() => setShowSettings(true)}
                >
                  <Ionicons name="settings-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.compactButton, styles.compactPlayButton]}
                  onPress={() => startPomodoro()}
                >
                  <Ionicons name="play" size={20} color="#ffffff" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.compactButton}
                  onPress={() => setShowSettings(true)}
                >
                  <Ionicons name="settings-outline" size={20} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.compactButton}
                  onPress={stopPomodoro}
                >
                  <Ionicons name="stop" size={20} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.compactButton, styles.compactPlayButton]}
                  onPress={state.isRunning ? pausePomodoro : resumePomodoro}
                >
                  <Ionicons
                    name={state.isRunning ? 'pause' : 'play'}
                    size={20}
                    color="#ffffff"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.compactButton}
                  onPress={skipPhase}
                >
                  <Ionicons name="play-forward" size={20} color="#3B82F6" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <PomodoroSettingsModal
          visible={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </View>
    );
  }

  // Full view
  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      <View style={styles.header}>
        <View style={styles.phaseInfo}>
          <Ionicons name={getPhaseIcon()} size={24} color={getPhaseColor()} />
          <Typography variant="h3" style={{ color: textColor, marginLeft: SPACING.xs }}>
            {getPhaseLabel()}
          </Typography>
        </View>
        {state.sessionCount > 0 && (
          <View style={styles.sessionBadge}>
            <Typography variant="caption" style={{ color: textColor }}>
              Session {state.sessionCount}
            </Typography>
          </View>
        )}
      </View>

      {state.currentTask && (
        <View style={styles.taskInfo}>
          <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.textSecondary} />
          <Typography variant="body" style={{ color: COLORS.textSecondary, marginLeft: 6 }}>
            {state.currentTask}
          </Typography>
        </View>
      )}

      <View style={styles.timerDisplay}>
        <Typography
          variant="h1"
          style={{
            color: getPhaseColor(),
            fontSize: 64,
            fontWeight: 'bold',
            letterSpacing: 2,
          }}
        >
          {formatTime(state.timeRemaining)}
        </Typography>
      </View>

      <View style={styles.controls}>
        {state.phase !== 'idle' ? (
          <>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
              onPress={stopPomodoro}
            >
              <Ionicons name="stop" size={24} color="#EF4444" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: 'rgba(156, 163, 175, 0.1)' }]}
              onPress={() => setShowSettings(true)}
            >
              <Ionicons name="settings-outline" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: getPhaseColor() },
              ]}
              onPress={state.isRunning ? pausePomodoro : resumePomodoro}
            >
              <Ionicons
                name={state.isRunning ? 'pause' : 'play'}
                size={32}
                color="#ffffff"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}
              onPress={skipPhase}
            >
              <Ionicons name="play-forward" size={24} color="#3B82F6" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: 'rgba(156, 163, 175, 0.1)' }]}
              onPress={() => setShowSettings(true)}
            >
              <Ionicons name="settings-outline" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: getPhaseColor() }]}
              onPress={() => startPomodoro()}
            >
              <Ionicons name="play" size={28} color="#ffffff" />
              <Typography variant="h3" style={{ color: '#ffffff', marginLeft: SPACING.sm }}>
                Start Pomodoro
              </Typography>
            </TouchableOpacity>
          </>
        )}
      </View>

      <PomodoroSettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  phaseIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  compactInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  compactMainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: SPACING.sm,
  },
  compactTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  compactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactPlayButton: {
    backgroundColor: COLORS.primary,
  },
  timerDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  primaryButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
