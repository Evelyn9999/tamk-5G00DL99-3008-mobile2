import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useBowlStore } from '../store/useBowlStore';
import { THEME_COLOR } from '../config/constants';

export default function BowlBuilderScreen({ route, navigation }) {
  const bowl = route?.params?.bowl;
  const { addFavorite, favorites } = useBowlStore();
  const isFavorite = favorites.some((f) => f.id === bowl?.id);

  if (!bowl) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>No bowl selected</Text>
          <Text style={styles.emptyText}>Please select a bowl from the menu</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Menu')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Go to Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleAddFavorite = () => {
    addFavorite(bowl);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {bowl.image ? (
          <Image
            source={{ uri: bowl.image }}
            style={styles.bowlImage}
            defaultSource={require('../assets/icon.png')}
          />
        ) : (
          <View style={styles.iconContainer}>
            <Text style={styles.bowlIcon}>🥗</Text>
          </View>
        )}
        <Text style={styles.title}>{bowl.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsContainer}>
          {bowl.ingredients && bowl.ingredients.length > 0 ? (
            bowl.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientTag}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noIngredients}>No ingredients listed</Text>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isFavorite ? styles.favoriteButtonActive : styles.favoriteButton,
          ]}
          onPress={handleAddFavorite}
          disabled={isFavorite}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonIcon}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
          <Text
            style={[
              styles.actionButtonText,
              isFavorite && styles.actionButtonTextActive,
            ]}
          >
            {isFavorite ? 'Already in Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Favorites')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>❤️ View My Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => navigation.navigate('Menu')}
          activeOpacity={0.8}
        >
          <Text style={styles.tertiaryButtonText}>📋 Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bowlIcon: {
    fontSize: 50,
  },
  bowlImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientTag: {
    backgroundColor: THEME_COLOR + '20',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME_COLOR + '40',
  },
  ingredientText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  noIngredients: {
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteButton: {
    backgroundColor: THEME_COLOR,
  },
  favoriteButtonActive: {
    backgroundColor: '#e8f5e9',
    borderWidth: 2,
    borderColor: THEME_COLOR,
  },
  actionButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtonTextActive: {
    color: THEME_COLOR,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: THEME_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLOR,
  },
  tertiaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
