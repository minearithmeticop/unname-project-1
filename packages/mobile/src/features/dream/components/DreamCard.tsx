import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { useTheme } from '../../../contexts/ThemeContext';
import { Dream } from '../../../types/dream';
import { COLORS, SPACING } from '../../../constants';

interface DreamCardProps {
  dream: Dream;
  onDelete: () => void;
}

export function DreamCard({ dream, onDelete }: DreamCardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const cardBg = isDark ? '#2a2a2a' : '#ffffff';
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    neutral: '😐',
    scary: '😨',
    exciting: '🤩',
  };

  const moodColors: Record<string, string> = {
    happy: '#4CAF50',
    sad: '#2196F3',
    neutral: '#9E9E9E',
    scary: '#F44336',
    exciting: '#FF9800',
  };

  // Format date
  const dreamDate = new Date(dream.date);
  const formattedDate = dreamDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {dream.mood && (
            <View style={[styles.moodBadge, { backgroundColor: (moodColors[dream.mood] || '#9E9E9E') + '20' }]}>
              <Typography variant="caption">{moodEmojis[dream.mood] || '😐'}</Typography>
            </View>
          )}
          <Typography variant="caption" style={{ color: COLORS.textSecondary }}>
            {formattedDate}
          </Typography>
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Typography variant="body" style={{ color: textColor, fontWeight: '600', marginBottom: 8 }}>
        {dream.title}
      </Typography>

      {/* Content */}
      <Typography 
        variant="caption" 
        style={{ color: COLORS.textSecondary, lineHeight: 20 }}
        numberOfLines={3}
      >
        {dream.content}
      </Typography>

      {/* Tags */}
      {dream.tags && dream.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {dream.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Typography variant="caption" style={{ color: COLORS.primary }}>
                #{tag}
              </Typography>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.primary + '10',
  },
});
