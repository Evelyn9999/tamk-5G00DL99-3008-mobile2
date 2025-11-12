import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useBowlStore } from '../store/useBowlStore';

export default function FavoritesScreen() {
  const { favorites } = useBowlStore();

  if (favorites.length === 0) {
    return <Text style={styles.center}>No favorite bowls yet ❤️</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorite Bowls</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  item: { fontSize: 18, marginVertical: 5 },
  center: { flex: 1, textAlign: 'center', textAlignVertical: 'center' },
});
