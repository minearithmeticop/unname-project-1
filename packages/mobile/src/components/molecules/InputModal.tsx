import React, { useState } from 'react';
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { SPACING, COLORS } from '../../constants';

interface InputModalProps {
  visible: boolean;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function InputModal({
  visible,
  title,
  message,
  defaultValue = '',
  placeholder = '',
  secureTextEntry = false,
  onConfirm,
  onCancel,
}: InputModalProps) {
  const [value, setValue] = useState(defaultValue);

  React.useEffect(() => {
    if (visible) {
      setValue(defaultValue);
    }
  }, [visible, defaultValue]);

  const handleConfirm = () => {
    onConfirm(value);
    setValue('');
  };

  const handleCancel = () => {
    onCancel();
    setValue('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centered}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <Typography variant="h2" style={styles.title}>
                {title}
              </Typography>

              {message && (
                <Typography variant="body" style={styles.message}>
                  {message}
                </Typography>
              )}

              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                placeholderTextColor="#999"
                autoFocus
                secureTextEntry={secureTextEntry}
                autoCapitalize={secureTextEntry ? 'none' : 'words'}
                autoCorrect={false}
              />

              <View style={styles.buttons}>
                <Button
                  title="Cancel"
                  onPress={handleCancel}
                  variant="outline"
                  style={styles.button}
                />
                <Button
                  title="Confirm"
                  onPress={handleConfirm}
                  variant="primary"
                  style={styles.button}
                />
              </View>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: SPACING.lg,
    width: 300,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    marginBottom: SPACING.md,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
    marginBottom: SPACING.lg,
    backgroundColor: '#f9f9f9',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  button: {
    flex: 1,
  },
});
