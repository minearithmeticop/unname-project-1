import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { useTheme } from '../../../contexts/ThemeContext';
import { COLORS, SPACING } from '../../../constants';
import { Todo } from '../../../types/todo';
import { Dream } from '../../../types/dream';

interface DayDetailsProps {
  date: string;
  todos: Todo[];
  dreams: Dream[];
}

export function DayDetails({ date, todos, dreams }: DayDetailsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const bgColor = isDark ? '#1e1e1e' : '#fff';
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;
  const borderColor = isDark ? '#333' : '#e0e0e0';

  // Format date
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hasEvents = todos.length > 0 || dreams.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Date Header */}
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Typography variant="h3" style={{ color: textColor }}>
          {formattedDate}
        </Typography>
        {hasEvents && (
          <Typography variant="caption" style={{ color: '#999', marginTop: 4 }}>
            {todos.length} {todos.length === 1 ? 'task' : 'tasks'} · {dreams.length} {dreams.length === 1 ? 'dream' : 'dreams'}
          </Typography>
        )}
      </View>

      {/* Content */}
      {!hasEvents ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color="#ccc" />
          <Typography variant="body" style={{ color: '#999', marginTop: 12 }}>
            No events on this day
          </Typography>
        </View>
      ) : (
        <>
          {/* Todos Section */}
          {todos.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                <Typography 
                  variant="h3" 
                  style={{ color: textColor, marginLeft: 8 }}
                >
                  Tasks ({todos.length})
                </Typography>
              </View>
              
              {todos.map((todo) => (
                <View 
                  key={todo.id} 
                  style={[
                    styles.eventCard,
                    { 
                      backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                      borderLeftColor: 
                        todo.priority === 'high' ? '#F44336' :
                        todo.priority === 'medium' ? '#FF9800' :
                        '#4CAF50',
                    }
                  ]}
                >
                  <View style={styles.eventHeader}>
                    <Typography 
                      variant="body" 
                      style={{ 
                        color: textColor,
                        fontWeight: '600',
                        textDecorationLine: todo.completed ? 'line-through' : 'none',
                        flex: 1,
                      }}
                    >
                      {todo.title}
                    </Typography>
                    {todo.time && (
                      <View style={styles.timeBadge}>
                        <Ionicons name="time-outline" size={12} color="#666" />
                        <Typography variant="caption" style={{ color: '#666', marginLeft: 4 }}>
                          {todo.time}
                        </Typography>
                      </View>
                    )}
                  </View>
                  
                  {todo.description && (
                    <Typography 
                      variant="caption" 
                      style={{ color: '#999', marginTop: 4 }}
                      numberOfLines={2}
                    >
                      {todo.description}
                    </Typography>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Dreams Section */}
          {dreams.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="moon" size={20} color="#9C27B0" />
                <Typography 
                  variant="h3" 
                  style={{ color: textColor, marginLeft: 8 }}
                >
                  Dreams ({dreams.length})
                </Typography>
              </View>
              
              {dreams.map((dream) => {
                const moodEmojiMap: Record<string, string> = {
                  happy: '😊',
                  sad: '😢',
                  neutral: '😐',
                  scary: '😨',
                  exciting: '🤩',
                };
                const moodEmoji = dream.mood ? moodEmojiMap[dream.mood] || '😐' : '😐';

                return (
                  <View 
                    key={dream.id} 
                    style={[
                      styles.eventCard,
                      { 
                        backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                        borderLeftColor: '#9C27B0',
                      }
                    ]}
                  >
                    <View style={styles.eventHeader}>
                      <Typography 
                        variant="body" 
                        style={{ 
                          color: textColor,
                          fontWeight: '600',
                          flex: 1,
                        }}
                      >
                        {dream.title}
                      </Typography>
                      <Typography variant="h3" style={{ fontSize: 20 }}>
                        {moodEmoji}
                      </Typography>
                    </View>
                    
                    {dream.content && (
                      <Typography 
                        variant="caption" 
                        style={{ color: '#999', marginTop: 4 }}
                        numberOfLines={3}
                      >
                        {dream.content}
                      </Typography>
                    )}
                    
                    {dream.tags && dream.tags.length > 0 && (
                      <View style={styles.tags}>
                        {dream.tags.map((tag, index) => (
                          <Typography 
                            key={index}
                            variant="caption" 
                            style={{ color: '#9C27B0', marginRight: 8 }}
                          >
                            #{tag}
                          </Typography>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: SPACING.lg,
    borderRadius: 12,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    marginBottom: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  eventCard: {
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
});
