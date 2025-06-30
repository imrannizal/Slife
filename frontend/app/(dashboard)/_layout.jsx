import { View, StyleSheet, Image, Text } from 'react-native';
import { useState } from 'react';
import { Appbar, Badge, useTheme } from 'react-native-paper';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';
import useAuthStore from '../../store/authStore';

const DrawerContent = (props) => {
  const { user, email, profilePicture, ...rest } = props;
  const { colors } = useTheme();

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={[styles.profileSection, { borderBottomColor: colors.outline }]}>
        {profilePicture && profilePicture.startsWith('http') ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.avatar}
            defaultSource={{uri : 'https://picsum.photos/200'}}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primaryContainer }]}>
            <Text style={[styles.avatarText, { color: colors.onPrimaryContainer }]}>
              {user ? user.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
        )}
        <Text style={[styles.name, { color: colors.onSurface }]}>{user || 'User'}</Text>
        <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>{email || 'email@example.com'}</Text>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const PersonalSpaceLayout = () => {
  const user = useAuthStore(state => state.user);
  const [userData, setUserData] = useState(user);
  const [unreadCount, setUnreadCount] = useState(9);
  const { colors } = useTheme();

  const getTitleFromRoute = (routeName) => {
    switch (routeName) {
      case '(personal)': return 'Personal Space';
      case '(work)': return 'Work Space';
      case 'userProfile': return 'User Profile';
      case 'settings': return 'Settings';
      case 'about': return 'About';
      default: return 'Slife';
    }
  };

  return (

    <View style={styles.container}>

      <Drawer
        drawerContent={(props) => (
          <DrawerContent
            {...props}
            user={userData.username ? userData.username : "NaN"}
            email={userData.email ? userData.email : "NaN"}
            profilePicture={userData.profile_picture ? userData.profile_picture : "https://picsum.photos/200"}
          />
        )}
        screenOptions={({ navigation, route }) => ({
          header: () => (

            <Appbar.Header>

              {/* This is burger button */}
              <Appbar.Action
                icon="menu"
                onPress={() => navigation.toggleDrawer()}
                accessibilityLabel="Open drawer"
              />

              {/* This is Title */}
              <Appbar.Content
                title={getTitleFromRoute(route.name)}
                titleStyle={{ fontWeight: 'bold' }}
              />

              {/* Notification button with badge */}
              <View style={{ position: 'relative' }}>
                <Appbar.Action
                  icon="bell"
                  onPress={() => router.push("/notifications")}
                  accessibilityLabel="Notifications"
                />
                {unreadCount > 0 && (
                  <Badge
                    size={16}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: colors.notification,
                    }}
                  >
                    {unreadCount}
                  </Badge>
                )}
              </View>
            </Appbar.Header>
          ),

          drawerStyle: {
            width: 240
          }
        })}
      >

        <Drawer.Screen name="(personal)" options={{ title: "Personal Space" }} />
        <Drawer.Screen name="(work)" options={{ title: "Work Space" }} />
        <Drawer.Screen name="userProfile" options={{ title: "User Profile" }} />
        <Drawer.Screen name="settings" options={{ title: "Settings" }} />
        <Drawer.Screen name="about" options={{ title: "About" }} />

      </Drawer>

    </View>
  );
};

export default PersonalSpaceLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});