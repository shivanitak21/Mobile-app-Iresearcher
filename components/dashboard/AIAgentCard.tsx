import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { AIAgent } from '@/types';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardGap = 16;
const horizontalPadding = 24;
const cardWidth = (width - (horizontalPadding * 2) - cardGap) / 2;

// Icon configuration type
interface IconConfig {
  library: 'Feather' | 'MaterialCommunityIcons' | 'Ionicons';
  name: string;
  size?: number;
}

// Map agent type to icons with custom sizes
const agentIconMap: Record<string, IconConfig> = {
  research: { library: 'Feather', name: 'search', size: 32 },
  medical: { library: 'MaterialCommunityIcons', name: 'medical-bag', size: 32 },
  finance: { library: 'MaterialCommunityIcons', name: 'chart-line', size: 32 },
  'deep-research': { library: 'MaterialCommunityIcons', name: 'brain', size: 32 },
  business: { library: 'MaterialCommunityIcons', name: 'briefcase-outline', size: 32 },
  'data-analyst': { library: 'Feather', name: 'bar-chart-2', size: 32 },
};

// Icon renderer component
const IconRenderer = ({ iconConfig, color }: { iconConfig: IconConfig; color: string }) => {
  const { library, name, size = 32 } = iconConfig;
  
  const iconProps = {
    name: name as any,
    size,
    color,
  };

  switch (library) {
    case 'Feather':
      return <Feather {...iconProps} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons {...iconProps} />;
    case 'Ionicons':
      return <Ionicons {...iconProps} />;
    default:
      return <Feather name="search" size={size} color={color} />;
  }
};

interface AIAgentCardProps {
  agent: AIAgent;
  onPress: () => void;
}

export function AIAgentCard({ agent, onPress }: AIAgentCardProps) {
  const { state } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isLight = state.theme === 'light';
  const iconConfig = agentIconMap[agent.type] || agentIconMap['research'];
  
  // Better color scheme
  const iconColor = isLight ? '#3B82F6' : '#60A5FA';
  const textColor = isLight ? '#1F2937' : '#F9FAFB';
  const cardBg = isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(17, 24, 39, 0.8)';
  const borderColor = isLight ? 'rgba(229, 231, 235, 0.8)' : 'rgba(75, 85, 99, 0.6)';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContainer: {
      transform: [{ scale: scaleAnim }],
    },
    card: {
      width: 120,
      height: 120,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: cardBg,
      borderWidth: Platform.OS === 'android' ? 0 : 1,
      borderColor: borderColor,
      ...Platform.select({
        ios: {
          shadowColor: isLight ? '#3B82F6' : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isLight ? 0.1 : 0.3,
          shadowRadius: 8,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    blur: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 24,
    },
    iconContainer: {
      marginBottom: 8,
      padding: 8,
      borderRadius: 16,
      backgroundColor: isLight ? 'rgba(59, 130, 246, 0.1)' : 'rgba(96, 165, 250, 0.2)',
    },
    name: {
      color: textColor,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 14,
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      lineHeight: 18,
      paddingHorizontal: 8,
    },
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress} 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={styles.cardContainer}>
        <View style={styles.card}>
          {/* Blur effect for iOS only to avoid white square on Android */}
          {Platform.OS === 'ios' && (
            <BlurView 
              intensity={isLight ? 20 : 40} 
              tint={isLight ? 'light' : 'dark'} 
              style={styles.blur} 
            />
          )}
          
          <View style={styles.iconContainer}>
            <IconRenderer iconConfig={iconConfig} color={iconColor} />
          </View>
          
          <Text style={styles.name} numberOfLines={2}>
            {agent.name}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}