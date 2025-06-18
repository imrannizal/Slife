import { View, StyleSheet, Image, Text } from 'react-native';
import { Appbar } from 'react-native-paper';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { router } from 'expo-router';

const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.profileSection}>
        <Image source={require('../../assets/bird-slife.png')} style={styles.avatar} />
        <Text style={styles.name}>Imran Shuhanizal</Text>
        <Text style={styles.subtitle}>@imrancode</Text>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const PersonalSpaceLayout = () => {

  const getTitleFromRoute = (routeName) => {
    switch (routeName) {
      case '(personal)': return 'Personal Space';
      case '(work)': return 'Work Space';
      case 'mails': return 'Mails';
      case 'userProfile': return 'User Profile';
      case 'settings': return 'Settings';
      case 'about': return 'About';
      default: return 'Slife';
    }
  };

  return (
    <View style={styles.container}>

        <Drawer 
        drawerContent={(props) => <DrawerContent {...props}/>}
        screenOptions={({ navigation, route }) => ({
            header: () => (
                <Appbar.Header>
                    <Appbar.Content title={getTitleFromRoute(route.name)} />
                    
                    {(route.name === '(personal)' || route.name === '(work)') && (
                      <Appbar.Action icon="magnify" onPress={() => router.push("/search")} />
                    )}
                    
                    <Appbar.Action icon="bell" onPress={() => router.push("/notifications")} />
                </Appbar.Header>
            ),

            drawerStyle: {
                width: 240
            }
        })}
        >

            <Drawer.Screen name="(personal)" options={{title: "Personal Space"}}/>
            <Drawer.Screen name="(work)" options={{title: "Work Space"}}/>
            <Drawer.Screen name="mails" options={{title: "Mails"}}/>
            <Drawer.Screen name="userProfile" options={{title: "User Profile"}}/>
            <Drawer.Screen name="settings" options={{title: "Settings"}}/>
            <Drawer.Screen name="about" options={{title: "About"}}/>

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
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
});