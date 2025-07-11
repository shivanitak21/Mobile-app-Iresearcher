import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { AIAgent } from '@/types';

interface AIAgentCardProps {
  agent: AIAgent;
  onPress: () => void;
}

export function AIAgentCard({ agent, onPress }: AIAgentCardProps) {
  const { state } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

 const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: false, // Changed to false
      }),
      Animated.timing(shadowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: false, // Changed to false
      }),
      Animated.timing(shadowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const animatedShadowOpacity = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.25],
  });

  const animatedElevation = shadowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 12],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    card: {
      height: 180,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      justifyContent: 'space-between',
    },
    iconContainer: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.full,
      backgroundColor: agent.color || theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
      shadowColor: agent.color || theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    icon: {
      fontSize: 28,
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
    },
    name: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    description: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      lineHeight: 18,
      flex: 1,
    },
    footer: {
      marginTop: theme.spacing.md,
    },
    type: {
      fontSize: 12,
      color: theme.colors.primary,
      fontFamily: 'Inter-SemiBold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={{ 
          transform: [{ scale: scaleAnim }],
          shadowOpacity: animatedShadowOpacity,
          elevation: animatedElevation,
        }}
      >
        <TouchableOpacity 
          onPress={onPress} 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          style={[
            styles.card,
            {
              shadowColor: theme.colors.shadow,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowRadius: 8,
            }
          ]}
        >
          <View>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{agent.icon}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.name}>{agent.name}</Text>
              <Text style={styles.description} numberOfLines={3}>
                {agent.description}
              </Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Text style={styles.type}>{agent.type.replace('-', ' ')}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}