import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthStore } from '../../stores/authStore'; // Your Zustand store

// Components
import ThemedCard from '../../components/ThemedCard';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import Space from '../../components/Space';

WebBrowser.maybeCompleteAuthSession(); // Required for web auth

const Login = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);

  // Google OAuth config
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '165779564877-0g76q6i3scpsdhhk9ocdhisp045h6kk3.apps.googleusercontent.com ', // From Google Cloud Console
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',  // Optional (better performance)
  });

  // Handle Google auth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      // Send token to your backend
      handleGoogleLogin(access_token);
    }
  }, [response]);

  const handleGoogleLogin = async (token) => {
    try {
      const res = await fetch('https://postgres-production-0c86.up.railway.app/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const { user, jwt } = await res.json();
      setUser(user);
      setToken(jwt);
      router.replace("/todos");
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleLocalLogin = () => {
    // Your existing email/password login
    router.replace("/todos");
  };

  return (
    <DismissKeyboardView style={styles.container}>
      <View style={styles.container}>
        <Image 
          source={require('../../assets/bird-slife.png')}
          style={styles.image}
          resizeMode="cover"
        />
        
        <Space height={60}/>
      
        <ThemedCard>
          <Text variant="headlineMedium" style={[styles.title, { color: colors.primary }]}>
            Login
          </Text>

          <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurface }]}>
            Sign in to continue
          </Text>

          <Button 
            mode="outlined" 
            onPress={() => promptAsync()}
            style={styles.googleButton}
            icon="google" // Requires react-native-paper 4.x+
          >
            Sign in with Google
          </Button>

          <Text variant="bodySmall" style={[styles.divider, { color: colors.onSurface }]}>
            ─── OR ───
          </Text>

          <TextInput
            label="Email"
            value={email}
            mode="outlined"
            onChangeText={setEmail}
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            mode="outlined"
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
          />

          <Button mode="contained" onPress={handleLocalLogin} style={styles.button}>
            Login
          </Button>
        </ThemedCard>

        <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurface, marginBottom: 4}]}>
          Have not signed in yet?
        </Text>

        <Pressable onPress={() => router.replace('/register')}>
          <Text variant="bodyMedium" style={[styles.description, { color: 'blue' }]}>
            Register Now
          </Text>
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
    lineHeight: 64,
  },
  description: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    alignSelf: 'center'
  },
  googleButton: {
    marginBottom: 16,
    borderColor: '#4285F4', // Google blue
    borderWidth: 1,
  },
  divider: {
    textAlign: 'center',
    marginVertical: 16,
  },
});