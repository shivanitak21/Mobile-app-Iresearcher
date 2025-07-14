import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { Copy, Download, Pencil as Edit3, Check, X } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Markdown from 'react-native-markdown-display';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { ChatMessage } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { VisualizationRenderer } from './VisualizationRenderer';
import { cleanMarkdownText } from '@/utils/visualizationParser';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { state, editMessage } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  
  const copyToClipboard = () => {
    Clipboard.setString(message.text);
    Alert.alert('Copied', 'Message copied to clipboard');
  };

  const downloadPDF = async () => {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>AI Chat Response - ${new Date().toLocaleDateString()}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              padding: 30px; 
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              background: #fff;
            }
            .header {
              border-bottom: 3px solid #6B46C1;
              padding-bottom: 20px;
              margin-bottom: 30px;
              text-align: center;
            }
            .logo {
              color: #6B46C1;
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .message { 
              background: #f8f9fa; 
              padding: 30px; 
              border-radius: 12px; 
              margin: 20px 0;
              border-left: 5px solid #6B46C1;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .timestamp { 
              color: #666; 
              font-size: 14px; 
              margin-top: 25px; 
              text-align: right;
              border-top: 1px solid #eee;
              padding-top: 15px;
            }
            h1, h2, h3, h4, h5, h6 { 
              color: #6B46C1; 
              margin-top: 30px;
              margin-bottom: 15px;
              font-weight: 600;
            }
            h1 { font-size: 32px; border-bottom: 2px solid #6B46C1; padding-bottom: 10px; }
            h2 { font-size: 26px; }
            h3 { font-size: 22px; }
            h4 { font-size: 18px; }
            p { margin-bottom: 16px; }
            ul, ol { margin-bottom: 16px; padding-left: 24px; }
            li { margin-bottom: 8px; }
            code { 
              background: #e9ecef; 
              padding: 4px 8px; 
              border-radius: 4px; 
              font-family: 'Courier New', monospace;
              font-size: 14px;
              color: #d63384;
            }
            pre {
              background: #f1f3f4;
              padding: 20px;
              border-radius: 8px;
              overflow-x: auto;
              border-left: 4px solid #6B46C1;
              margin: 20px 0;
            }
            pre code {
              background: none;
              padding: 0;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 25px 0;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 15px;
              text-align: left;
            }
            th {
              background-color: #6B46C1;
              color: white;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f0f0f0;
            }
            a {
              color: #6B46C1;
              text-decoration: none;
              font-weight: 500;
            }
            a:hover {
              text-decoration: underline;
            }
            blockquote {
              border-left: 4px solid #6B46C1;
              margin: 20px 0;
              padding: 15px 20px;
              background: #f8f9fa;
              font-style: italic;
            }
            .footer {
              margin-top: 50px;
              padding-top: 25px;
              border-top: 2px solid #eee;
              text-align: center;
              color: #666;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
              .header { page-break-after: avoid; }
              .message { box-shadow: none; border: 1px solid #ddd; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🤖 AI Assistant</div>
            <h1>Chat Response Export</h1>
            <p>Generated by Elevatics AI Platform</p>
          </div>
          <div class="message">
            ${formatMessageForPDF(message.text)}
            <div class="timestamp">
              <strong>Generated:</strong> ${message.timestamp.toLocaleString()}<br>
              <strong>Agent:</strong> AI Research Assistant
            </div>
          </div>
          <div class="footer">
            <p>This document was automatically generated from an AI conversation.</p>
            <p>© ${new Date().getFullYear()} Elevatics AI Platform</p>
          </div>
        </body>
        </html>
      `;
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fileUri = FileSystem.documentDirectory + `AI_Response_${timestamp}.html`;
      await FileSystem.writeAsStringAsync(fileUri, htmlContent);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/html',
          dialogTitle: 'Export AI Response',
          UTI: 'public.html',
        });
      } else {
        Alert.alert('Success', 'Response exported successfully');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export response');
    }
  };

  const formatMessageForPDF = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  };

  const handleEdit = () => {
    if (isEditing) {
      editMessage(message.id, editText);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    setEditText(message.text);
    setIsEditing(false);
  };

  const handleLinkPress = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
    return true;
  };

  const markdownStyles = {
    body: {
      color: message.isUser ? '#FFFFFF' : theme.colors.text,
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Inter-Regular',
    },
    heading1: {
      color: message.isUser ? '#FFFFFF' : theme.colors.primary,
      fontSize: 24,
      fontWeight: '700',
      fontFamily: 'Inter-Bold',
      marginBottom: 12,
      marginTop: 20,
    },
    heading2: {
      color: message.isUser ? '#FFFFFF' : theme.colors.primary,
      fontSize: 20,
      fontWeight: '600',
      fontFamily: 'Inter-SemiBold',
      marginBottom: 10,
      marginTop: 16,
    },
    heading3: {
      color: message.isUser ? '#FFFFFF' : theme.colors.primary,
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'Inter-SemiBold',
      marginBottom: 8,
      marginTop: 14,
    },
    heading4: {
      color: message.isUser ? '#FFFFFF' : theme.colors.text,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Inter-SemiBold',
      marginBottom: 6,
      marginTop: 12,
    },
    paragraph: {
      marginBottom: 12,
      lineHeight: 24,
    },
    list_item: {
      marginBottom: 6,
      lineHeight: 22,
    },
    bullet_list: {
      marginBottom: 12,
    },
    ordered_list: {
      marginBottom: 12,
    },
    code_inline: {
      backgroundColor: message.isUser ? 'rgba(255,255,255,0.2)' : theme.colors.surface,
      color: message.isUser ? '#FFFFFF' : theme.colors.primary,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 4,
      fontSize: 14,
      fontFamily: 'Courier New',
    },
    code_block: {
      backgroundColor: message.isUser ? 'rgba(255,255,255,0.1)' : theme.colors.surface,
      padding: 16,
      borderRadius: 8,
      marginVertical: 12,
      borderLeftWidth: 4,
      borderLeftColor: message.isUser ? 'rgba(255,255,255,0.3)' : theme.colors.primary,
    },
    fence: {
      backgroundColor: message.isUser ? 'rgba(255,255,255,0.1)' : theme.colors.surface,
      padding: 16,
      borderRadius: 8,
      marginVertical: 12,
      borderLeftWidth: 4,
      borderLeftColor: message.isUser ? 'rgba(255,255,255,0.3)' : theme.colors.primary,
    },
    blockquote: {
      backgroundColor: message.isUser ? 'rgba(255,255,255,0.1)' : theme.colors.surface,
      borderLeftWidth: 4,
      borderLeftColor: message.isUser ? 'rgba(255,255,255,0.3)' : theme.colors.primary,
      paddingLeft: 16,
      paddingVertical: 12,
      marginVertical: 12,
      fontStyle: 'italic',
    },
    table: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      marginVertical: 12,
    },
    thead: {
      backgroundColor: message.isUser ? 'rgba(255,255,255,0.1)' : theme.colors.primary,
    },
    tbody: {
      backgroundColor: message.isUser ? 'rgba(255,255,255,0.05)' : theme.colors.surface,
    },
    th: {
      padding: 12,
      fontWeight: '600',
      color: message.isUser ? '#FFFFFF' : '#FFFFFF',
      fontSize: 14,
      textAlign: 'left',
    },
    td: {
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      fontSize: 14,
      color: message.isUser ? '#FFFFFF' : theme.colors.text,
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    link: {
      color: theme.colors.primary,
      textDecorationLine: 'underline' as 'underline',
    },
  };

  const styles = StyleSheet.create({
    container: {
      maxWidth: '85%',
      alignSelf: message.isUser ? 'flex-end' : 'flex-start',
      marginVertical: theme.spacing.sm,
    },
    bubble: {
      backgroundColor: message.isUser ? theme.colors.primary : theme.colors.surface, // simple background for bot
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 0, // no border for bot or user
      borderColor: 'transparent',
    },
    timestamp: {
      fontSize: 12,
      color: message.isUser ? 'rgba(255, 255, 255, 0.8)' : theme.colors.textSecondary,
      marginTop: theme.spacing.md,
      textAlign: 'right',
      fontFamily: 'Inter-Regular',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: message.isUser ? 'flex-end' : 'flex-start',
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    actionButton: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    editContainer: {
      marginTop: theme.spacing.sm,
    },
    editActions: {
      flexDirection: 'row',
      marginTop: theme.spacing.md,
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    visualizations: {
      marginTop: theme.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <Input
              value={editText}
              onChangeText={setEditText}
              multiline
              numberOfLines={3}
            />
            <View style={styles.editActions}>
              <Button
                title="Save"
                onPress={handleEdit}
                size="sm"
                variant="primary"
              />
              <Button
                title="Cancel"
                onPress={cancelEdit}
                size="sm"
                variant="outline"
              />
            </View>
          </View>
        ) : (
          <Markdown 
            style={markdownStyles}
            onLinkPress={handleLinkPress}
          >
            {cleanMarkdownText(message.text)}
          </Markdown>
        )}
        {message.visualizations && message.visualizations.length > 0 && (
          <View style={styles.visualizations}>
            {message.visualizations.map((viz, index) => (
              <VisualizationRenderer key={index} visualization={viz} />
            ))}
          </View>
        )}
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString()}
        </Text>
      </View>
      
      {!isEditing && (
        <View style={styles.actions}>
          {message.isUser && (
            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <Edit3 size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
            <Copy size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          {!message.isUser && (
            <TouchableOpacity style={styles.actionButton} onPress={downloadPDF}>
              <Download size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}