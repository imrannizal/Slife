import { Image, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Zustand
import useAuthStore from '../../store/authStore';
import useNoteStore from '../../store/noteStore';
import useTodoStore from '../../store/todoStore';

// Components
import ThemedCard from '../../components/ThemedCard';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import Space from '../../components/Space';

const Login = () => {
  // useStates
  const colors = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Zustand functions
  const login = useAuthStore(state => state.login);
  const fetchNotes = useNoteStore(state => state.fetchNotes);
  const fetchTodos = useTodoStore(state => state.fetchTodos);

  // Handle login button press
  // Sets up zustand user, notes and todos data
  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {

      // Validate inputs
      if (!email || !password) {
        throw new Error('Please fill all fields');
      }

      await login(email, password);
      const user = useAuthStore.getState().user;

      // Check if user exists
      if (!user) {
        alert('No user with that account. Please try again.');
        return;
      }
      
      // fetch all things
      await Promise.all([
        await fetchNotes(user.username),
        await fetchTodos(user.username)
      ]);

      const authData2 = await AsyncStorage.getItem('auth-storage');
      console.log("async2")
      console.log('Auth Storage:', JSON.parse(authData2));

      // Navigate on successful login
      router.push('/todos');
    } catch (err) {
      console.error('Login error:', err);
      setError("There is no such user");
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <DismissKeyboardView style={styles.container}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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

          {/* Error message */}
          {error ? (
            <Text style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>
              {error}
            </Text>
          ) : null}

          <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraHeight={120}
          keyboardShouldPersistTaps="handled"
          >
            <TextInput
              label="Email"
              value={email}
              mode="outlined"
              onChangeText={setEmail}
              style={styles.input}
              placeholder="user@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              label="Password"
              value={password}
              mode="outlined"
              secureTextEntry
              onChangeText={setPassword}
              style={styles.input}
              placeholder="••••••••"
            />
          </KeyboardAwareScrollView>

          <Button 
            mode="contained" 
            onPress={handleLogin} 
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </ThemedCard>

        <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurface, marginBottom: 4}]}>
          Don't have an account?
        </Text>

        <Pressable onPress={() => router.replace('/register')}>
          <Text variant="bodyMedium" style={[styles.description, { color: colors.primary }]}>
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
  googleButton: {
    marginBottom: 16,
    borderColor: '#ddd', // Light border for Google button
  },
  divider: {
    textAlign: 'center',
    marginVertical: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    alignSelf: 'center'
  }
});