import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Bowl App 🥗</Text>
      <Text style={styles.subtitle}>Build your own healthy meal bowl</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="📋 Menu"
          onPress={() => navigation.navigate('Menu')}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="❤️ Favorites"
          onPress={() => navigation.navigate('Favorites')}
        />
        <View style={styles.buttonSpacing} />
        <Button
          title="👤 Profile"
          onPress={() => navigation.navigate('Profile')}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonSpacing: {
    height: 15,
  },
});
