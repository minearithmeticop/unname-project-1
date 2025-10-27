import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../atoms/Typography';
import { usePomodoro } from '../../contexts/PomodoroContext';
import { useTheme } from '../../contexts/ThemeContext';
import { COLORS, SPACING } from '../../constants';

interface PomodoroSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PomodoroSettingsModal: React.FC<PomodoroSettingsModalProps> = ({
  visible,
  onClose,
}) => {
  const { settings, updateSettings } = usePomodoro();
  const { theme } = useTheme();

  const [workDuration, setWorkDuration] = useState(settings.workDuration.toString());
  const [shortBreakDuration, setShortBreakDuration] = useState(settings.shortBreakDuration.toString());
  const [longBreakDuration, setLongBreakDuration] = useState(settings.longBreakDuration.toString());
  const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(settings.sessionsUntilLongBreak.toString());

  const isDark = theme === 'dark';
  const modalBg = isDark ? '#1a1a1a' : '#ffffff';
  const cardBg = isDark ? '#2a2a2a' : '#f5f5f5';
  const textColor = isDark ? '#ffffff' : '#000000';
  const inputBg = isDark ? '#333' : '#fff';
  const borderColor = isDark ? '#444' : '#ddd';

  const handleSave = () => {
    const work = parseInt(workDuration) || 25;
    const shortBreak = parseInt(shortBreakDuration) || 5;
    const longBreak = parseInt(longBreakDuration) || 15;
    const sessions = parseInt(sessionsUntilLongBreak) || 4;

    updateSettings({
      workDuration: Math.max(1, work),
      shortBreakDuration: Math.max(1, shortBreak),
      longBreakDuration: Math.max(1, longBreak),
      sessionsUntilLongBreak: Math.max(2, sessions),
    });
    onClose();
  };

  const handleReset = () => {
    setWorkDuration('25');
    setShortBreakDuration('5');
    setLongBreakDuration('15');
    setSessionsUntilLongBreak('4');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: modalBg }]}>
          <View style={styles.header}>
            <Typography variant="h2" style={{ color: textColor }}>
              Pomodoro Settings
            </Typography>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Work Duration */}
            <View style={[styles.settingCard, { backgroundColor: cardBg }]}>
              <View style={styles.settingRow}>
                <View style={styles.labelContainer}>
                  <Ionicons name="flash" size={20} color="#EF4444" />
                  <Typography variant="body" style={{ color: textColor, marginLeft: SPACING.xs }}>
                    Focus Time
                  </Typography>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: inputBg, color: textColor, borderColor },
                    ]}
                    value={workDuration}
                    onChangeText={setWorkDuration}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <Typography variant="caption" style={{ color: COLORS.textSecondary, marginLeft: SPACING.xs }}>
                    min
                  </Typography>
                </View>
              </View>
            </View>

            {/* Short Break */}
            <View style={[styles.settingCard, { backgroundColor: cardBg }]}>
              <View style={styles.settingRow}>
                <View style={styles.labelContainer}>
                  <Ionicons name="cafe" size={20} color="#10B981" />
                  <Typography variant="body" style={{ color: textColor, marginLeft: SPACING.xs }}>
                    Short Break
                  </Typography>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: inputBg, color: textColor, borderColor },
                    ]}
                    value={shortBreakDuration}
                    onChangeText={setShortBreakDuration}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <Typography variant="caption" style={{ color: COLORS.textSecondary, marginLeft: SPACING.xs }}>
                    min
                  </Typography>
                </View>
              </View>
            </View>

            {/* Long Break */}
            <View style={[styles.settingCard, { backgroundColor: cardBg }]}>
              <View style={styles.settingRow}>
                <View style={styles.labelContainer}>
                  <Ionicons name="bed" size={20} color="#3B82F6" />
                  <Typography variant="body" style={{ color: textColor, marginLeft: SPACING.xs }}>
                    Long Break
                  </Typography>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: inputBg, color: textColor, borderColor },
                    ]}
                    value={longBreakDuration}
                    onChangeText={setLongBreakDuration}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  <Typography variant="caption" style={{ color: COLORS.textSecondary, marginLeft: SPACING.xs }}>
                    min
                  </Typography>
                </View>
              </View>
            </View>

            {/* Sessions Until Long Break */}
            <View style={[styles.settingCard, { backgroundColor: cardBg }]}>
              <View style={styles.settingRow}>
                <View style={styles.labelContainer}>
                  <Ionicons name="repeat" size={20} color="#F59E0B" />
                  <Typography variant="body" style={{ color: textColor, marginLeft: SPACING.xs }}>
                    Long Break After
                  </Typography>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      { backgroundColor: inputBg, color: textColor, borderColor },
                    ]}
                    value={sessionsUntilLongBreak}
                    onChangeText={setSessionsUntilLongBreak}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Typography variant="caption" style={{ color: COLORS.textSecondary, marginLeft: SPACING.xs }}>
                    sessions
                  </Typography>
                </View>
              </View>
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={16} color={COLORS.primary} />
              <Typography variant="caption" style={{ color: COLORS.textSecondary, marginLeft: 6, flex: 1, fontSize: 11 }}>
                Standard: 25-min focus, 5-min short break, 15-min long break after 4 sessions
              </Typography>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Typography variant="body" style={{ color: COLORS.primary }}>
                Reset
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Typography variant="body" style={{ color: '#ffffff', fontWeight: '600' }}>
                Save
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    padding: SPACING.lg,
    maxHeight: 500,
  },
  settingCard: {
    padding: SPACING.sm,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 32,
  },
  input: {
    width: 60,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: SPACING.sm,
    borderRadius: 8,
    marginTop: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  resetButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
  },
});
