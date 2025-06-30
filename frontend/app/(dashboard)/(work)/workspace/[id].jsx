import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, useTheme, FAB, Portal, IconButton, Dialog, Menu } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import useWorkspaceStore from '../../../../store/workspaceStore';
import useAuthStore from '../../../../store/authStore';
import { useLocalSearchParams, useRouter } from 'expo-router';

const formatDate = (date) => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const WorkspacePosts = () => {
  const { colors } = useTheme();
  const [workspace, setWorkspace] = useState(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const [fabOpen, setFabOpen] = useState(false);
  const [fabVisible, setFabVisible] = useState(true);
  const [generateTokenVis, setGenerateTokenVis] = useState(false);
  const [token, setToken] = useState(null);
  const [dotsVisible, setDotsVisible] = useState(false);
  const { posts, startPostsListener, stopPostsListener, 
    leaveWorkspace, deleteWorkspace, generateJoinToken
   } = useWorkspaceStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (params.workspace) {
      const parsedWorkspace = JSON.parse(params.workspace);
      setWorkspace({
        ...parsedWorkspace
      });
      
    } else {
      router.back();
    }
  }, [params.workspace]);

  useEffect(() => {
    // another useEffect so that timing is handled
    if (workspace) {
      startPostsListener(workspace.id);
    }

    return () => {
      stopPostsListener();
    };
  }, [workspace]);

  // Display FAB when screen is not focused and posts = [] when not focused
  useFocusEffect(
  React.useCallback(() => {
    setFabVisible(true);
    
    return () => {
      setFabVisible(false);
    };
  }, [])
);

  // Sort posts by date (newest first)
  const sortedPosts = [...(posts || [])].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // add post (fab)
  const addPost = () => {
    // Generate a temporary ID (will be replaced with real Firestore ID later)
    const tempId = `temp-${Date.now()}`;

    const post = {
      id: tempId,
      content: "Edit your post here!",
      title: "Post Title",
      owner: user.username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    router.push({
      pathname: "/editPosts/[id]",
      params: {
        id: post.id,
        workspaceID: workspace.id,
        post: JSON.stringify(post), // Must stringify objects for params
        isNew: "true"
      }
    });
  }

  const editPost = (post) => {

    console.log("workspace ID : ", workspace.id);

    if (post.owner === user.username) {
      router.push({
        pathname: "/editPosts/[id]",
        params: {
          id: post.id,
          workspaceID: workspace.id,
          post: JSON.stringify(post), // Must stringify objects for params
          isNew: "false"
        }
      });
    }
  }

  // leave workspace (fab)
  const leaveWorkspaceAlert = () => {
    const user = useAuthStore.getState().user

    Alert.alert(
      "Leave Workspace",
      "Are you sure you want to leave the workspace?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            leaveWorkspace(user.uid, workspace.id);
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  }

  // delete workspace
  const deleteWorkspaceAlert = () => {
    Alert.alert(
      "Delete Workspace",
      "Are you sure you want to delete the workspace?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteWorkspace(workspace.id);
            router.back();
          },
        },
      ],
      { cancelable: true }
    );
  }

  // generate token (if you are admin)
  const generateToken = async () => {
    try {
      const genToken = await generateJoinToken(workspace.id);

      setToken(genToken.token);
      setGenerateTokenVis(true);
    } catch (err) {
      console.log("Error generating token (workspace) :", err)
      throw err
    }
  };

  // edit workspace (fab, if you are admin)
  const editWorkspace = () => {
    router.push({
      pathname: "/editWorkspace/[id]",
      params: {
        id: workspace.id,
        workspace: JSON.stringify(workspace), // Must stringify objects for params
        isNew: "false"
      }
    });
  }

  // Floating Action Button actions
  const fabActions = [
    {
      icon: 'plus-box',
      label: 'Add Post',
      onPress: () => addPost(),
      color: colors.primary,
      style: { backgroundColor: colors.surface },
      show: true
    },
    {
      icon: 'key-chain',
      label: 'Generate Token',
      onPress: () => generateToken(),
      color: colors.primary,
      style: { backgroundColor: colors.surface },
      show: (JSON.parse(params.workspace).role !== "member") 
    },
    {
      icon: 'pencil-box',
      label: 'Edit Workspace',
      onPress: () => editWorkspace(),
      color: colors.primary,
      style: { backgroundColor: colors.surface },
      show: (JSON.parse(params.workspace).role !== "member")
    },
  ].filter(action => action.show);


  if (!workspace || !posts) return <Text>Loading...</Text>;

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      {/* Workspace Title and settings */}
      <View style={[styles.titleContainer, { marginHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' }]}>
        <Text
          variant="headlineMedium"
          style={[
            styles.workspaceTitle,
            {
              color: colors.onSurface,
              marginTop: 16,
              marginBottom: 8,
            }
          ]}
        >
          {workspace.name}
        </Text>
        <Menu
          visible={dotsVisible}
          onDismiss={() => setDotsVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              iconColor={colors.onSurface}
              size={24}
              onPress={() => { setDotsVisible(true) }}
              style={[styles.settingsButton, { marginTop: 16 }]}
            />
          }
        >
          {workspace.owner !== user.username && 
          (<Menu.Item
            onPress={() => {
              leaveWorkspaceAlert();
              setDotsVisible(false);
            }}
            title="Leave"
            titleStyle={{ color: 'red' }} // For destructive actions
          />)}

          {workspace.owner === user.username && (<Menu.Item
            onPress={() => {
              deleteWorkspaceAlert();
              setDotsVisible(false);
            }}
            title="Delete"
            titleStyle={{ color: 'red' }} // For destructive actions
          />)}
        </Menu>
      </View>

      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <View
            style={[
              styles.postContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.outline,
                shadowColor: colors.onSurface
              }
            ]}
            key={post.id}
          >
            <View style={styles.postHeader}>
              <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
                {formatDate(post.created_at)}
              </Text>
              {/* {post.created_at !== post.updated_at && (
                <Text variant="labelSmall" style={[styles.updatedText, { color: colors.primary }]}>
                  (edited)
                </Text>
              )} */}
            </View>

            <Text selectable={true} variant="headlineSmall" style={[styles.postTitle, { color: colors.onSurface }]}>
              {post.title}
            </Text>

            <Text selectable={true} variant="bodyMedium" style={{
              color: colors.onSurface,
              marginBottom: 8
            }}>
              {post.content}
            </Text>

            <View style={styles.postHeader}>
              <Text variant="labelSmall" style={[styles.creatorText, { color: colors.outline }]}>
                Posted by @{post.owner}
              </Text>

              {post.owner === user.username && (<IconButton
                icon="pencil" 
                size={20} 
                onPress={(e) => {
                  e.stopPropagation();
                  editPost(post);
                }}
              />)}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={{
            textAlign: 'center',
            marginTop: 20,
            color: colors.onSurfaceVariant,
            fontSize: 16
          }}>
            No posts yet in this workspace
          </Text>
        </View>
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

      <Portal>
        <Dialog visible={generateTokenVis} onDismiss={() => setGenerateTokenVis(false)}>
          <Dialog.Title>Generated Token</Dialog.Title>
          <Dialog.Content>
            <Text selectable={true}>
              Token has been generated: {token}
            </Text>
          </Dialog.Content>
        </Dialog>
      </Portal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  postTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  creatorText: {
    marginTop: 12,
    fontStyle: 'italic',
  },
  updatedText: {
    fontStyle: 'italic',
    marginBottom: 8
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  workspaceCard: {
    margin: 16,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden', // Important for ripple effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
});

export default WorkspacePosts;