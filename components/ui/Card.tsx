import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof lightTheme.spacing;
}

export function Card({ children, style, padding = 'md' }: CardProps) {
  const { state } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing[padding],
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });

  return <View style={[styles.card, style]}>{children}</View>;
}