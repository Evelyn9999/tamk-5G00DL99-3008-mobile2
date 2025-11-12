import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useBowlStore } from '../store/useBowlStore';
import { THEME_COLOR } from '../config/constants';

export default function CustomHeader({ navigation, title }) {
  const { points, cart } = useBowlStore();
  const [showMenu, setShowMenu] = useState(false);

  const menuItems = [
    { name: 'Home', icon: '🏠', route: 'Home' },
    { name: 'Menu', icon: '📋', route: 'Menu' },
    { name: 'My Order', icon: '🛒', route: 'Order', badge: cart && cart.length > 0 ? cart.length : undefined },
    { name: 'Favorites', icon: '❤️', route: 'Favorites' },
    { name: 'Member Points', icon: '⭐', route: 'Member Integral' },
    { name: 'Order History', icon: '📦', route: 'Order History' },
    { name: 'Profile', icon: '👤', route: 'Profile' },
  ];

  const handleNavigate = (route) => {
    setShowMenu(false);
    navigation.navigate(route);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.headerRight}>
        {/* Cart Icon */}
        {cart && cart.length > 0 && (
          <TouchableOpacity
            style={styles.cartContainer}
            onPress={() => navigation.navigate('Order')}
            activeOpacity={0.7}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            <View style={styles.cartBadgeHeader}>
              <Text style={styles.cartBadgeTextHeader}>{cart.length.toString()}</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Points Display */}
        <TouchableOpacity
          style={styles.pointsContainer}
          onPress={() => navigation.navigate('Member Integral')}
          activeOpacity={0.7}
        >
          <Text style={styles.pointsIcon}>⭐</Text>
          <Text style={styles.pointsText}> {(points?.total || 0).toString()}</Text>
        </TouchableOpacity>

        {/* Navigation Menu Icon */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Navigation</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <Text style={styles.closeMenuIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.route}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Text style={styles.menuItemIcon}>{item.icon}</Text>
                  <Text style={styles.menuItemText}>{item.name}</Text>
                </View>
                {item.badge !== undefined && item.badge > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge.toString()}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME_COLOR,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  pointsIcon: {
    fontSize: 16,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cartContainer: {
    position: 'relative',
    marginRight: 12,
    padding: 8,
  },
  cartIcon: {
    fontSize: 20,
  },
  cartBadgeHeader: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff5252',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeTextHeader: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
  },
  menuIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: THEME_COLOR,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeMenuIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  badge: {
    backgroundColor: '#ff5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

