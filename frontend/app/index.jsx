import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

// Zustand
import useAuthStore from '../store/authStore';
import useNoteStore from '../store/noteStore';
import useTodoStore from '../store/todoStore';
import useWorkspaceStore from '../store/workspaceStore';

export default function SplashScreen() {
  const router = useRouter();
  const checkAuth = useAuthStore(state => state.checkAuth);
  
  // Restore session on splash screen load
  useEffect(() => {

    const verifyAuth = async () => {

      const userData = await useAuthStore.getState().user;
      console.log(userData);

      if (userData != null) {
        await useNoteStore.getState().fetchNotes(userData.username);
        await useTodoStore.getState().fetchTodos(userData.username);
        await useWorkspaceStore.getState().fetchWorkspaces(userData.uid);
        router.replace('/todos');
      } else {
        router.replace('/login'); // Navigate to login page
      }

    }

    const timer = setTimeout(() => {
      verifyAuth();
    }, 1000); // 1-second splash screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/bird-slife.png')} style={styles.logo} />
      <Text style={styles.text}>Achieve Academic Freedom</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});
