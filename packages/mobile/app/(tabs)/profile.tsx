import { StyleSheet, View, ScrollView, Alert, Platform } from 'react-native';
import { Typography } from '../../src/components/atoms/Typography';
import { Button } from '../../src/components/atoms/Button';
import { Card } from '../../src/components/molecules/Card';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { SPACING, COLORS } from '../../src/constants';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, signOut, updatePassword } = useAuth();
  const backgroundColor = theme === 'light' ? COLORS.background.light : COLORS.background.dark;
  const textColor = theme === 'light' ? COLORS.text.dark : COLORS.text.light;

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
      // Native - show Alert with text input simulation
      Alert.prompt(
        'Change Password',
        'Enter your new password (min 6 characters)',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Update',
            onPress: async (newPassword?: string) => {
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
            },
          },
        ],
        'secure-text'
      )
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
        <Typography variant="h1" style={{ color: textColor }}>
          Profile
        </Typography>
        <Typography variant="body" style={{ color: textColor, textAlign: 'center', marginBottom: SPACING.xl }}>
          Manage your account settings
        </Typography>

        {/* User Info Card - Full Width */}
        <View style={styles.cardContainer}>
          <Card
            title="User Information"
            description={`Email: ${user?.email || 'Not available'}\nUser ID: ${user?.id.slice(0, 8)}...`}
            variant="primary"
          />
        </View>
      </View>

      {/* Spacer to push buttons to bottom */}
      <View style={styles.spacer} />

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <Button
          title="Change Password"
          onPress={handleChangePassword}
          variant="secondary"
          style={{ marginBottom: SPACING.sm }}
        />
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="ghost"
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
