import { router } from 'expo-router'
import { StyleSheet, View, Pressable } from 'react-native'
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useState } from 'react';

// Zustand
import useAuthStore from '../../store/authStore';

// Components
import DismissKeyboardView from '../../components/DismissKeyboardView'
import ThemedCard from '../../components/ThemedCard'

const Register = () => {
  const { colors } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Zustand function
  const register = useAuthStore((state) => state.register);

  // Helpers
  const handleRegister = async () => {
    try {
      // Validate inputs
      if (!username || !email || !password || !confirmPassword) {
        alert('Please fill all fields');
        return;
      } else if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      } else if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
      } else if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }

      // Register user using authStore
      await register(email, password, username);

      // fetch users
      const user = useAuthStore.getState().user

      // routing to todo page
      if (user) {
        router.replace('/todos');
      } else {
        alert('Registration failed!');
      }

    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (

    <DismissKeyboardView style={styles.container}>
      <View style={styles.container}>

        <ThemedCard>
          <Text variant="headlineMedium" style={[styles.title, { color: colors.primary }]}>
            Register
          </Text>

          <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurface }]}>
            Register an account
          </Text>

          <TextInput
            label="Username"
            value={username}
            mode="outlined"
            onChangeText={setUsername}
            style={styles.input}
          />

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

          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            mode="outlined"
            secureTextEntry
            onChangeText={setConfirmPassword}
            style={styles.input}
          />

          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Register
          </Button>
        </ThemedCard>

        <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurface, marginBottom: 4}]}>
          Already have an account?
        </Text>

        <Pressable onPress={() => router.replace('/login')}>
          <Text variant="bodyMedium" style={[styles.description, { color: 'blue' }]}>
            Login your account
          </Text>
        </Pressable>

      </View>
    </DismissKeyboardView>
      
  )
}

export default Register

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
})