import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { AIAgent } from '@/types';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardGap = 16;
const horizontalPadding = 24;
const cardWidth = (width - (horizontalPadding * 2) - cardGap) / 2;

// Map agent type to Flaticon PNGs
const agentImageMap: Record<string, any> = {
  research: require('@/assets/images/search.png'),
  medical: require('@/assets/images/hospital.png'),
  finance: require('@/assets/images/finance.png'),
  'deep-research': require('@/assets/images/brain.png'),
  business: require('@/assets/images/business.png'),
  'data-analyst': require('@/assets/images/chart.png'),
};

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

  const isLight = state.theme === 'light';
  const cardBg = isLight ? 'rgba(255,255,255,0.18)' : 'rgba(36,54,90,0.38)';
  const borderCol = isLight ? 'rgba(255,255,255,0.22)' : 'rgba(59,130,246,0.18)';
  const iconColor = '#fff';
  const iconShadow = isLight ? {} : { textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 };
  const textColor = isLight ? '#222e3a' : 'rgba(255,255,255,0.92)';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconGlass: {
      width: 72,
      height: 72,
      borderRadius: 20,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      borderWidth: 1,
      borderColor: borderCol,
      backgroundColor: cardBg,
      position: 'relative',
      shadowColor: isLight ? '#3B82F6' : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isLight ? 0.10 : 0.22,
      shadowRadius: 12,
      elevation: 6,
    },
    blur: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 20,
    },
    icon: {
      fontSize: 32,
      color: iconColor,
      textAlign: 'center',
      zIndex: 1,
      ...iconShadow,
    },
    name: {
      ...theme.typography.h3,
      color: textColor,
      textAlign: 'center',
      fontWeight: '500',
      fontSize: 14,
      marginTop: 0,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconGlass}>
        <BlurView intensity={70} tint={isLight ? 'light' : 'dark'} style={styles.blur} />
        <Image
          source={agentImageMap[agent.type] || agentImageMap['research']}
          style={{ width: 36, height: 36, resizeMode: 'contain', zIndex: 1 }}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {agent.name}
      </Text>
    </TouchableOpacity>
  );
}