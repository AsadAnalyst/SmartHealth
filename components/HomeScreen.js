import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, ProgressBar, Title } from 'react-native-paper';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [steps, setSteps] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get today's date as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Load today's data from Firestore
        const ref = doc(db, 'users', firebaseUser.uid, 'daily', today);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setWater(data.water || 0);
          setSleep(data.sleep || 0);
          setSteps(data.steps || 0);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Save to Firestore when values change
  useEffect(() => {
    if (user && !loading) {
      const ref = doc(db, 'users', user.uid, 'daily', today);
      setDoc(ref, { water, sleep, steps }, { merge: true });
    }
  }, [user, water, sleep, steps, loading]);

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Today's Health Summary</Title>
      <View style={styles.cardsRow}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>🥤 Water</Text>
            <Text style={styles.value}>{water} glasses</Text>
            <View style={styles.rowBtns}>
              <TouchableOpacity onPress={() => setWater(Math.max(0, water-1))}><Text style={styles.btn}>-</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setWater(water+1)}><Text style={styles.btn}>+</Text></TouchableOpacity>
            </View>
            <ProgressBar progress={water/8} color="#1976d2" style={styles.progress} />
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>😴 Sleep</Text>
            <Text style={styles.value}>{sleep} hrs</Text>
            <View style={styles.rowBtns}>
              <TouchableOpacity onPress={() => setSleep(Math.max(0, sleep-1))}><Text style={styles.btn}>-</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setSleep(sleep+1)}><Text style={styles.btn}>+</Text></TouchableOpacity>
            </View>
            <ProgressBar progress={sleep/8} color="#1976d2" style={styles.progress} />
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>🚶 Steps</Text>
            <Text style={styles.value}>{steps}</Text>
            <View style={styles.rowBtns}>
              <TouchableOpacity onPress={() => setSteps(Math.max(0, steps-500))}><Text style={styles.btn}>-</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setSteps(steps+500)}><Text style={styles.btn}>+</Text></TouchableOpacity>
            </View>
            <ProgressBar progress={steps/10000} color="#1976d2" style={styles.progress} />
          </Card.Content>
        </Card>
      </View>
      <TouchableOpacity style={styles.quoteBox}>
        <Text style={styles.quote}>
          "Health is wealth. Take care of your body, it's the only place you have to live!"
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fafd',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    marginVertical: 16,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1976d2',
  },
  progress: {
    height: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  rowBtns: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  btn: {
    fontSize: 22,
    color: '#1976d2',
    marginHorizontal: 8,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#e3f2fd',
  },
  quoteBox: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  quote: {
    fontStyle: 'italic',
    color: '#1976d2',
    fontSize: 16,
    textAlign: 'center',
  },
});
