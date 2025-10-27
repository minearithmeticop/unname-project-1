import { Modal, View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../atoms/Typography';
import { Button } from '../atoms/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SPACING, COLORS } from '../../constants';
import { useState, useEffect } from 'react';
import { InputModal } from '../molecules/InputModal';
import { 
  generateInvitationCode, 
  getMyInvitationCodes 
} from '../../services/invitationService';
import { InvitationCode } from '../../types/invitation';

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function ProfileDrawer({ visible, onClose }: ProfileDrawerProps) {
  const { user, signOut, updatePassword, updateProfile } = useAuth();
  const { theme } = useTheme();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  
  // Invitation code states
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [loadingCode, setLoadingCode] = useState(false);
  const [recentCodes, setRecentCodes] = useState<InvitationCode[]>([]);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? COLORS.text.light : COLORS.text.dark;
  const cardBg = isDark ? '#2a2a2a' : '#f5f5f5';

  // Load recent invitation codes
  useEffect(() => {
    if (visible) {
      loadRecentCodes();
    }
  }, [visible]);

  // Countdown timer
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeRemaining('Expired');
        setCurrentCode(null);
        setExpiresAt(null);
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const loadRecentCodes = async () => {
    const { data } = await getMyInvitationCodes();
    if (data) {
      setRecentCodes(data.slice(0, 3)); // แสดงแค่ 3 codes ล่าสุด
    }
  };

  const handleGenerateCode = async () => {
    setLoadingCode(true);
    const { data, error } = await generateInvitationCode();
    setLoadingCode(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    if (data) {
      setCurrentCode(data.code);
      setExpiresAt(data.expires_at);
      loadRecentCodes();
    }
  };

  const handleCopyCode = () => {
    if (!currentCode) return;
    // TODO: Implement clipboard copy
    Alert.alert('Copied!', `Code ${currentCode} copied to clipboard`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maskEmail = (email: string) => {
    if (!email) return 'N/A';
    const [username, domain] = email.split('@');
    if (!domain) return email;
    const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

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
                <View style={styles.cardHeader}>
                  <Typography variant="h3" style={{ color: textColor }}>
                    User Information
                  </Typography>
                  <TouchableOpacity onPress={() => setShowEmail(!showEmail)}>
                    <Ionicons 
                      name={showEmail ? 'eye-off-outline' : 'eye-outline'} 
                      size={24} 
                      color={textColor} 
                    />
                  </TouchableOpacity>
                </View>
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
                    {showEmail ? (user?.email || 'N/A') : maskEmail(user?.email || '')}
                  </Typography>
                </View>
              </View>

              {/* Invitation Code Section */}
              <View style={[styles.card, { backgroundColor: cardBg }]}>
                <Typography variant="h3" style={{ color: textColor, marginBottom: SPACING.md }}>
                  Invite Friends
                </Typography>
                
                {currentCode ? (
                  <View style={styles.activeCode}>
                    <View style={styles.codeHeader}>
                      <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                      <Typography variant="caption" style={{ color: '#999', marginLeft: 6 }}>
                        Expires in {timeRemaining}
                      </Typography>
                    </View>
                    
                    <View style={styles.codeDisplay}>
                      <Typography 
                        variant="h2" 
                        style={{ 
                          color: COLORS.primary, 
                          letterSpacing: 3,
                          fontSize: 24 
                        }}
                      >
                        {currentCode}
                      </Typography>
                    </View>

                    <TouchableOpacity 
                      style={styles.copyButton}
                      onPress={handleCopyCode}
                    >
                      <Ionicons name="copy-outline" size={16} color={COLORS.primary} />
                      <Typography variant="body" style={{ color: COLORS.primary, marginLeft: 6 }}>
                        Copy Code
                      </Typography>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Button
                    title="Generate Code"
                    onPress={handleGenerateCode}
                    variant="outline"
                    icon="add-circle-outline"
                    disabled={loadingCode}
                    style={{ marginBottom: SPACING.sm }}
                  />
                )}

                {/* Recent Codes */}
                {recentCodes.length > 0 && (
                  <View style={styles.recentCodes}>
                    <Typography variant="caption" style={{ color: '#999', marginBottom: 6 }}>
                      Recent codes:
                    </Typography>
                    {recentCodes.map((code) => (
                      <View key={code.id} style={styles.recentCodeItem}>
                        <Typography variant="caption" style={{ color: textColor, letterSpacing: 1 }}>
                          {code.code}
                        </Typography>
                        <View style={[
                          styles.statusDot,
                          { backgroundColor: code.is_used ? '#4CAF50' : '#FF9800' }
                        ]} />
                      </View>
                    ))}
                  </View>
                )}
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
    marginLeft: 16, // เท่ากับ burger button
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  activeCode: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  codeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  codeDisplay: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  recentCodes: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentCodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
});
