import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, Button, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import api, { setAuthToken } from '../services/api';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setAuthToken(response.data.token);
      navigation.navigate('Main');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h3 style={styles.title}>Login to Cach</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} buttonStyle={styles.button} />
      <Button
        title="Don't have an account? Sign up"
        type="clear"
        onPress={() => navigation.navigate('Register')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    borderRadius: 5,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;

