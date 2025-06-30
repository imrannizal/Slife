import { View, StyleSheet, Image } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import useAuthStore from '../../store/authStore';
import { useState } from 'react';

const ProfileScreen = () => {
  const { colors } = useTheme();
  const user = useAuthStore(state => state.user);
  const [userData, setUserData] = useState(user);

  const getMemberSince = (date) => {
    return new Date(date.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.profileCard, { elevation: 4 }]}>
        <Card.Content style={styles.cardContent}>

          <View style={styles.avatarShadow}>
            <Image
              source={{uri : userData.profile_picture ? userData.profile_picture : "https://picsum.photos/200/300.jpg"}}
              style={styles.avatar}
            />
          </View>

          <Text variant="headlineMedium" style={[styles.username, { color: colors.primary, marginTop: 16 }]}>
            {userData.username}
          </Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: colors.outline }]} />

          {/* User info section */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="email-outline" size={20} color={colors.onSurface} style={styles.icon} />
              <View style={styles.infoTextContainer}>
                <Text variant="bodySmall" style={[styles.label, { color: colors.onSurfaceVariant }]}>
                  Email
                </Text>
                <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
                  {userData.email}
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
                  {getMemberSince(userData.created_at)}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Action button */}
      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          onPress={() => router.push('/editProfile')}
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