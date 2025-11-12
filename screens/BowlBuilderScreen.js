import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useBowlStore } from '../store/useBowlStore';

export default function BowlBuilderScreen({ route, navigation }) {
  const bowl = route?.params?.bowl;
  const { addFavorite, favorites } = useBowlStore();
  const isFavorite = favorites.some((f) => f.id === bowl?.id);

  if (!bowl) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No bowl selected</Text>
        <Button
          title="Go to Menu"
          onPress={() => navigation.navigate('Menu')}
        />
      </View>
    );
  }

  const handleAddFavorite = () => {
    addFavorite(bowl);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bowl.name}</Text>
      <Text style={styles.subtitle}>Ingredients: {bowl.ingredients?.join(', ') || 'N/A'}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isFavorite ? "❤️ Already in Favorites" : "Add to Favorites"}
          onPress={handleAddFavorite}
          disabled={isFavorite}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="❤️ View Favorites"
          onPress={() => navigation.navigate('Favorites')}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="📋 Back to Menu"
          onPress={() => navigation.navigate('Menu')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonSpacing: {
    height: 15,
  },
});
