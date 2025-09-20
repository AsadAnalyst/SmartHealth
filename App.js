import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from 'react-native-paper';
import { signOut } from 'firebase/auth';

import AuthScreen from './components/AuthScreen';
import HomeScreen from './components/HomeScreen';
import AssistantScreen from './components/AssistantScreen';
import MedicineScannerScreen from './components/MedicineScannerScreen';
import FoodAnalyzerScreen from './components/FoodAnalyzerScreen';
import TrackerScreen from './components/TrackerScreen';
import ChartsScreen from './components/ChartsScreen';
import SettingsScreen from './components/SettingsScreen';
import { auth } from './firebase';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI Assistant" component={AssistantScreen} />
      <Tab.Screen name="Scan Medicine" component={MedicineScannerScreen} />
      <Tab.Screen name="Food Analyzer" component={FoodAnalyzerScreen} />
      <Tab.Screen name="Tracker" component={TrackerScreen} />
      <Tab.Screen name="Charts" component={ChartsScreen} />
      <Tab.Screen name="Settings">
        {() => <SettingsScreenWithSignOut />}
      </Tab.Screenn>
    </Tab.Navigator>
  );
}

function SettingsScreenWithSignOut() {
  return (
    <>
      <SettingsScreen />
      <Button
        mode="contained"
        style={{ margin: 16, backgroundColor: '#d32f2f' }}
        onPress={() => signOut(auth)}
      >
        Sign Out
      </Button>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // Or a splash screen

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Auth" component={AuthScreen} />
          ) : (
            <Stack.Screen name="Main" component={MainTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
