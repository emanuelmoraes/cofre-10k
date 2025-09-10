import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

// Material Design 3 theme customization
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1a2236',
    primaryContainer: '#e6eaf3',
    secondary: '#4CAF50',
    secondaryContainer: '#c8e6c9',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    background: '#fafafa',
    onBackground: '#1a2236',
    onSurface: '#1a2236',
    onSurfaceVariant: '#6c7a93',
    onPrimary: '#ffffff',
    outline: '#ececf0',
    error: '#c62828',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#b5b9c9',
    primaryContainer: '#2a3441',
    secondary: '#81c784',
    secondaryContainer: '#2e7d32',
    surface: '#1e1e1e',
    surfaceVariant: '#2a2a2a',
    background: '#121212',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    onSurfaceVariant: '#a0a0a0',
    onPrimary: '#1a2236',
    outline: '#3a3a3a',
    error: '#ef5350',
  },
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  theme: typeof lightTheme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    console.log('toggleTheme called, current isDark:', isDark);
    const newTheme = !isDark;
    console.log('switching to:', newTheme ? 'dark' : 'light');
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      console.log('Theme saved successfully');
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
