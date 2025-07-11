import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Send, Paperclip, Mic, RotateCcw } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, onClearChat, disabled }: ChatInputProps) {
  const { state } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled) {
        Alert.alert('File Selected', `Selected: ${result.assets[0].name}`);
        // TODO: Implement file upload to your API
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const handleVoiceInput = () => {
    Alert.alert('Voice Input', 'Voice recording will be implemented with expo-av');
    // TODO: Implement voice recording with expo-av
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      paddingBottom: Platform.OS === 'ios' ? theme.spacing.xl : theme.spacing.md,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
      minHeight: 50,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    reloadButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      marginRight: theme.spacing.xs,
    },
    input: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      maxHeight: 100,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.sm,
    },
    iconButton: {
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      marginLeft: theme.spacing.xs,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.full,
      padding: theme.spacing.md,
      marginLeft: theme.spacing.sm,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.reloadButton} onPress={onClearChat}>
          <RotateCcw size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Ask anything..."
          placeholderTextColor={theme.colors.textSecondary}
          value={message}
          onChangeText={setMessage}
          multiline
          editable={!disabled}
          onKeyPress={handleKeyPress}
        />
        
        <TouchableOpacity style={styles.iconButton} onPress={handleAttachFile}>
          <Paperclip size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton} onPress={handleVoiceInput}>
          <Mic size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!message.trim() || disabled}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}