import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Typography } from '../../src/components/atoms/Typography';
import { Button } from '../../src/components/atoms/Button';
import { Card } from '../../src/components/molecules/Card';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { SPACING, COLORS } from '../../src/constants';
import { formatDate } from '../../src/utils/helpers';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const backgroundColor = theme === 'light' ? COLORS.background.light : COLORS.background.dark;
  const textColor = theme === 'light' ? COLORS.text.dark : COLORS.text.light;

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit Profile feature coming soon!');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings feature coming soon!');
  };

  const handleLogout = () => {
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
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Typography variant="h1" style={{ color: textColor }}>
          Profile Screen
        </Typography>
        <Typography variant="body" style={{ color: textColor, textAlign: 'center', marginBottom: SPACING.xl }}>
          Demonstrating all custom components
        </Typography>

        {/* User Info Card */}
        <Card
          title="User Information"
          description={`Email: ${user?.email || 'Not available'}\nUser ID: ${user?.id.slice(0, 8)}...`}
          onPress={handleEditProfile}
          buttonText="Edit Profile"
          variant="primary"
        />

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Typography variant="h2" style={{ color: textColor, marginBottom: SPACING.md }}>
            Statistics
          </Typography>
          
          <Card
            title="Projects"
            description="Total projects: 12 | Active: 5"
            onPress={() => Alert.alert('Projects', 'View all projects')}
            buttonText="View All"
            variant="secondary"
          />
          
          <Card
            title="Activity"
            description={`Last active: ${formatDate(new Date())}`}
            onPress={() => Alert.alert('Activity', 'View activity details')}
            buttonText="Details"
            variant="outline"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Typography variant="h2" style={{ color: textColor, marginBottom: SPACING.md }}>
            Quick Actions
          </Typography>
          
          <Button
            title="Settings"
            onPress={handleSettings}
            variant="secondary"
            style={{ marginBottom: SPACING.sm }}
          />
          
          <Button
            title="Help & Support"
            onPress={() => Alert.alert('Help', 'Opening Help Center...')}
            variant="outline"
            style={{ marginBottom: SPACING.sm }}
          />
          
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="ghost"
          />
        </View>

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
  content: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  statsContainer: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  actionsContainer: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  infoContainer: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: '#C6C6C8',
    width: '100%',
    alignItems: 'center',
  },
});
