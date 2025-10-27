/**
 * App Constants
 * Centralized configuration values
 */

export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: {
    light: '#F2F2F7',
    dark: '#1C1C1E',
  },
  text: {
    light: '#FFFFFF',
    dark: '#000000',
  },
  textSecondary: '#666666',
  border: '#C6C6C8',
  white: '#FFFFFF',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  timeout: 30000,
} as const;
