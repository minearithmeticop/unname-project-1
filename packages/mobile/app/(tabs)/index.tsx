import { StyleSheet, Text, View, Button } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React Native! 🎉</Text>
      <Text style={styles.subtitle}>Built with Expo Router</Text>
      
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Counter: {count}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Increment" onPress={() => setCount(count + 1)} />
          <View style={styles.buttonSpacer} />
          <Button title="Decrement" onPress={() => setCount(count - 1)} />
          <View style={styles.buttonSpacer} />
          <Button title="Reset" onPress={() => setCount(0)} color="#FF3B30" />
        </View>
      </View>

      <Text style={styles.hint}>
        Edit app/(tabs)/index.tsx to get started
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
  },
  counterContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  counterText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSpacer: {
    width: 12,
  },
  hint: {
    marginTop: 32,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
