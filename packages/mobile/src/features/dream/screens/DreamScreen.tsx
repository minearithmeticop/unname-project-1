import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { useDream } from '../../../contexts/DreamContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { DreamCard } from '../components/DreamCard';
import { DreamEditor } from '../components/DreamEditor';
import { COLORS, SPACING } from '../../../constants';

export function DreamScreen() {
  const { dreams, deleteDream } = useDream();
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const isDark = theme === 'dark';
  const bgColor = isDark ? COLORS.background.dark : COLORS.background.light;
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;

  // Sort dreams by date (newest first)
  const sortedDreams = [...dreams].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Typography variant="h2" style={{ color: textColor }}>
            Dream Journal
          </Typography>
          <Typography variant="body" style={{ color: COLORS.textSecondary, marginTop: 4 }}>
            {dreams.length} dreams recorded
          </Typography>
        </View>
      </View>

      {/* Dreams List */}
      <FlatList
        data={sortedDreams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DreamCard
            dream={item}
            onDelete={() => deleteDream(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="moon-outline" size={64} color={COLORS.textSecondary} />
            <Typography variant="body" style={{ color: COLORS.textSecondary, marginTop: 16, textAlign: 'center' }}>
              No dreams recorded yet.{'\n'}Start journaling your dreams!
            </Typography>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Dream Editor Modal */}
      <DreamEditor
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9C27B0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
