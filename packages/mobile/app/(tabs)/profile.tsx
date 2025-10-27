import { StyleSheet, View, ScrollView, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { Typography } from '../../src/components/atoms/Typography';
import { Button } from '../../src/components/atoms/Button';
import { Card, InputModal } from '../../src/components/molecules';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { SPACING, COLORS } from '../../src/constants';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, signOut, updatePassword, updateProfile } = useAuth();
  const backgroundColor = theme === 'light' ? COLORS.background.light : COLORS.background.dark;
  const textColor = theme === 'light' ? COLORS.text.dark : COLORS.text.light;

  // Modal states
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleEditProfile = () => {
    // Platform-specific prompt
    if (Platform.OS === 'web') {
      const currentName = user?.user_metadata?.display_name || ''
      const newName = (global as any).prompt?.('Enter your display name:', currentName)
      
      if (!newName) {
        return // User cancelled
      }
      
      if (newName.trim().length === 0) {
        ;(global as any).alert?.('Display name cannot be empty')
        return
      }
      
      // Update profile
      const performUpdate = async () => {
        const { error } = await updateProfile(newName.trim())
        
        if (error) {
          ;(global as any).alert?.(`Failed to update profile: ${error.message}`)
        } else {
          ;(global as any).alert?.('Profile updated successfully! ✅')
        }
      }
      
      performUpdate()
    } else {
      // Native - show custom modal
      setShowNameModal(true)
    }
  }

  const handleNameConfirm = async (newName: string) => {
    setShowNameModal(false)
    
    if (!newName || newName.trim().length === 0) {
      Alert.alert('Error', 'Display name cannot be empty')
      return
    }
    
    const { error } = await updateProfile(newName.trim())
    
    if (error) {
      Alert.alert('Error', `Failed to update profile: ${error.message}`)
    } else {
      Alert.alert('Success', 'Profile updated successfully! ✅')
    }
  }

  const handleChangePassword = () => {
    // Platform-specific prompt
    if (Platform.OS === 'web') {
      const newPassword = (global as any).prompt?.('Enter new password (min 6 characters):')
      
      if (!newPassword) {
        return // User cancelled
      }
      
      if (newPassword.length < 6) {
        ;(global as any).alert?.('Password must be at least 6 characters long')
        return
      }
      
      // Update password
      const performUpdate = async () => {
        const { error } = await updatePassword(newPassword)
        
        if (error) {
          ;(global as any).alert?.(`Failed to update password: ${error.message}`)
        } else {
          ;(global as any).alert?.('Password updated successfully! ✅')
        }
      }
      
      performUpdate()
    } else {
      // Native - show custom modal
      setShowPasswordModal(true)
    }
  }

  const handlePasswordConfirm = async (newPassword: string) => {
    setShowPasswordModal(false)
    
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long')
      return
    }
    
    const { error } = await updatePassword(newPassword)
    
    if (error) {
      Alert.alert('Error', `Failed to update password: ${error.message}`)
    } else {
      Alert.alert('Success', 'Password updated successfully! ✅')
    }
  }

  const handleLogout = () => {
    console.log('🔵 handleLogout called!')
    
    // Web-compatible confirmation
    if (Platform.OS === 'web') {
      const confirmed = (global as any).confirm?.('Are you sure you want to sign out?')
      if (!confirmed) return
      
      const performLogout = async () => {
        try {
          console.log('🔄 Starting logout process...')
          const { error } = await signOut()
          
          if (error) {
            console.error('Logout error:', error)
            ;(global as any).alert?.(`Failed to sign out: ${error.message}`)
          } else {
            console.log('✅ Successfully logged out')
          }
        } catch (error) {
          console.error('Logout exception:', error)
          ;(global as any).alert?.('An unexpected error occurred')
        }
      }
      
      performLogout()
    } else {
      // Native Alert for iOS/Android
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              try {
                console.log('🔄 Starting logout process...')
                const { error } = await signOut()
                
                if (error) {
                  console.error('Logout error:', error)
                  Alert.alert('Error', `Failed to sign out: ${error.message}`)
                } else {
                  console.log('✅ Successfully logged out')
                }
              } catch (error) {
                console.error('Logout exception:', error)
                Alert.alert('Error', 'An unexpected error occurred')
              }
            },
          },
        ]
      )
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        <Typography variant="h1" style={{ color: textColor, textAlign: 'center' }}>
          Profile
        </Typography>
        <Typography variant="body" style={{ color: textColor, textAlign: 'center', marginBottom: SPACING.xl }}>
          Manage your account settings
        </Typography>

        {/* User Info Card - Full Width */}
        <View style={styles.cardContainer}>
          <Card
            title="User Information"
            description={`Name: ${user?.user_metadata?.display_name || 'Not set'}\nEmail: ${user?.email || 'Not available'}`}
            variant="primary"
          />
        </View>
      </View>

      {/* Spacer to push buttons to bottom */}
      <View style={styles.spacer} />

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
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
          style={{ marginBottom: SPACING.md }}
        />

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Typography variant="caption" style={{ color: textColor, textAlign: 'center' }}>
            App Version: 1.0.0
          </Typography>
          <Typography variant="caption" style={{ color: textColor, textAlign: 'center', marginTop: SPACING.xs }}>
            Built with React Native + Expo
          </Typography>
        </View>
      </View>

      {/* Input Modals */}
      <InputModal
        visible={showNameModal}
        title="Edit Profile"
        message="Enter your display name"
        defaultValue={user?.user_metadata?.display_name || ''}
        placeholder="John Doe"
        onConfirm={handleNameConfirm}
        onCancel={() => setShowNameModal(false)}
      />

      <InputModal
        visible={showPasswordModal}
        title="Change Password"
        message="Enter your new password (min 6 characters)"
        placeholder="••••••••"
        secureTextEntry
        onConfirm={handlePasswordConfirm}
        onCancel={() => setShowPasswordModal(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  content: {
    width: '100%',
  },
  cardContainer: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  spacer: {
    flex: 1,
    minHeight: SPACING.xl * 2,
  },
  bottomActions: {
    width: '100%',
    paddingHorizontal: 0,
  },
  infoContainer: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#C6C6C8',
    width: '100%',
    alignItems: 'center',
  },
});
