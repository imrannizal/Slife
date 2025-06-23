import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import useAuthStore from '../store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { restoreSession } = useAuthStore();
  
  // Restore session on splash screen load
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login'); // Navigate to login page
    }, 1000); // 1-second splash screen

    restoreSession();
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
