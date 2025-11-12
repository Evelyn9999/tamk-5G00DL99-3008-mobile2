import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { getBowls } from '../data/api';
import { useBowlStore } from '../store/useBowlStore';

export default function MenuScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { bowls, setBowls } = useBowlStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBowls();
        setBowls(data);
      } catch (err) {
        setError('Failed to load bowls');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Text style={styles.center}>Loading...</Text>;
  if (error) return <Text style={styles.center}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu</Text>
      <FlatList
        data={bowls}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.item}>{item.name}</Text>
            <Button
              title="View Details"
              onPress={() => navigation.navigate('Bowl Builder', { bowl: item })}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: { fontSize: 18 },
  center: { flex: 1, textAlign: 'center', textAlignVertical: 'center' },
  card: { marginVertical: 10, padding: 10, backgroundColor: '#eee', borderRadius: 8 },
});
