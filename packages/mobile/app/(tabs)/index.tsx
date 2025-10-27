import { StyleSheet, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button } from '../../src/components/atoms/Button';
import { Typography } from '../../src/components/atoms/Typography';
import { Card } from '../../src/components/molecules/Card';
import { useCounter } from '../../src/hooks/useCounter';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { AuthScreen } from '../../src/screens/AuthScreen';
import { SPACING, COLORS } from '../../src/constants';

export default function HomeScreen() {
  const { count, increment, decrement, reset } = useCounter(0);
  const { theme, toggleTheme } = useTheme();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const backgroundColor = theme === 'light' ? COLORS.background.light : COLORS.background.dark;
  const textColor = theme === 'light' ? COLORS.text.dark : COLORS.text.light;

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Typography variant="body" style={{ color: textColor, marginTop: SPACING.md }}>
          Loading...
        </Typography>
      </View>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  const handleSignOut = async () => {
    console.log('🔵 handleSignOut called!')
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
              console.log('🔄 Starting sign out process...')
              const { error } = await signOut()
              
              if (error) {
                console.error('Sign out error:', error)
                Alert.alert('Error', `Failed to sign out: ${error.message}`)
              } else {
                console.log('✅ Successfully signed out')
              }
            } catch (error) {
              console.error('Sign out exception:', error)
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
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Typography variant="h1" style={{ color: textColor }}>
            Welcome Back! 👋
          </Typography>
          <Typography variant="body" style={{ color: COLORS.textSecondary, marginTop: SPACING.xs }}>
            {user.email}
          </Typography>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="ghost"
            style={{ marginTop: SPACING.sm }}
          />
        </View>

        <Typography variant="body" style={{ color: textColor, textAlign: 'center', marginBottom: SPACING.lg }}>
          Built with Expo Router and Custom Components
        </Typography>

        {/* Theme Toggle */}
        <Card
          title="Theme Switcher"
          description={`Current theme: ${theme}`}
          onPress={toggleTheme}
          buttonText="Toggle Theme"
          variant="secondary"
        />

        {/* Counter Demo using Custom Hook */}
        <View style={styles.counterContainer}>
          <Typography variant="h2" style={{ color: textColor }}>
            Counter Demo
          </Typography>
          <Typography variant="h3" style={{ color: COLORS.primary, marginVertical: SPACING.md }}>
            Count: {count}
          </Typography>
          
          <View style={styles.buttonContainer}>
            <Button title="Increment" onPress={increment} variant="primary" />
            <View style={styles.buttonSpacer} />
            <Button title="Decrement" onPress={decrement} variant="secondary" />
          </View>
          
          <View style={styles.buttonSpacer} />
          <Button title="Reset Counter" onPress={reset} variant="outline" />
        </View>

        {/* Card Components Demo */}
        <View style={styles.cardsContainer}>
          <Typography variant="h2" style={{ color: textColor, marginBottom: SPACING.md }}>
            Card Components
          </Typography>
          
          <Card
            title="Primary Card"
            description="This is a primary card component using Atomic Design pattern"
            onPress={() => Alert.alert('Primary Card', 'Primary Card Pressed!')}
            buttonText="Action"
            variant="primary"
          />
          
          <Card
            title="Feature Card"
            description="Cards are molecules that combine Typography and Button atoms"
            onPress={() => Alert.alert('Feature Card', 'Feature Card Pressed!')}
            buttonText="Learn More"
            variant="outline"
          />
          
          <Card
            title="Info Card"
            description="All components follow the design patterns documented in ARCHITECTURE.md"
            onPress={() => Alert.alert('Info Card', 'Info Card Pressed!')}
            buttonText="View Docs"
            variant="ghost"
          />
        </View>

        <Typography variant="caption" style={{ color: textColor, textAlign: 'center', marginTop: SPACING.xl }}>
          Using: Custom Hooks, Context API, Atomic Design, and TypeScript
        </Typography>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  counterContainer: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: SPACING.md,
    height: SPACING.md,
  },
  cardsContainer: {
    width: '100%',
    marginTop: SPACING.xl,
  },
});
