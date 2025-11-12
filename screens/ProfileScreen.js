import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useBowlStore } from '../store/useBowlStore';

export default function ProfileScreen({ navigation }) {
  const { favorites, bowls, clearAllFavorites } = useBowlStore();
  const [clearing, setClearing] = useState(false);

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all your favorite bowls?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            await clearAllFavorites();
            setClearing(false);
            Alert.alert('Success', 'All favorites have been cleared.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
          </View>
          <Text style={styles.userName}>Bowl App User</Text>
          <Text style={styles.userEmail}>user@bowlapp.com</Text>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{bowls.length}</Text>
              <Text style={styles.statLabel}>Bowls Available</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.actionButtonText}>❤️ View My Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Menu')}
          >
            <Text style={styles.actionButtonText}>📋 Browse Menu</Text>
          </TouchableOpacity>
          {favorites.length > 0 && (
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={handleClearFavorites}
              disabled={clearing}
            >
              <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
                {clearing ? 'Clearing...' : '🗑️ Clear All Favorites'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2025</Text>
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          <View style={styles.navContainer}>
            <Button
              title="🏠 Home"
              onPress={() => navigation.navigate('Home')}
            />
            <View style={styles.buttonSpacing} />
            <Button
              title="📋 Menu"
              onPress={() => navigation.navigate('Menu')}
            />
            <View style={styles.buttonSpacing} />
            <Button
              title="❤️ Favorites"
              onPress={() => navigation.navigate('Favorites')}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8BC34A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8BC34A',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#8BC34A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ff5252',
  },
  dangerButtonText: {
    color: '#ff5252',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  navContainer: {
    width: '100%',
  },
  buttonSpacing: {
    height: 10,
  },
});
