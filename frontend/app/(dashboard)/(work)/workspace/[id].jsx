import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import ThemedCard from '../../../../components/ThemedCard';

// Mock posts data (sorted newest first)
const mockPosts = [
  {
    id: 'post3',
    title: 'Updated Marketing Strategy',
    content: 'After review, we should prioritize TikTok over Instagram for Q4',
    creator: 'user2',
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date('2023-07-18')
  },
  {
    id: 'post1',
    title: 'Q3 Campaign Ideas',
    content: 'We should focus on influencer marketing this quarter',
    creator: 'user1',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2023-06-12')
  },
  {
    id: 'post2',
    title: 'Budget Approval',
    content: 'The $50k budget for Q3 campaigns has been approved by finance',
    creator: 'user3',
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2023-06-05')
  }
];

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

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
        {/* Workspace Title */}
        <Text 
        variant="headlineMedium" 
        style={[
            styles.workspaceTitle, 
            { 
                color: colors.onSurface,
                marginTop: 16,
                marginBottom: 8,
                marginHorizontal: 16
            }
        ]}
        >
        Computing Math 2
        </Text>

        {mockPosts.map((post) => (
        <ThemedCard key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
            <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
                {formatDate(post.createdAt)}
            </Text>
            {post.createdAt.getTime() !== post.updatedAt.getTime() && (
                <Text variant="labelSmall" style={[styles.updatedText, { color: colors.primary }]}>
                (edited)
                </Text>
            )}
            </View>
            
            {/* Larger Post Title */}
            <Text variant="headlineSmall" style={[styles.postTitle, { color: colors.onSurface }]}>
            {post.title}
            </Text>
            
            <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
            {post.content}
            </Text>
            
            <Text variant="labelSmall" style={[styles.creatorText, { color: colors.outline }]}>
            Posted by @{post.creator}
            </Text>
        </ThemedCard>
        ))}
    </ScrollView>
    );
};

const styles = StyleSheet.create({
  postCard: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  },
});

export default WorkspacePosts;