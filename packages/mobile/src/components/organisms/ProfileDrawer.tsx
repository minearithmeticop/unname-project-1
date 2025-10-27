import { Modal, View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, COLORS } from '../../constants';
import { useState } from 'react';
import { InputModal } from '../molecules/InputModal';

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ visible, onClose }: ProfileDrawerProps) {
  const { user, signOut, updatePassword, updateProfile } = useAuth();
  const { theme } = useTheme();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;
  const cardBg = isDark ? '#2a2a2a' : '#f5f5f5';

  const handleChangePassword = async () => {
    if (Platform.OS === 'web') {
      const newPassword = (global as any).prompt?.('Enter new password:');
      if (!newPassword) return;

      const { error } = await updatePassword(newPassword);
      if (error) {
        (global as any).alert?.(`Error: ${error.message}`);
      } else {
        (global as any).alert?.('Password updated successfully!');
      }
    } else {
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    const { error } = await updatePassword(password);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password updated successfully!');
    }
  };

  const handleEditProfile = async () => {
    const currentName = user?.user_metadata?.display_name || '';
    
    if (Platform.OS === 'web') {
      const newName = (global as any).prompt?.('Enter display name:', currentName);
      if (!newName || newName === currentName) return;

      const { error } = await updateProfile(newName);
      if (error) {
        (global as any).alert?.(`Error: ${error.message}`);
      } else {
        (global as any).alert?.('Profile updated successfully!');
      }
    } else {
      setShowEditModal(true);
    }
  };

  const handleEditSubmit = async (displayName: string) => {
    const { error } = await updateProfile(displayName);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmed = (global as any).confirm?.('Are you sure you want to logout?');
      if (!confirmed) return;

      const { error } = await signOut();
      if (error) {
        (global as any).alert?.(`Error: ${error.message}`);
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              const { error } = await signOut();
              if (error) {
                Alert.alert('Error', error.message);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={[styles.drawer, { backgroundColor: bgColor }]}>
            {/* Header - เหมือนกับ header ของแอป */}
            <View style={[styles.header, { backgroundColor: bgColor }]}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              {/* User Info Card */}
              <View style={[styles.card, { backgroundColor: cardBg }]}>
                <Typography variant="h3" style={{ color: textColor, marginBottom: SPACING.xs }}>
                  User Information
                </Typography>
                <View style={styles.infoRow}>
                  <Typography variant="body" style={{ color: COLORS.textSecondary }}>
                    Name:
                  </Typography>
                  <Typography variant="body" style={{ color: textColor, fontWeight: '600' }}>
                    {user?.user_metadata?.display_name || 'Not set'}
                  </Typography>
                </View>
                <View style={styles.infoRow}>
                  <Typography variant="body" style={{ color: COLORS.textSecondary }}>
                    Email:
                  </Typography>
                  <Typography variant="body" style={{ color: textColor, fontWeight: '600' }}>
                    {user?.email || 'N/A'}
                  </Typography>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <Button
                  title="Edit Profile"
                  onPress={handleEditProfile}
                  variant="primary"
                  icon="person-outline"
                  style={{ marginBottom: SPACING.sm }}
                />
                <Button
                  title="Change Password"
                  onPress={handleChangePassword}
                  variant="secondary"
                  icon="key-outline"
                  style={{ marginBottom: SPACING.sm }}
                />
                <Button
                  title="Logout"
                  onPress={handleLogout}
                  variant="ghost"
                  icon="log-out-outline"
                />
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity 
            style={styles.backdrop} 
            activeOpacity={1} 
            onPress={onClose}
          />
        </View>
      </Modal>

      {/* Password Modal */}
      <InputModal
        visible={showPasswordModal}
        title="Change Password"
        placeholder="Enter new password"
        onConfirm={handlePasswordSubmit}
        onCancel={() => setShowPasswordModal(false)}
        secureTextEntry
      />

      {/* Edit Profile Modal */}
      <InputModal
        visible={showEditModal}
        title="Edit Profile"
        placeholder="Enter display name"
        defaultValue={user?.user_metadata?.display_name || ''}
        onConfirm={handleEditSubmit}
        onCancel={() => setShowEditModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    width: '80%',
    maxWidth: 400,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56, // เท่ากับ header ของแอป
    paddingHorizontal: 0,
    borderBottomWidth: 0,
  },
  backButton: {
    marginLeft: 32, // เท่ากับ burger button
    padding: 0,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  card: {
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
});
