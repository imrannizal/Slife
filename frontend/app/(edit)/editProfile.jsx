import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { Appbar, TextInput, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';

import useAuthStore from '../../store/authStore';

const EditProfileScreen = () => {
    const router = useRouter();
    const currentUser = useAuthStore(state => state.user);
    const [editUser, setEditUser] = useState(currentUser);
    const updateProfile = useAuthStore(state => state.updateProfile);
    const { colors } = useTheme();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!editUser && currentUser) {
            setEditUser(currentUser);
        }
    }, [currentUser]);

    const handleSave = async () => {

        if (!editUser?.username?.trim()) {
            Alert.alert('Error', 'Username cannot be empty');
            return;
        }

        try {
            await updateProfile(editUser.uid, {
                username: editUser.username,
                profile_picture: editUser.profile_picture,
                email: editUser.email
            });
            router.back();

        } catch (err) {
            Alert.alert('Error', 'Failed to update profile');
            console.log("Error updating user profile (EditProfile): ", err);
            throw err;

        }
        
        await updateProfile(editUser.uid, editUser);

        router.back();
    };

    if (!editUser) return <Text>Loading...</Text>;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Appbar.Header style={[styles.header, { backgroundColor: colors.surface }]}>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Edit Profile" />
                <Appbar.Action 
                    icon="check" 
                    onPress={handleSave} 
                    disabled={isLoading}
                />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Profile Picture Section */}
                <View style={styles.imagePreviewContainer}>
                    {editUser.profile_picture ? (
                        <Image
                            source={{ uri: editUser.profile_picture }}
                            style={styles.imagePreview}
                            resizeMode="cover"
                            onError={() => Alert.alert("Error", "Couldn't load image")}
                        />
                    ) : (
                        <View style={[styles.imagePlaceholder, { backgroundColor: colors.primaryContainer }]}>
                            <Text style={{ color: colors.onPrimaryContainer }}>
                                {editUser.username?.charAt(0)?.toUpperCase() || 'U'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Form Fields */}
                <TextInput
                    label="Username"
                    value={editUser.username || ''}
                    onChangeText={(text) => setEditUser({ ...editUser, username: text })}
                    mode="outlined"
                    style={styles.input}
                    maxLength={30}
                    disabled={isLoading}
                />

                <TextInput
                    label="Email"
                    value={editUser.email || ''}
                    onChangeText={(text) => setEditUser({ ...editUser, email: text })}
                    mode="outlined"
                    style={styles.input}
                    keyboardType="email-address"
                    disabled={isLoading}
                />

                <TextInput
                    label="Profile Picture URL"
                    value={editUser.profile_picture || ''}
                    onChangeText={(text) => setEditUser({ ...editUser, profile_picture: text })}
                    mode="outlined"
                    style={styles.input}
                    placeholder="https://example.com/photo.jpg"
                    keyboardType="url"
                    disabled={isLoading}
                />

                {isLoading && (
                    <ActivityIndicator animating={true} color={colors.primary} />
                )}
            </ScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        elevation: 2,
    },
    contentContainer: {
        padding: 20,
    },
    input: {
        marginBottom: 16,
    },
    imagePreviewContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    imagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButton: {
        marginTop: 20,
        paddingVertical: 8,
    },
});

export default EditProfileScreen;