import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, StatusBar, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage, AgentType } from '@/types';
import { LoadingBubble } from '@/components/chat/LoadingBubble';

const agentTypes: { value: AgentType; label: string; color: string }[] = [
  { value: 'research', label: 'iResearcher', color: '#3B82F6' },
  { value: 'medical', label: 'Medical AI', color: '#10B981' },
  { value: 'finance', label: 'Finance Pro', color: '#F59E0B' },
  { value: 'deep-research', label: 'Deep Research', color: '#8B5CF6' },
  { value: 'business', label: 'Business Advisor', color: '#EF4444' },
];

export default function ChatScreen() {
  const { state, sendMessage, clearChat } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('research');
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  useEffect(() => {
    if (state.chat.messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [state.chat.messages]);

  const handleSendMessage = (message: string) => {
    sendMessage(message, selectedAgent);
  };

  const selectedAgentData = agentTypes.find(agent => agent.value === selectedAgent);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + theme.spacing.md : theme.spacing.xl,
      paddingBottom: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    backButton: {
      marginRight: theme.spacing.md,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
    },
    agentSelector: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing.md,
    },
    agentText: {
      ...theme.typography.h3,
      color: theme.colors.text,
      marginRight: theme.spacing.sm,
    },
    chatContainer: {
      flex: 1,
    },
    messagesList: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexGrow: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    emptyTitle: {
      ...theme.typography.h2,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    emptySubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-start',
      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 120 : 140,
    },
    dropdown: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastDropdownItem: {
      borderBottomWidth: 0,
    },
    agentIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
    },
    agentIconText: {
      fontSize: 18,
      color: '#FFFFFF',
    },
    agentInfo: {
      flex: 1,
    },
    agentName: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontFamily: 'Inter-SemiBold',
    },
    agentType: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
  });

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>What can I help with?</Text>
      <Text style={styles.emptySubtitle}>
        Ask me anything about research, analysis, or any topic you'd like to explore.
      </Text>
    </View>
  );

  const renderAgentDropdown = () => (
    <Modal
      visible={showAgentDropdown}
      transparent
      animationType="fade"
      onRequestClose={() => setShowAgentDropdown(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowAgentDropdown(false)}
      >
        <View style={styles.dropdown}>
          {agentTypes.map((agent, index) => (
            <TouchableOpacity
              key={agent.value}
              style={[
                styles.dropdownItem,
                index === agentTypes.length - 1 && styles.lastDropdownItem
              ]}
              onPress={() => {
                setSelectedAgent(agent.value);
                setShowAgentDropdown(false);
              }}
            >
              <View style={[styles.agentIcon, { backgroundColor: agent.color }]}>
                <Text style={styles.agentIconText}>
                  {agent.label.charAt(0)}
                </Text>
              </View>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agent.label}</Text>
                <Text style={styles.agentType}>{agent.value.replace('-', ' ')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.agentSelector}
          onPress={() => setShowAgentDropdown(true)}
        >
          <Text style={styles.agentText}>
            {selectedAgentData?.label || 'Select Agent'}
          </Text>
          <ChevronDown size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={state.chat.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={state.chat.isLoading ? (
            <LoadingBubble />
          ) : null}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        <ChatInput
          onSendMessage={handleSendMessage}
          onClearChat={clearChat}
        />
      </View>

      {renderAgentDropdown()}
    </SafeAreaView>
  );
}