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
  const cardBg = isLight ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';
  const borderCol = isLight ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.1)';
  const iconColor = '#fff';
  const iconShadow = isLight ? {} : { textShadowColor: '#000', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 };
  const textColor = isLight ? '#1a202c' : 'rgba(255,255,255,0.95)';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconGlass: {
      width: 160,
      height: 160,
      borderRadius: 44,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
      borderWidth: 1.5,
      borderColor: borderCol,
      backgroundColor: cardBg,
      position: 'relative',
      shadowColor: isLight ? '#3B82F6' : '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isLight ? 0.15 : 0.8,
      shadowRadius: 20,
      elevation: 12,
      // opacity: isLight ? 0.15 : 0.5
    },
    blur: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 44,
    },
    icon: {
      width: 90,
      height: 90,
      resizeMode: 'contain',
      marginBottom: 10,
      zIndex: 1,
    },
    name: {
      color: textColor,
      textAlign: 'center',
      fontWeight: '700',
      fontSize: 18,
      fontFamily: 'Roboto',
      marginTop: 0,
      zIndex: 1,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.iconGlass}>
        {/* <BlurView intensity={isLight ? 300 : 340} tint={isLight ? 'light' : 'dark'} /> */}
        <Image
          source={agentImageMap[agent.type] || agentImageMap['research']}
          style={styles.icon}
        />
        <Text style={styles.name} numberOfLines={2}>
          {agent.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}