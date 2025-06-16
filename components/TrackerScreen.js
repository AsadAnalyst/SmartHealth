import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function TrackerScreen() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const q = collection(db, 'users', firebaseUser.uid, 'daily');
          const querySnapshot = await getDocs(q);
          const days = [];
          querySnapshot.forEach(doc => {
            days.push({ date: doc.id, ...doc.data() });
          });
          days.sort((a, b) => a.date.localeCompare(b.date));
          setData(days.slice(-7));
        } catch (e) {
          setError('Failed to load tracker data: ' + e.message);
          console.error('TrackerScreen Firestore error:', e);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <View style={styles.container}><ActivityIndicator /><Text>Loading...</Text></View>;
  if (error) return <View style={styles.container}><Text style={{color:'red'}}>{error}</Text></View>;
  if (!user) return <View style={styles.container}><Text>Please log in.</Text></View>;

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Last 7 Days</Title>
      <FlatList
        data={data}
        keyExtractor={item => item.date}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.date}>{item.date}</Text>
              <Text>🥤 Water: {item.water || 0} glasses</Text>
              <Text>😴 Sleep: {item.sleep || 0} hrs</Text>
              <Text>🚶 Steps: {item.steps || 0}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fafd', padding: 16 },
  title: { fontSize: 22, marginVertical: 16, color: '#1976d2', fontWeight: 'bold', textAlign: 'center' },
  card: { marginBottom: 12, borderRadius: 12, backgroundColor: '#fff', elevation: 2 },
  date: { fontWeight: 'bold', marginBottom: 4 },
});
