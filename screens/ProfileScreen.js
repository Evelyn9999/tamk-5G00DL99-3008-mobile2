import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
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
        <Card style={styles.cardSection}>
          <Card.Content>
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
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.cardSection}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Button
              mode="contained"
              icon="heart"
              onPress={() => navigation.navigate('Favorites')}
              style={styles.paperButton}
            >
              View My Favorites
            </Button>
            <Button
              mode="contained"
              icon="menu"
              onPress={() => navigation.navigate('Menu')}
              style={styles.paperButton}
            >
              Browse Menu
            </Button>
            {favorites.length > 0 && (
              <Button
                mode="outlined"
                icon="delete"
                onPress={handleClearFavorites}
                disabled={clearing}
                textColor="#ff5252"
                style={[styles.paperButton, styles.dangerPaperButton]}
              >
                {clearing ? 'Clearing...' : 'Clear All Favorites'}
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* App Information */}
        <Card style={styles.cardSection}>
          <Card.Content>
            <Text style={styles.sectionTitle}>App Information</Text>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2025</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Navigation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          <View style={styles.navContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Home')}
              activeOpacity={0.8}
            >
              <Text style={styles.navButtonText}>🏠 Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Menu')}
              activeOpacity={0.8}
            >
              <Text style={styles.navButtonText}>📋 Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigation.navigate('Favorites')}
              activeOpacity={0.8}
            >
              <Text style={styles.navButtonText}>❤️ Favorites</Text>
            </TouchableOpacity>
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
  cardSection: {
    marginBottom: 20,
    elevation: 2,
  },
  paperButton: {
    marginTop: 10,
  },
  dangerPaperButton: {
    borderColor: '#ff5252',
  },
  divider: {
    marginVertical: 8,
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
    gap: 12,
  },
  navButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
});
