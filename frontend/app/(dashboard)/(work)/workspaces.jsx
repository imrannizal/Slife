import { View, StyleSheet, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useState } from 'react';
import { useTheme, Text, FAB, Portal, Button, Divider, TextInput as PaperTextInput, Dialog } from 'react-native-paper';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import useWorkspaceStore from '../../../store/workspaceStore';
import useAuthStore from '../../../store/authStore';

const Workspaces = () => {
  const { colors } = useTheme();
  const [fabOpen, setFabOpen] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);
  const [tokenVisible, setTokenVisible] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const { joinWorkspace } = useWorkspaceStore()

  /**
   * has data
   */
  const workspaces = useWorkspaceStore(state => state.workspaces);

  const formatDate = (date) => {
    return date.created_at.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to handle workspace click
  const clickWorkspace = (workspace) => {
    console.log("workspace ", workspace)
    router.push({
      pathname: '/workspace/[id]',
      params: {
        id: workspace.id,
        workspace: JSON.stringify(workspace)
      }
    });
    // Navigate to workspace details or perform any action
  };

  const addNewWorkspace = () => {
    // Generate a temporary ID (will be replaced with real Firestore ID later)
    const tempId = `temp-${Date.now()}`;

    const user = useAuthStore.getState().user;
    
    // Create example workspace data
    const newWorkspace = {
      id: tempId,
      name: "New Workspace",
      description: "Write your description here...",
      owner: user.username,
      image: 'https://picsum.photos/seed/workspace1/200',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Navigate to edit screen with the new todo
    router.push({
      pathname: '/editWorkspace/[id]',
      params: {
        id: tempId,
        workspace: JSON.stringify(newWorkspace),
        isNew: "true" // Add flag to indicate this is a new todo
      }
    });
  };

  const handleTokenSubmit = async () => {
    if (!tokenName.trim()) {
      Alert.alert('Error', 'Please enter a token name');
      return;
    }
    setTokenVisible(false);
    setTokenName('');

    const user = useAuthStore.getState().user
    console.log("getting the group");
    const success = await joinWorkspace(tokenName, user.uid);

    if (success) {
      Alert.alert('Success', `Joined new group.`);
    } else {
      Alert.alert('Failed', `Token may be false or expired.`);
    }
  };

  // Floating Action Button actions
  const fabActions = [
    {
      icon: 'plus',
      label: 'Add Workspace',
      onPress: () => addNewWorkspace(),
      color: colors.primary,
      style: { backgroundColor: colors.surface }
    },
    {
      icon: 'account-multiple-plus',
      label: 'Join Workspace',
      onPress: () => setTokenVisible(true),
      color: colors.primary,
      style: { backgroundColor: colors.surface }
    },
  ];

  useFocusEffect(() => {
    setFabVisible(true);
    return () => setFabVisible(false); // Hide when leaving screen
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: colors.onBackground }]}>
          Your Workspaces
        </Text>
      </View>

      <Divider style={{ marginVertical: 10 }} />

      {workspaces.map((workspace) => (
        <Pressable
          key={workspace.id}
          onPress={() => clickWorkspace(workspace)}
          style={({ pressed }) => [
            styles.workspaceCard,
            {
              backgroundColor: colors.surface,
              opacity: pressed ? 0.8 : 1,
              elevation: pressed ? 1 : 3,
            }
          ]}
          android_ripple={{ color: colors.primary }}
        >
          <View style={styles.cardContent}>
            <Image
              source={{ uri: workspace.image || 'https://picsum.photos/200' }}
              style={styles.workspaceImage}
            />
            <View style={styles.textContainer}>
              <Text style={[styles.workspaceTitle, { color: colors.onSurface }]}>
                {workspace.name}
              </Text>
              <Text
                style={[styles.workspaceDescription, { color: colors.onSurfaceVariant }]}
                numberOfLines={2}
              >
                {workspace.description}
              </Text>
              <View style={styles.metaContainer}>
                <Text style={[styles.metaText, { color: colors.outline }]}>
                  Created {formatDate(workspace)}
                </Text>
                <Text style={[styles.adminText, { color: colors.outline }]}>
                  Owner: {workspace.owner}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      ))}

      {/* Token Popup */}
      <Portal>
        <Dialog visible={tokenVisible} onDismiss={() => setTokenVisible(false)}>
          <Dialog.Title>Enter Join Token</Dialog.Title>
          <Dialog.Content>
            <PaperTextInput
              label="Token Name"
              value={tokenName}
              onChangeText={setTokenName}
              mode="outlined"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setTokenVisible(false)}>Cancel</Button>
            <Button onPress={() => handleTokenSubmit()}>Enter</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <FAB.Group
          open={fabOpen}
          icon={fabOpen ? 'close' : 'plus'}
          actions={fabActions}
          onStateChange={({ open }) => setFabOpen(open)}
          fabStyle={{ backgroundColor: colors.primary, marginBottom: 60 }}
          visible={fabVisible}
        />
      </Portal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  workspaceCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  workspaceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  workspaceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workspaceDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
  },
  adminText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default Workspaces;