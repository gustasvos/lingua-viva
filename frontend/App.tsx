import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { SettingsProvider, useSettings } from './src/contexts/SettingsContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/screens/onboarding/SplashScreen';
import { ThemeProvider, useTheme } from './src/theme';

/** Mantém a splash enquanto sessão e preferências são lidas do dispositivo. */
function Bootstrap() {
  const { initializing } = useAuth();
  const { ready } = useSettings();
  const [minimumElapsed, setMinimumElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinimumElapsed(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (initializing || !ready || !minimumElapsed) return <SplashScreen />;
  return <RootNavigator />;
}

function ThemedApp() {
  const { themeMode, autoNightMode } = useSettings();
  return (
    <ThemeProvider mode={themeMode} autoNight={autoNightMode}>
      <StatusBarSync />
      <Bootstrap />
    </ThemeProvider>
  );
}

function StatusBarSync() {
  const theme = useTheme();
  return <StatusBar style={theme.dark ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <AuthProvider>
          <ThemedApp />
        </AuthProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
