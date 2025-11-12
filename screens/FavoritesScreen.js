import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useBowlStore } from '../store/useBowlStore';

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useBowlStore();

  // Remove duplicates as a safety measure
  const uniqueFavorites = favorites.filter((bowl, index, self) =>
    index === self.findIndex((b) => b.id === bowl.id)
  );

  if (uniqueFavorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.center}>No favorite bowls yet ❤️</Text>
        <Button
          title="Browse Menu"
          onPress={() => navigation.navigate('Menu')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Favorite Bowls</Text>
        <Button
          title="Menu"
          onPress={() => navigation.navigate('Menu')}
        />
      </View>
      <FlatList
        data={uniqueFavorites}
        keyExtractor={(item, index) => `favorite-${item.id}-${index}`}
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
  item: { fontSize: 18 },
  center: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 20,
  },
  card: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
});
