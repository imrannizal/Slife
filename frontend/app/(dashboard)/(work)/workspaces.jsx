import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { Avatar, Title, Paragraph, Button, useTheme, Text, FAB, Portal, Divider, Surface, TextInput } from 'react-native-paper';
import ThemedCard from '../../../components/ThemedCard';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

// Mock data for workspaces
const mockWorkspaces = [
  {
    id: '1',
    image: 'https://picsum.photos/seed/workspace1/200',
    title: 'Marketing Team',
    description: 'Campaign planning and creative brainstorming for Q3 launches',
    adminList: ['user1', 'user2'],
    createdAt: new Date('2023-05-15'),
    posts: [
      {
        id: 'post1',
        title: 'Q3 Campaign Ideas',
        content: 'We should focus on influencer marketing this quarter',
        creator: 'user1',
        createdAt: new Date('2023-06-10'),
        updatedAt: new Date('2023-06-12')
      }
    ]
  },
  {
    id: '2',
    image: 'https://picsum.photos/seed/workspace2/200',
    title: 'Engineering',
    description: 'Product development and sprint planning',
    adminList: ['user3', 'user4'],
    createdAt: new Date('2023-04-20'),
    posts: [
      {
        id: 'post1',
        title: 'API Refactor',
        content: 'We need to update our endpoints to use GraphQL',
        creator: 'user3',
        createdAt: new Date('2023-05-01'),
        updatedAt: new Date('2023-05-05')
      }
    ]
  }
];

const Workspaces = () => {
  const { colors } = useTheme();
  const [fabOpen, setFabOpen] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);
  const [visible, setVisible] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to handle workspace click
  const clickWorkspace = (workspaceId) => {
    console.log(`Clicked on workspace: ${workspaceId}`);
    router.push({
      pathname: '/workspace/[id]',
      params: {
        id: workspaceId
      }
    });
    // Navigate to workspace details or perform any action
  };

  // Floating Action Button actions
  const fabActions = [
    {
      icon: 'plus',
      label: 'Add Workspace',
      onPress: () => console.log('Add workspace'),
      color: colors.primary,
      style: { backgroundColor: colors.surface }
    },
    {
      icon: 'account-multiple-plus',
      label: 'Join Workspace',
      onPress: () =>  setVisible(true),
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
        <Title style={styles.heading}>Workspace List</Title>
      </View>

      <Divider style={{ marginVertical: 10 }} />

      {mockWorkspaces.map((workspace) => (
        <ThemedCard 
          key={workspace.id} 
          onPress={() => clickWorkspace(workspace.id)}
          style={styles.workspaceCard}
        >
          <View style={styles.cardContent}>
            <Avatar.Image 
              source={{ uri: workspace.image }} 
              size={60}
              style={styles.workspaceImage}
            />
            <View style={styles.textContainer}>
              <Title style={styles.workspaceTitle}>{workspace.title}</Title>
              <Paragraph style={styles.workspaceDescription}>
                {workspace.description}
              </Paragraph>
              <View style={styles.metaContainer}>
                <Text style={styles.metaText}>
                  {workspace.posts.length} posts • Created {formatDate(workspace.createdAt)}
                </Text>
                <View style={styles.adminContainer}>
                  <Text style={styles.adminText}>
                    Admins: {workspace.adminList.join(', ')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ThemedCard>
      ))}

      {/* Floating Form */}
      {visible && (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidView}
        >
          <Surface style={[styles.formSurface, { backgroundColor: colors.surface }]}>
            <Text variant="titleMedium" style={styles.title}>
              Join a Workspace
            </Text>
            
            <TextInput
              mode="outlined"
              label="Workspace Token"
              placeholder="Enter invite token"
              value={''}
              style={styles.input}
              autoFocus
            />

            <View style={styles.buttonRow}>
              <Button 
                mode="outlined" 
                onPress={() => setVisible(false)}
                style={styles.button}
              >
                Cancel
              </Button>
              
              <Button 
                mode="contained" 
                onPress={() => {
                  console.log('Joining with token:', token);
                  setVisible(false);
                }}
                style={styles.button}
              >
                Join
              </Button>
            </View>
          </Surface>
        </KeyboardAvoidingView>
      )}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  workspaceCard: {
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  workspaceImage: {
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
    color: '#666',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  adminContainer: {
    marginTop: 4,
  },
  adminText: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
});

export default Workspaces;