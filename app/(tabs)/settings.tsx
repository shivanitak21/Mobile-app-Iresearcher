import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { LogOut, Moon, Sun, User } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/theme';
import { Card } from '@/components/ui/Card';

export default function SettingsScreen() {
  const { state, logout, toggleTheme } = useApp();
  const theme = state.theme === 'light' ? lightTheme : darkTheme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    settingIcon: {
      marginRight: theme.spacing.md,
    },
    settingText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    userInfo: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    userIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    userName: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    userEmail: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.userInfo}>
          <View style={styles.userIcon}>
            <User size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>{state.auth.user?.name}</Text>
          <Text style={styles.userEmail}>{state.auth.user?.email}</Text>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Card>
            <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
              <View style={styles.settingIcon}>
                {state.theme === 'light' ? (
                  <Moon size={20} color={theme.colors.text} />
                ) : (
                  <Sun size={20} color={theme.colors.text} />
                )}
              </View>
              <Text style={styles.settingText}>
                {state.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Switch
                value={state.theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card>
            <TouchableOpacity style={styles.settingItem} onPress={logout}>
              <View style={styles.settingIcon}>
                <LogOut size={20} color={theme.colors.error} />
              </View>
              <Text style={[styles.settingText, { color: theme.colors.error }]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}