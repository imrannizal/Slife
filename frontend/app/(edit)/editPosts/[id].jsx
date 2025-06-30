import { ScrollView, StyleSheet, Alert } from 'react-native';
import { Appbar, TextInput, useTheme, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import useWorkspaceStore from '../../../store/workspaceStore';

const EditPost = () => {
    const { colors } = useTheme();
    const router = useRouter();
    const params = useLocalSearchParams();
    const [post, setPost] = useState(null);
    const { addPost, updatePost, deletePost, fetchWorkspacePosts } = useWorkspaceStore();

    useEffect(() => {
        console.log("retrieves ", JSON.parse(params.post))
        if (params.post) {
            const parsedPost = JSON.parse(params.post);
            setPost({
                ...parsedPost
            });
        } else {
            router.back();
        }
    }, []);

    const handleDelete = () => {
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deletePost(post.id);
                        router.back();
                    },
                },
            ],
            { cancelable: true }
        );
    }

    const handleSave = async () => {
        
        const savedPost = {
            title: post.title,
            owner: post.owner,
            content: post.content,
            updated_at: post.updated_at
        }

        if (params.isNew === "true") {
            addPost(params.workspaceID, savedPost);
        } else {
            await updatePost(post.id, savedPost);
            await fetchWorkspacePosts(params.workspaceID);
        }

        router.back();
    };

    if (!post) return <Text>Loading...</Text>;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
        >
            <Appbar.Header style={styles.header}>
                <Appbar.Action
                    icon="arrow-left"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                />

                <Appbar.Content
                    title={params.isNew === "true" ? "Create Post" : "Edit Post"}
                    titleStyle={{ fontWeight: 'bold' }}
                />

                {params.isNew === "false" && (
                    <Appbar.Action
                        icon="delete-outline"
                        onPress={handleDelete}
                        color={colors.error}
                        accessibilityLabel="Delete"
                        style={styles.actionButton}
                    />
                )}

                <Appbar.Action
                    icon="check"
                    onPress={handleSave}
                    accessibilityLabel="Save"
                />
            </Appbar.Header>

            <TextInput
                label="Title"
                value={post.title}
                onChangeText={(text) => setPost({ ...post, title: text })}
                style={[styles.input, { backgroundColor: colors.surface }]}
                mode="outlined"
            />

            <TextInput
                label="Content"
                value={post.content}
                onChangeText={(text) => setPost({ ...post, content: text })}
                multiline
                numberOfLines={10}
                style={[styles.input, {
                    backgroundColor: colors.surface,
                    minHeight: 200
                }]}
                mode="outlined"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 32,
    },
    header: {
        elevation: 0,
        backgroundColor: 'transparent',
    },
    input: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
});

export default EditPost;