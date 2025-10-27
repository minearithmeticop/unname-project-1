import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { TodoProvider } from '../src/contexts/TodoContext';
import { DreamProvider } from '../src/contexts/DreamContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TodoProvider>
          <DreamProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </DreamProvider>
        </TodoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
