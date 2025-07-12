import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { AIAgent } from '@/types';
import { AIAgentCard } from '@/components/dashboard/AIAgentCard';

const { width, height } = Dimensions.get('window');
const cardGap = 16; // Gap between cards
const horizontalPadding = 24; // Padding from screen edges
const cardWidth = (width - (horizontalPadding * 2) - cardGap) / 2; // Calculate card width with gap

const mockAgents: AIAgent[] = [
  {
    id: '1',
    name: 'iResearcher',
    type: 'research',
    description: 'Advanced research assistant for comprehensive data analysis and insights',
    icon: '🔬',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Medical AI',
    type: 'medical',
    description: 'Medical research and health information specialist',
    icon: '🏥',
    color: '#10B981',
  },
  {
    id: '3',
    name: 'Finance Pro',
    type: 'finance',
    description: 'Financial analysis and investment guidance expert',
    icon: '💰',
    color: '#F59E0B',
  },
  {
    id: '4',
    name: 'Deep Research',
    type: 'deep-research',
    description: 'In-depth research with comprehensive analysis and documentation',
    icon: '🧠',
    color: '#8B5CF6',
  },
  {
    id: '5',
    name: 'Business Advisor',
    type: 'business',
    description: 'Strategic business consultation and market analysis',
    icon: '📊',
    color: '#EF4444',
  },
  {
    id: '6',
    name: 'Data Analyst',
    type: 'research',
    description: 'Statistical analysis and data visualization expert',
    icon: '📈',
    color: '#06B6D4',
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
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.background,
    },
    title: {
      ...theme.typography.h1,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
    grid: {
      paddingHorizontal: horizontalPadding,
      paddingBottom: theme.spacing.xl,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: cardGap, // Use consistent gap
    },
    cardContainer: {
      width: cardWidth,
    },
  });

  const renderRow = ({ item, index }: { item: AIAgent[]; index: number }) => (
    <View style={styles.row}>
      {item.map((agent, agentIndex) => (
        <View key={agent.id} style={styles.cardContainer}>
          <AIAgentCard
            agent={agent}
            onPress={() => handleAgentPress(agent)}
          />
        </View>
      ))}
      {item.length === 1 && <View style={styles.cardContainer} />}
    </View>
  );

  // Group agents into rows of 2
  const agentRows = mockAgents.reduce((rows: AIAgent[][], agent, index) => {
    if (index % 2 === 0) {
      rows.push([agent]);
    } else {
      rows[rows.length - 1].push(agent);
    }
    return rows;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Agents</Text>
        <Text style={styles.subtitle}>
          Choose an AI agent to get started with your research and analysis
        </Text>
      </View>
      
      <FlatList
        data={agentRows}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}