import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useBowlStore } from '../store/useBowlStore';
import { THEME_COLOR } from '../config/constants';

export default function HomeScreen({ navigation }) {
  const { cart, points } = useBowlStore();

  const menuItems = [
    {
      id: 'menu',
      title: 'Browse Menu',
      icon: '📋',
      route: 'Menu',
      description: 'Explore our delicious bowl options',
      color: THEME_COLOR,
    },
    {
      id: 'order',
      title: 'My Order',
      icon: '🛒',
      route: 'Order',
      description: 'View your cart and checkout',
      color: '#ff6b35',
      badge: cart && cart.length > 0 ? cart.length : null,
    },
    {
      id: 'favorites',
      title: 'My Favorites',
      icon: '❤️',
      route: 'Favorites',
      description: 'Your saved favorite bowls',
      color: '#e91e63',
    },
    {
      id: 'points',
      title: 'Member Points',
      icon: '⭐',
      route: 'Member Integral',
      description: `You have ${(points?.total || 0).toString()} points`,
      color: '#ffc107',
    },
    {
      id: 'history',
      title: 'Order History',
      icon: '📦',
      route: 'Order History',
      description: 'View your past orders',
      color: '#9c27b0',
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: '👤',
      route: 'Profile',
      description: 'Account settings and info',
      color: '#607d8b',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <View style={styles.iconContainer}>
          <Text style={styles.heroIcon}>🥗</Text>
        </View>
        <Text style={styles.title}>Welcome to Bowl</Text>
        <Text style={styles.subtitle}>Build your own healthy meal bowl</Text>
        <Text style={styles.description}>
          Discover delicious, nutritious bowl recipes tailored to your taste
        </Text>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuCard, { borderLeftColor: item.color }]}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.8}
          >
            <View style={styles.menuCardContent}>
              <View style={[styles.menuIconContainer, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                {item.badge && item.badge > 0 && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge.toString()}</Text>
                  </View>
                )}
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroIcon: {
    fontSize: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  menuGrid: {
    width: '100%',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  menuIcon: {
    fontSize: 28,
  },
  menuBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  menuBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  menuArrow: {
    fontSize: 24,
    color: '#bdc3c7',
    marginLeft: 8,
  },
});
