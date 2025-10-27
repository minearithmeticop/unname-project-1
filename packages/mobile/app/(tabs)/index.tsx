import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../src/components/atoms/Typography';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useTodo } from '../../src/contexts/TodoContext';
import { useDream } from '../../src/contexts/DreamContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { PomodoroTimer } from '../../src/components/organisms/PomodoroTimer';
import { NotificationDebugger } from '../../src/components/organisms/NotificationDebugger';
import { COLORS, SPACING } from '../../src/constants';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { todos } = useTodo();
  const { dreams } = useDream();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const bgColor = isDark ? COLORS.background.dark : COLORS.background.light;
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;
  const cardBg = isDark ? '#1e1e1e' : '#fff';

  // Get today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayTodos = todos.filter(t => t.date === today);
  const pendingTodos = todayTodos.filter(t => !t.completed).length;
  const completedTodos = todayTodos.filter(t => t.completed).length;
  const recentDreams = dreams.slice(0, 3);

  const QuickActionCard = ({ 
    icon, 
    title, 
    color, 
    onPress 
  }: { 
    icon: keyof typeof Ionicons.glyphMap; 
    title: string; 
    color: string; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.quickCard, { backgroundColor: cardBg }]}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Typography variant="body" style={{ color: textColor, marginTop: 8, textAlign: 'center' }}>
        {title}
      </Typography>
    </TouchableOpacity>
  );

  const StatCard = ({ 
    icon, 
    label, 
    value, 
    color 
  }: { 
    icon: keyof typeof Ionicons.glyphMap; 
    label: string; 
    value: number; 
    color: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: cardBg }]}>
      <Ionicons name={icon} size={32} color={color} />
      <Typography variant="h2" style={{ color: textColor, marginTop: 8 }}>
        {value}
      </Typography>
      <Typography variant="caption" style={{ color: '#999' }}>
        {label}
      </Typography>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Task Status Header */}
      <View style={styles.header}>
        {pendingTodos === 0 && todayTodos.length > 0 ? (
          <View style={[styles.motivationCard, { backgroundColor: COLORS.primary + '20' }]}>
            <Ionicons name="bulb" size={32} color={COLORS.primary} />
            <Typography variant="body" style={{ color: textColor, marginTop: 8, textAlign: 'center' }}>
              Great job! All tasks completed! 🎉
            </Typography>
          </View>
        ) : pendingTodos > 0 ? (
          <View style={[styles.motivationCard, { backgroundColor: '#FF9800' + '20' }]}>
            <Ionicons name="flash" size={32} color="#FF9800" />
            <Typography variant="body" style={{ color: textColor, marginTop: 8, textAlign: 'center' }}>
              You have {pendingTodos} task{pendingTodos > 1 ? 's' : ''} to complete today!
            </Typography>
          </View>
        ) : (
          <TouchableOpacity 
            style={[styles.motivationCard, { backgroundColor: COLORS.primary + '20' }]}
            onPress={() => router.push('/todo')}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={32} color={COLORS.primary} />
            <Typography variant="body" style={{ color: textColor, marginTop: 8, textAlign: 'center' }}>
              No tasks for today.{'\n'}Create your first task! 💪
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Pomodoro Timer */}
      <View style={styles.section}>
        <PomodoroTimer compact />
      </View>

      {/* Notification Debugger */}
      <View style={styles.section}>
        <NotificationDebugger />
      </View>

      {/* Today's Stats */}
      <View style={styles.section}>
        <Typography variant="h3" style={{ color: textColor, marginBottom: SPACING.md }}>
          Today's Overview
        </Typography>
        <View style={styles.statsRow}>
          <StatCard
            icon="checkmark-circle"
            label="Completed"
            value={completedTodos}
            color="#4CAF50"
          />
          <StatCard
            icon="time"
            label="Pending"
            value={pendingTodos}
            color="#FF9800"
          />
          <StatCard
            icon="moon"
            label="Total Dreams"
            value={dreams.length}
            color="#9C27B0"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Typography variant="h3" style={{ color: textColor, marginBottom: SPACING.md }}>
          Quick Actions
        </Typography>
        <View style={styles.quickActionsRow}>
          <QuickActionCard
            icon="add-circle"
            title="Add Todo"
            color={COLORS.primary}
            onPress={() => router.push('/todo')}
          />
          <QuickActionCard
            icon="create"
            title="Record Dream"
            color="#9C27B0"
            onPress={() => router.push('/dreams')}
          />
          <QuickActionCard
            icon="calendar"
            title="View Calendar"
            color="#FF5722"
            onPress={() => router.push('/calendar')}
          />
        </View>
      </View>

      {/* Recent Dreams Preview */}
      {recentDreams.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="h3" style={{ color: textColor }}>
              Recent Dreams
            </Typography>
            <TouchableOpacity onPress={() => router.push('/dreams')}>
              <Typography variant="caption" style={{ color: COLORS.primary }}>
                View All
              </Typography>
            </TouchableOpacity>
          </View>
          
          {recentDreams.map((dream) => {
            const moodEmojiMap: Record<string, string> = {
              happy: '😊',
              sad: '😢',
              neutral: '😐',
              scary: '😨',
              exciting: '🤩',
            };
            const moodEmoji = dream.mood ? moodEmojiMap[dream.mood] || '😐' : '😐';

            return (
              <View key={dream.id} style={[styles.dreamPreview, { backgroundColor: cardBg }]}>
                <View style={styles.dreamHeader}>
                  <Typography variant="body" style={{ color: textColor, fontWeight: '600', flex: 1 }}>
                    {dream.title}
                  </Typography>
                  <Typography variant="h3" style={{ fontSize: 20 }}>
                    {moodEmoji}
                  </Typography>
                </View>
                <Typography variant="caption" style={{ color: '#999', marginTop: 4 }} numberOfLines={2}>
                  {dream.content}
                </Typography>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  quickCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dreamPreview: {
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dreamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  motivationCard: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
});
