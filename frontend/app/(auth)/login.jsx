import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useState } from 'react';
import { router } from 'expo-router';

// Components
import ThemedCard from '../../components/ThemedCard';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import Space from '../../components/Space';

const Login = () => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Helpers
  const handleLogin = () => {
    router.replace("/todos")
  };

  return (

    <DismissKeyboardView style={styles.container}>
      <View style={styles.container}>

        <Image 
          source = {require('../../assets/bird-slife.png')}
          style = {styles.image}
          resizeMode = "cover"
        />
        
        <Space height = {60}/>
      
        <ThemedCard>
          <Text variant="headlineMedium" style={[styles.title, { color: colors.primary }]}>
            Login
          </Text>

          <Text variant="bodyMedium" style={[styles.description, { color: colors.onSurface }]}>
            Sign in to continue
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

          <Button mode="contained" onPress={handleLogin} style={styles.button}>
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
});