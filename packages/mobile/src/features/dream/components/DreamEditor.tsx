import { Modal, View, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../../components/atoms/Typography';
import { Button } from '../../../components/atoms/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { useDream } from '../../../contexts/DreamContext';
import { DreamFormData } from '../../../types/dream';
import { COLORS, SPACING } from '../../../constants';

interface DreamEditorProps {
  visible: boolean;
  onClose: () => void;
}

export function DreamEditor({ visible, onClose }: DreamEditorProps) {
  const { theme } = useTheme();
  const { addDream } = useDream();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<'happy' | 'sad' | 'neutral' | 'scary' | 'exciting' | undefined>(undefined);
  const [tags, setTags] = useState('');

  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;
  const inputBg = isDark ? '#2a2a2a' : '#f5f5f5';

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      if (Platform.OS === 'web') {
        (global as any).alert?.('Please enter title and content');
      } else {
        Alert.alert('Error', 'Please enter title and content');
      }
      return;
    }

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const formData: DreamFormData = {
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: tagArray.length > 0 ? tagArray : undefined,
    };

    await addDream(formData);
    
    // Reset form
    setTitle('');
    setContent('');
    setMood(undefined);
    setTags('');
    onClose();
  };

  const moodOptions: Array<{
    value: 'happy' | 'sad' | 'neutral' | 'scary' | 'exciting';
    emoji: string;
    label: string;
  }> = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'scary', emoji: '😨', label: 'Scary' },
    { value: 'exciting', emoji: '🤩', label: 'Exciting' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: bgColor }]}>
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h2" style={{ color: textColor }}>
              Record Dream
            </Typography>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Title */}
            <View style={styles.field}>
              <Typography variant="body" style={{ color: textColor, marginBottom: 8, fontWeight: '600' }}>
                Title *
              </Typography>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="Give your dream a title"
                placeholderTextColor={COLORS.textSecondary}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Content */}
            <View style={styles.field}>
              <Typography variant="body" style={{ color: textColor, marginBottom: 8, fontWeight: '600' }}>
                Dream Content *
              </Typography>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: inputBg, color: textColor }]}
                placeholder="Describe your dream in detail..."
                placeholderTextColor={COLORS.textSecondary}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={8}
              />
            </View>

            {/* Mood */}
            <View style={styles.field}>
              <Typography variant="body" style={{ color: textColor, marginBottom: 8, fontWeight: '600' }}>
                Mood
              </Typography>
              <View style={styles.moodContainer}>
                {moodOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.moodButton,
                      mood === option.value && styles.moodButtonActive,
                    ]}
                    onPress={() => setMood(option.value)}
                  >
                    <Typography variant="h3">{option.emoji}</Typography>
                    <Typography
                      variant="caption"
                      style={{
                        color: mood === option.value ? COLORS.primary : textColor,
                        marginTop: 4,
                      }}
                    >
                      {option.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Tags */}
            <View style={styles.field}>
              <Typography variant="body" style={{ color: textColor, marginBottom: 8, fontWeight: '600' }}>
                Tags
              </Typography>
              <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                placeholder="Enter tags separated by commas"
                placeholderTextColor={COLORS.textSecondary}
                value={tags}
                onChangeText={setTags}
              />
              <Typography variant="caption" style={{ color: COLORS.textSecondary, marginTop: 4 }}>
                Example: flying, adventure, family
              </Typography>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Button title="Cancel" onPress={onClose} variant="outline" style={{ flex: 1, marginRight: 8 }} />
            <Button title="Save Dream" onPress={handleSubmit} variant="primary" style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    padding: SPACING.lg,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  input: {
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodButton: {
    width: '18%',
    aspectRatio: 1,
    padding: SPACING.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  footer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
