import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { ThemeProvider, useAppTheme } from '../contexts/ThemeContext';
import { useDepositsHydration } from './store/useDeposits';

function RootLayoutContent() {
  const { isDark, theme } = useAppTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerTintColor: theme.colors.onSurface,
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Cofre dos 10 mil',
              headerShown: true 
            }} 
          />
          <Stack.Screen 
            name="challenge" 
            options={{ 
              title: 'Tabuleiro',
              headerShown: true 
            }} 
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  useDepositsHydration();

  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
