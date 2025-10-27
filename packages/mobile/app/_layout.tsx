import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import { TodoProvider } from '../src/contexts/TodoContext';
import { DreamProvider } from '../src/contexts/DreamContext';
import { PomodoroProvider } from '../src/contexts/PomodoroContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TodoProvider>
          <DreamProvider>
            <PomodoroProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </PomodoroProvider>
          </DreamProvider>
        </TodoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
