import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { AIAgent } from '@/types';

const { width } = Dimensions.get('window');
const cardGap = 16;
const horizontalPadding = 24;
const cardWidth = (width - (horizontalPadding * 2) - cardGap) / 2;

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
        useNativeDriver: false,
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
        useNativeDriver: false,
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
      width: cardWidth,
      height: 200, // Fixed height for consistency
    },
    card: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center', // Center all content
      justifyContent: 'space-between',
    },
    iconContainer: {
      width: 60,
      height: 60,
      borderRadius: theme.borderRadius.full,
      backgroundColor: agent.color || theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: agent.color || theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    icon: {
      fontSize: 32,
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      alignItems: 'center', // Center text content
      justifyContent: 'center',
      width: '100%',
    },
    name: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center', // Center text
      fontWeight: '600',
      fontSize: 16,
    },
    description: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      textAlign: 'center', // Center text
      fontSize: 13,
      fontWeight: '400',
      flex: 1,
    },
    footer: {
      marginTop: theme.spacing.sm,
      alignItems: 'center', // Center footer content
    },
    type: {
      fontSize: 11,
      color: theme.colors.primary,
      fontFamily: 'Inter-SemiBold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      textAlign: 'center', // Center text
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View 
        style={{ 
          flex: 1,
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
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{agent.icon}</Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>
              {agent.name}
            </Text>
            {/* <Text style={styles.description} numberOfLines={3}>
              {agent.description}
            </Text> */}
          </View>
          
          {/* <View style={styles.footer}>
            <Text style={styles.type}>{agent.type.replace('-', ' ')}</Text>
          </View> */}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}