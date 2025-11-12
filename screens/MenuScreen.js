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
        // Remove duplicates based on id before setting
        const uniqueBowls = data.filter((bowl, index, self) =>
          index === self.findIndex((b) => b.id === bowl.id)
        );
        setBowls(uniqueBowls);
      } catch (err) {
        setError('Failed to load bowls');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [setBowls]);

  // Remove duplicates as a safety measure
  const uniqueBowls = bowls.filter((bowl, index, self) =>
    index === self.findIndex((b) => b.id === bowl.id)
  );

  if (loading) return <Text style={styles.center}>Loading...</Text>;
  if (error) return <Text style={styles.center}>{error}</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.navButtons}>
          <Button
            title="❤️"
            onPress={() => navigation.navigate('Favorites')}
          />
          <Button
            title="👤"
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      </View>
      <FlatList
        data={uniqueBowls}
        keyExtractor={(item, index) => `bowl-${item.id}-${index}`}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  navButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  item: { fontSize: 18 },
  center: { flex: 1, textAlign: 'center', textAlignVertical: 'center' },
  card: { marginVertical: 10, padding: 10, backgroundColor: '#eee', borderRadius: 8 },
});
