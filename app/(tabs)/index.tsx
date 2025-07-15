import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { AIAgent } from '@/types';
import { AIAgentCard } from '@/components/dashboard/AIAgentCard';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const cardGap = 16; // Gap between cards
const horizontalPadding = 24; // Padding from screen edges
const cardWidth = (width - (horizontalPadding * 2) - cardGap) / 2; // Calculate card width with gap

const mockAgents: AIAgent[] = [
  {
    id: '1',
    name: 'iResearcher',
    type: 'research',
    description: '',
    icon: '🔬',
    color: '',
  },
  {
    id: '2',
    name: 'Medical AI',
    type: 'medical',
    description: '',
    icon: '🏥',
    color: '',
  },
  {
    id: '3',
    name: 'Finance Pro',
    type: 'finance',
    description: '',
    icon: '💰',
    color: '',
  },
  {
    id: '4',
    name: 'Deep Research',
    type: 'deep-research',
    description: '',
    icon: '🧠',
    color: '',
  },
  {
    id: '5',
    name: 'Business',
    type: 'business',
    description: '',
    icon: '📊',
    color: '',
  },
  {
    id: '6',
    name: 'Data Analyst',
    type: 'data-analyst',
    description: '',
    icon: '📈',
    color: '',
  },
];

export default function HomeScreen() {
  const { state, setCurrentAgent } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;
  const router = useRouter();

  const handleAgentPress = (agent: AIAgent) => {
    setCurrentAgent(agent);
    router.push('/chat');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: horizontalPadding,
      paddingTop: theme.spacing.xl * 2,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
      fontFamily: 'Roboto',
    },
    grid: {
      paddingHorizontal: horizontalPadding,
      paddingBottom: theme.spacing.xl,
      // Removed alignItems and justifyContent to fix grid
    },
    item: {
      width: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Agents</Text>
        {/* Removed description/subtitle for minimal look */}
      </View>
      {/* Theme-consistent background behind cards */}
      <View style={{ flex: 1, width: '100%', backgroundColor: theme.colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 8 }}>
        <FlatList
          data={mockAgents}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <AIAgentCard agent={item} onPress={() => handleAgentPress(item)} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  );
}