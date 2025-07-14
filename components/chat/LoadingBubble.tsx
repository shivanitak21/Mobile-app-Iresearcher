import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';

export function LoadingBubble() {
  const { state } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;
  const styles = StyleSheet.create({
    container: {
      maxWidth: '85%',
      alignSelf: 'flex-start',
      marginVertical: theme.spacing.sm,
    },
    bubble: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    </View>
  );
} 