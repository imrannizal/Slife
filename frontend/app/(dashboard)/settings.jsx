import { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Switch, List, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import useAuthStore from '../../store/authStore';
import useNoteStore from '../../store/noteStore';
import useTodoStore from '../../store/todoStore';
import useWorkspaceStore from '../../store/workspaceStore';

const SettingsScreen = () => {
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const clearWorkspace = useWorkspaceStore(state => state.logout);
  const clearTodo = useTodoStore(state => state.logout);
  const clearNote = useNoteStore(state => state.logout);
  const logout = useAuthStore(state => state.logout);

  const handleLogout = async () => {

    await logout();
    await clearTodo();
    await clearNote();
    await clearWorkspace();

    router.replace("/login");

  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <List.Section>
          <List.Subheader style={[styles.subheader, { color: colors.primary }]}>
            App Settings
          </List.Subheader>
          
          {/* Notification Settings */}
          <List.Item
            title="Enable Notifications"
            description="Receive app notifications"
            left={() => <List.Icon icon="bell" color={colors.primary} />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                color={colors.primary}
              />
            )}
            style={styles.listItem}
          />
          
          {/* Dark Mode */}
          <List.Item
            title="Dark Mode"
            description="Switch between light and dark theme"
            left={() => <List.Icon icon="theme-light-dark" color={colors.primary} />}
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={() => setDarkModeEnabled(!darkModeEnabled)}
                color={colors.primary}
              />
            )}
            style={styles.listItem}
          />
          
          {/* App Version */}
          <List.Item
            title="App Version"
            description="1.0.0"
            left={() => <List.Icon icon="information" color={colors.primary} />}
            style={styles.listItem}
          />
        </List.Section>
        
        {/* Logout Button */}
        <List.Item
          title="Log Out"
          titleStyle={{ color: colors.error }}
          left={() => <List.Icon icon="logout" color={colors.error} />}
          onPress={() => handleLogout()}
          style={[styles.listItem, styles.logoutItem]}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  listItem: {
    backgroundColor: 'white',
    marginVertical: 4,
    borderRadius: 8,
    paddingVertical: 4,
    elevation: 1,
  },
  logoutItem: {
    marginTop: 24,
  },
});

export default SettingsScreen;