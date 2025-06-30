import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Appbar, TextInput, Text } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from 'react-native-paper';

import useWorkspaceStore from '../../../store/workspaceStore';
import useAuthStore from '../../../store/authStore';

const EditWorkspaceScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { colors } = useTheme();
    const [workspace, setWorkspace] = useState(null);
    const updateWorkspace = useWorkspaceStore(state => state.updateWorkspace);
    const addWorkspace = useWorkspaceStore(state => state.createWorkspace);

    // Initialize workspace from navigation params
    useEffect(() => {
        if (params.workspace) {
            const parsedWorkspace = JSON.parse(params.workspace);
            setWorkspace({
                ...parsedWorkspace,
            });
        } else {
            console.log("sike!");
            router.back();
        }
    }, []);

    const handleSave = () => {

        const user = useAuthStore.getState().user;

        const savedWorkspace = {
            id: params.id,
            description: workspace.description,
            owner: workspace.owner,
            name: workspace.name,
            image: workspace.image,
            updated_at: new Date(workspace.updated_at),
            created_at: new Date(workspace.created_at),
            token: null,
            expiryToken: null
        }

        if (params.isNew === "true") {
            addWorkspace(savedWorkspace);
        } else {
            updateWorkspace(user.uid, workspace.id, savedWorkspace);
        }

        router.back();
    };

    if (!workspace) return <Text>Loading...</Text>;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={styles.header}>
                <Appbar.Action
                    icon="arrow-left"
                    onPress={() => router.back()}
                    accessibilityLabel="Go back"
                />
                <Appbar.Content
                    title={params.isNew === "true" ? "Create Workspace" : "Edit Workspace"}
                    titleStyle={{ fontWeight: 'bold' }}
                />
                <Appbar.Action
                    icon="check"
                    onPress={handleSave}
                    accessibilityLabel="Save changes"
                />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.contentContainer}>

                {/* Image Preview */}
                {workspace.image ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image
                            source={{ uri: workspace.image }}
                            style={styles.imagePreview}
                            resizeMode="contain"
                            onError={() => Alert.alert("Error", "Couldn't load image from URL")}
                        />
                    </View>
                ) : null}

                {/* Image URL Input */}
                <TextInput
                    label="Image URL (optional)"
                    value={workspace.image}
                    onChangeText={(text) => setWorkspace({ ...workspace, image: text })}
                    mode="outlined"
                    style={styles.input}
                    placeholder="https://picsum.photos/seed/workspace1/200"
                    keyboardType="url"
                />

                <TextInput
                    label="Workspace Name"
                    value={workspace.name}
                    onChangeText={(text) => setWorkspace({ ...workspace, name: text })}
                    mode="outlined"
                    style={styles.input}
                    maxLength={50}
                />

                <TextInput
                    label="Description"
                    value={workspace.description}
                    onChangeText={(text) => setWorkspace({ ...workspace, description: text })}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={[styles.input, styles.descriptionInput]}
                />
            </ScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    header: {
        elevation: 0,
        backgroundColor: 'transparent',
    },
    input: {
        marginBottom: 16,
    },
    descriptionInput: {
        minHeight: 120,
    },
    imagePreviewContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
});

export default EditWorkspaceScreen;