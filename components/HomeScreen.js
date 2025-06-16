import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, ProgressBar, Title, TextInput, Button } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ water: '', sleep: '', steps: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [inputWater, setInputWater] = useState('');
  const [inputSleep, setInputSleep] = useState('');
  const [inputSteps, setInputSteps] = useState('');

  // Get today's date as YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Load today's data from Firestore
          const ref = doc(db, 'users', firebaseUser.uid, 'daily', today);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            setData(snap.data());
          }
        } catch (e) {
          setError('Failed to load data: ' + e.message);
          console.error('HomeScreen Firestore error:', e);
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
      setDoc(ref, { water: data.water, sleep: data.sleep, steps: data.steps }, { merge: true });
    }
  }, [user, data, loading]);

  // If all values are 0, show add data form (but only after loading and user is present)
  useEffect(() => {
    if (!loading && user && data.water === 0 && data.sleep === 0 && data.steps === 0) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [loading, user, data]);

  // Replace all increment/decrement logic with this handler:
  const handleChange = (field, delta) => {
    setData(prev => {
      const current = Number(prev[field]) || 0;
      const updated = Math.max(0, current + delta);
      const newData = { ...prev, [field]: updated };
      // Save immediately to Firestore
      if (user) {
        const ref = doc(db, 'users', user.uid, 'daily', today);
        setDoc(ref, {
          water: field === 'water' ? updated : Number(prev.water) || 0,
          sleep: field === 'sleep' ? updated : Number(prev.sleep) || 0,
          steps: field === 'steps' ? updated : Number(prev.steps) || 0,
        }, { merge: true });
      }
      return newData;
    });
  };

  // Always show the edit form below the dashboard
  const handleAddData = () => {
    setData({
      water: Number(inputWater) || 0,
      sleep: Number(inputSleep) || 0,
      steps: Number(inputSteps) || 0,
    });
    // Save immediately to Firestore
    if (user) {
      const ref = doc(db, 'users', user.uid, 'daily', today);
      setDoc(ref, {
        water: Number(inputWater) || 0,
        sleep: Number(inputSleep) || 0,
        steps: Number(inputSteps) || 0,
      }, { merge: true });
    }
  };

  useEffect(() => {
    // Pre-fill the form with current values
    setInputWater(data.water ? String(data.water) : '');
    setInputSleep(data.sleep ? String(data.sleep) : '');
    setInputSteps(data.steps ? String(data.steps) : '');
  }, [data]);

  if (loading) return <View style={styles.container}><ActivityIndicator /><Text>Loading...</Text></View>;
  if (error) return <View style={styles.container}><Text style={{color:'red'}}>{error}</Text></View>;
  if (!user) return <View style={styles.container}><Text>Please log in.</Text></View>;

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Today's Health Summary</Title>
      <View style={styles.cardsRow}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>🥤 Water</Text>
            <Text style={styles.value}>{data.water} glasses</Text>
            <View style={styles.rowBtns}>
              <TouchableOpacity onPress={() => handleChange('water', -1)}><Text style={styles.btn}>-</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleChange('water', 1)}><Text style={styles.btn}>+</Text></TouchableOpacity>
            </View>
            <ProgressBar progress={(Number(data.water) || 0)/8} color="#1976d2" style={styles.progress} />
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>😴 Sleep</Text>
            <Text style={styles.value}>{data.sleep} hrs</Text>
            <View style={styles.rowBtns}>
              <TouchableOpacity onPress={() => handleChange('sleep', -1)}><Text style={styles.btn}>-</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleChange('sleep', 1)}><Text style={styles.btn}>+</Text></TouchableOpacity>
            </View>
            <ProgressBar progress={(Number(data.sleep) || 0)/8} color="#1976d2" style={styles.progress} />
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>🚶 Steps</Text>
            <Text style={styles.value}>{data.steps}</Text>
            <View style={styles.rowBtns}>
              <TouchableOpacity onPress={() => handleChange('steps', -1)}><Text style={styles.btn}>-</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => handleChange('steps', 1)}><Text style={styles.btn}>+</Text></TouchableOpacity>
            </View>
            <ProgressBar progress={(Number(data.steps) || 0)/10000} color="#1976d2" style={styles.progress} />
          </Card.Content>
        </Card>
      </View>
      <TouchableOpacity style={styles.quoteBox}>
        <Text style={styles.quote}>
          "Health is wealth. Take care of your body, it's the only place you have to live!"
        </Text>
      </TouchableOpacity>
      {/* Always show the edit form below the dashboard */}
      <View style={{ width: '100%', marginTop: 24 }}>
        <Title style={styles.title}>Edit Today's Data</Title>
        <TextInput
          label="Water (glasses)"
          value={inputWater}
          onChangeText={setInputWater}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Sleep (hours)"
          value={inputSleep}
          onChangeText={setInputSleep}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Steps"
          value={inputSteps}
          onChangeText={setInputSteps}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleAddData} style={{ marginTop: 16 }}>
          Save Changes
        </Button>
      </View>
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
  input: {
    width: '100%',
    marginBottom: 16,
  },
});
