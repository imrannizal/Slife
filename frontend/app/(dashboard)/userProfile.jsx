import { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Avatar, Button, Card, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

const ProfileScreen = () => {
  const { colors } = useTheme();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');

        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData.username);
          setEmail(userData.email);
          setProfilePicture(userData.profile_picture);
          
          // Convert Firebase Timestamp to Date
          if (userData.created_at && userData.created_at.seconds) {
            const firebaseTimestamp = userData.created_at;
            const jsDate = new Date(firebaseTimestamp.seconds * 1000 + firebaseTimestamp.nanoseconds / 1000000);
            setCreatedAt(jsDate);
          }
        }
      } catch {
        console.error("Problem with handling user data.");
      }
    };

    loadUser();
  }, []);

  const getMemberSince = () => {
  if (!createdAt) return "Unknown";
  
  return createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.profileCard, { elevation: 4 }]}>
        <Card.Content style={styles.cardContent}>
          
          <View style={styles.avatarShadow}>
            {profilePicture ? (
              typeof profilePicture === 'string' ? (
                profilePicture.startsWith('http') ? (
                  <Image
                    source={{ uri: profilePicture }}
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Text
                    size={100}
                    label={profilePicture[0]?.toUpperCase() || 'U'}
                    style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}
                  />
                )
              ) : null
            ) : (
              <Avatar.Text
                size={100}
                label={user ? user[0]?.toUpperCase() : 'U'}
                style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}
              />
            )}
          </View>


          <Text variant="headlineMedium" style={[styles.username, { color: colors.primary, marginTop: 16 }]}>
            {user || 'Username'}
          </Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.outline }]} />

          {/* User information section */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="email-outline" size={20} color={colors.onSurface} style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text variant="bodySmall" style={[styles.label, { color: colors.onSurfaceVariant }]}>
                  Email
                </Text>
                <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
                  {email || 'email@example.com'}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="calendar-month-outline" size={20} color={colors.onSurface} style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text variant="bodySmall" style={[styles.label, { color: colors.onSurfaceVariant }]}>
                  Member since
                </Text>
                <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
                  {getMemberSince() || 'Unknown'}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        <Button 
          mode="contained" 
          onPress={() => router.push('/profile/edit')}
          style={[styles.button, { backgroundColor: colors.primary }]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          icon="account-edit"
        >
          Edit Profile
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
    backgroundColor: '#f5f5f5',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  username: {
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 24,
    opacity: 0.2,
  },
  infoContainer: {
    width: '100%',
    gap: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  label: {
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;