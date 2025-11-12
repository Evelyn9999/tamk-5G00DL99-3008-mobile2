import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useBowlStore } from '../store/useBowlStore';
import { THEME_COLOR } from '../config/constants';

export default function BowlBuilderScreen({ route, navigation }) {
  const bowl = route?.params?.bowl;
  const { addFavorite, favorites, addToCart } = useBowlStore();
  const isFavorite = favorites.some((f) => f.id === bowl?.id);

  // state for customizing bowl
  const [selectedIngredients, setSelectedIngredients] = useState(
    bowl?.ingredients ? [...bowl.ingredients] : []
  );

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

  const toggleIngredient = (ingredient) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((ing) => ing !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const basePrice = bowl.price || 10.00;
  const totalPrice = basePrice.toFixed(2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Image Section */}
      <View style={styles.heroSection}>
        {bowl.image ? (
          <Image
            source={{ uri: bowl.image }}
            style={styles.heroImage}
            defaultSource={require('../assets/icon.png')}
          />
        ) : (
          <View style={styles.heroImagePlaceholder}>
            <Text style={styles.heroIcon}>🥗</Text>
          </View>
        )}
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{bowl.name}</Text>
          {bowl.description && (
            <Text style={styles.heroDescription}>{bowl.description}</Text>
          )}
        </View>
      </View>

      {/* Price Section */}
      <View style={styles.priceSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>${totalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
          onPress={handleAddFavorite}
          disabled={isFavorite}
          activeOpacity={0.8}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      {/* Customize Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customize Your Bowl</Text>
        <Text style={styles.sectionSubtitle}>Select or remove ingredients</Text>

        <View style={styles.ingredientsList}>
          {bowl.ingredients && bowl.ingredients.length > 0 ? (
            bowl.ingredients.map((ingredient, index) => {
              const isSelected = selectedIngredients.includes(ingredient);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.ingredientItem,
                    isSelected && styles.ingredientItemSelected,
                  ]}
                  onPress={() => toggleIngredient(ingredient)}
                  activeOpacity={0.7}
                >
                  <View style={styles.ingredientLeft}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={[styles.ingredientName, isSelected && styles.ingredientNameSelected]}>
                      {ingredient}
                    </Text>
                  </View>
                  <Text style={styles.ingredientAction}>
                    {isSelected ? 'Remove' : 'Add'}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noIngredients}>No ingredients available</Text>
          )}
        </View>
      </View>

      {/* Selected Ingredients Summary */}
      {selectedIngredients.length > 0 && (
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Your Bowl Includes:</Text>
          <View style={styles.selectedTags}>
            {selectedIngredients.map((ingredient, index) => (
              <View key={index} style={styles.selectedTag}>
                <Text style={styles.selectedTagText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={async () => {
            await addToCart(bowl, { selectedIngredients });
            Alert.alert(
              'Added to Cart!',
              `${bowl.name} has been added to your cart`,
              [
                {
                  text: 'Continue Shopping',
                  style: 'cancel',
                },
                {
                  text: 'View Cart',
                  onPress: () => navigation.navigate('Order'),
                },
              ]
            );
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.orderButtonText}>🛒 Add to Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryActionButton}
          onPress={handleAddFavorite}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryActionButtonText}>
            {isFavorite ? '❤️ In Favorites' : '❤️ Add to Favorites'}
          </Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Order')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>View Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Menu')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Back to Menu</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 20,
  },
  heroSection: {
    position: 'relative',
    height: 280,
    backgroundColor: '#e0e0e0',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIcon: {
    fontSize: 80,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    paddingBottom: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 22,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  favoriteButtonActive: {
    backgroundColor: '#ffebee',
    borderColor: '#ff5252',
  },
  favoriteIcon: {
    fontSize: 24,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  ingredientsList: {
    marginTop: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ingredientItemSelected: {
    backgroundColor: '#f8f9fa',
  },
  ingredientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: THEME_COLOR,
    borderColor: THEME_COLOR,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ingredientName: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  ingredientNameSelected: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  ingredientAction: {
    fontSize: 14,
    color: THEME_COLOR,
    fontWeight: '500',
  },
  noIngredients: {
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  summarySection: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 1,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedTag: {
    backgroundColor: THEME_COLOR + '20',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME_COLOR + '40',
  },
  selectedTagText: {
    fontSize: 14,
    color: THEME_COLOR,
    fontWeight: '500',
  },
  buttonContainer: {
    padding: 20,
    paddingTop: 10,
  },
  orderButton: {
    backgroundColor: '#ff6b35',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryActionButton: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryActionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  secondaryButtonText: {
    fontSize: 15,
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
