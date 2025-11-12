import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useBowlStore } from '../store/useBowlStore';

export default function BowlBuilderScreen({ route }) {
  const bowl = route?.params?.bowl;
  const { addFavorite } = useBowlStore();

  if (!bowl) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No bowl selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bowl.name}</Text>
      <Text style={styles.subtitle}>Ingredients: {bowl.ingredients?.join(', ') || 'N/A'}</Text>
      <Button title="Add to Favorites" onPress={() => addFavorite(bowl)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 20 },
});
