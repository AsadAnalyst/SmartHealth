import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Title } from 'react-native-paper';
import { auth, db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

export default function ChartsScreen() {
  const [user, setUser] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], water: [], sleep: [], steps: [] });
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Get last 7 days
        const today = new Date();
        const days = [...Array(7)].map((_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (6-i));
          return d.toISOString().split('T')[0];
        });
        console.log('Generated days for lookup:', days); // Debug: print the days array
        const q = collection(db, 'users', firebaseUser.uid, 'daily');
        const querySnapshot = await getDocs(q);
        const water = [], sleep = [], steps = [];
        days.forEach(date => {
          const docSnap = querySnapshot.docs.find(doc => doc.id === date);
          const data = docSnap ? docSnap.data() : {};
          // Debug log
          if (docSnap) {
            console.log('Found doc:', docSnap.id, data);
          } else {
            console.log('No doc for date:', date);
          }
          water.push(data.water || 0);
          sleep.push(data.sleep || 0);
          steps.push(data.steps || 0);
        });
        // Check if any data exists
        const hasAnyData = water.some(v => v > 0) || sleep.some(v => v > 0) || steps.some(v => v > 0);
        setHasData(hasAnyData);
        setChartData({ labels: days.map(d => d.slice(5)), water, sleep, steps });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading || !user) return <View style={styles.container}><Text>Loading...</Text></View>;

  if (!hasData) {
    return (
      <View style={styles.container}>
        <Title style={styles.title}>Weekly Health Charts</Title>
        <Text style={{ textAlign: 'center', marginTop: 32, color: '#888' }}>
          No data available for the last 7 days. Please add your daily health data.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Weekly Health Charts</Title>
      <LineChart
        data={{
          labels: chartData.labels,
          datasets: [
            { data: chartData.water, color: () => '#1976d2', strokeWidth: 2, label: 'Water' },
            { data: chartData.sleep, color: () => '#43a047', strokeWidth: 2, label: 'Sleep' },
            { data: chartData.steps, color: () => '#fbc02d', strokeWidth: 2, label: 'Steps' },
          ],
          legend: ['Water (glasses)', 'Sleep (hrs)', 'Steps'],
        }}
        width={Dimensions.get('window').width - 32}
        height={260}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#e3f2fd',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
        style={{ marginVertical: 16, borderRadius: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fafd', padding: 16 },
  title: { fontSize: 22, marginVertical: 16, color: '#1976d2', fontWeight: 'bold', textAlign: 'center' },
});
