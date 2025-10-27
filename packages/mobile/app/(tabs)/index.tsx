import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Button } from '../../src/components/atoms/Button';
import { Typography } from '../../src/components/atoms/Typography';
import { Card } from '../../src/components/molecules/Card';
import { useCounter } from '../../src/hooks/useCounter';
import { useTheme } from '../../src/contexts/ThemeContext';
import { SPACING, COLORS } from '../../src/constants';

export default function HomeScreen() {
  const { count, increment, decrement, reset } = useCounter(0);
  const { theme } = useTheme();
  
  const backgroundColor = theme === 'light' ? COLORS.background.light : COLORS.background.dark;
  const textColor = theme === 'light' ? COLORS.text.dark : COLORS.text.light;

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Typography variant="h1" style={{ color: textColor }}>
            Welcome Back! 👋
          </Typography>
        </View>

        <Typography variant="body" style={{ color: textColor, textAlign: 'center', marginBottom: SPACING.lg }}>
          Built with Expo Router and Custom Components
        </Typography>

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
  content: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.lg,
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
