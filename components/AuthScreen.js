import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title, useTheme, Snackbar } from 'react-native-paper';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const theme = useTheme();

  // Auth logic with Firebase
  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill all fields.');
      return;
    }
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Store user data in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setError('');
      // TODO: Navigate to main app
    } catch (e) {
      setError(e.message || 'Authentication failed.');
    }
  };

  // Google Sign-In (Web only, placeholder for Expo)
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setError('');
      // TODO: Navigate to main app
    } catch (e) {
      setError(e.message || 'Google Sign-In failed.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Title style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back!'}</Title>
        {isSignUp && (
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
          />
        )}
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
          left={<TextInput.Icon icon="lock" />}
        />
        <Button
          mode="contained"
          onPress={handleAuth}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <Button
          mode="text"
          onPress={() => setIsSignUp(!isSignUp)}
          style={styles.switchBtn}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
        <Text style={styles.or}>or</Text>
        <Button
          icon="google"
          mode="outlined"
          style={styles.googleBtn}
          onPress={handleGoogleSignIn}
        >
          Continue with Google
        </Button>
        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={2500}
          style={{ backgroundColor: theme.colors.error }}
        >
          {error}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f6fafd',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#1976d2',
  },
  input: {
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#1976d2',
  },
  switchBtn: {
    marginTop: 8,
    marginBottom: 8,
  },
  or: {
    marginVertical: 8,
    color: '#888',
  },
  googleBtn: {
    width: '100%',
    borderRadius: 8,
    borderColor: '#1976d2',
  },
});
