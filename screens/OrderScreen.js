import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Card } from 'react-native-paper';
import { useBowlStore } from '../store/useBowlStore';
import { THEME_COLOR } from '../config/constants';

export default function OrderScreen({ navigation }) {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart, placeOrder, user, loadOrderHistory } = useBowlStore();
  const [orderType, setOrderType] = useState('dine-in');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedTime, setSelectedTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timeInput, setTimeInput] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // set default time to 30 minutes from now
    const defaultTime = new Date();
    defaultTime.setMinutes(defaultTime.getMinutes() + 30);
    setSelectedTime(defaultTime.toISOString());
    setTimeInput(formatTimeForInput(defaultTime));
  }, []);

  const formatTimeForInput = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeConfirm = () => {
    if (!timeInput) {
      Alert.alert('Error', 'Please select a time');
      return;
    }
    const [hours, minutes] = timeInput.split(':').map(Number);
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    if (time < new Date()) {
      time.setDate(time.getDate() + 1);
    }
    setSelectedTime(time.toISOString());
    setShowTimePicker(false);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Time Required', 'Please select a time for your order');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please log in to place an order',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Profile') },
        ]
      );
      return;
    }

    setProcessing(true);
    try {
      const result = await placeOrder({
        orderType,
        paymentMethod,
        selectedTime,
      });

      if (result.success) {
        await loadOrderHistory();
        setShowPaymentModal(false);
        Alert.alert(
          'Order Placed!',
          `Your order has been placed successfully!\n\nOrder #${result.order.id.substring(0, 6)}\nTotal: $${(result.order.total * 1.1).toFixed(2)}\n\n${orderType === 'dine-in' ? 'See you at the restaurant!' : 'Ready for pickup at selected time!'}`,
          [
            {
              text: 'View Orders',
              onPress: () => navigation.navigate('Order History'),
            },
            {
              text: 'OK',
              onPress: () => navigation.navigate('Menu'),
            },
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to place order');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to place order: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add bowls from the menu to get started</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Menu')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // calculate total only if cart has items
  const total = cart && cart.length > 0 ? calculateTotal() : 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Cart Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Order</Text>
          {cart && cart.map((item) => (
            <Card key={item.id} style={styles.cartItem}>
              <Card.Content>
                <View style={styles.cartItemHeader}>
                  <View style={styles.cartItemInfo}>
                    <Text style={styles.cartItemName}>{item.bowl?.name || 'Unknown Item'}</Text>
                    <Text style={styles.cartItemPrice}>${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => {
                      Alert.alert(
                        'Remove Item',
                        `Remove ${item.bowl?.name || 'this item'} from cart?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Remove',
                            style: 'destructive',
                            onPress: () => removeFromCart(item.id),
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                {item.customizations?.selectedIngredients && item.customizations.selectedIngredients.length > 0 && (
                  <Text style={styles.cartItemIngredients} numberOfLines={2}>
                    {item.customizations.selectedIngredients.join(', ')}
                  </Text>
                )}
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityValue}>{item.quantity.toString()}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Order Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Type</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioOption, orderType === 'dine-in' && styles.radioOptionSelected]}
              onPress={() => setOrderType('dine-in')}
            >
              <View style={styles.radioCircle}>
                {orderType === 'dine-in' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, orderType === 'dine-in' && styles.radioLabelSelected]}>
                🍽️ Dine In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioOption, styles.radioOptionSpacing, orderType === 'take-away' && styles.radioOptionSelected]}
              onPress={() => setOrderType('take-away')}
            >
              <View style={styles.radioCircle}>
                {orderType === 'take-away' && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.radioLabel, orderType === 'take-away' && styles.radioLabelSelected]}>
                📦 Take Away
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {orderType === 'dine-in' ? 'Reservation Time' : 'Pickup Time'}
          </Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.timeButtonText}>
              {selectedTime ? (new Date(selectedTime).toLocaleString() || 'Select Time') : 'Select Time'}
            </Text>
            <Text style={styles.timeButtonIcon}>🕐</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('cash')}
            >
              <Text style={styles.paymentIcon}>💵</Text>
              <Text style={[styles.paymentLabel, paymentMethod === 'cash' && styles.paymentLabelSelected]}>
                Cash
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, styles.paymentOptionSpacing, paymentMethod === 'card' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={styles.paymentIcon}>💳</Text>
              <Text style={[styles.paymentLabel, paymentMethod === 'card' && styles.paymentLabelSelected]}>
                Card
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, styles.paymentOptionSpacing, paymentMethod === 'mobile' && styles.paymentOptionSelected]}
              onPress={() => setPaymentMethod('mobile')}
            >
              <Text style={styles.paymentIcon}>📱</Text>
              <Text style={[styles.paymentLabel, paymentMethod === 'mobile' && styles.paymentLabelSelected]}>
                Mobile Pay
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (10%)</Text>
            <Text style={styles.summaryValue}>${(total * 0.1).toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${(total * 1.1).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>
            Place Order • ${(total * 1.1).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <Text style={styles.modalSubtitle}>
              {orderType === 'dine-in' ? 'When would you like to dine?' : 'When would you like to pickup?'}
            </Text>
            <TextInput
              style={styles.timeInput}
              placeholder="HH:MM (e.g., 14:30)"
              value={timeInput}
              onChangeText={setTimeInput}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, styles.modalButtonSpacing]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleTimeConfirm}
              >
                <Text style={styles.modalButtonConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Confirmation Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Order</Text>
            <View style={styles.confirmDetails}>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Order Type:</Text>
                <Text style={styles.confirmValue}>
                  {orderType === 'dine-in' ? '🍽️ Dine In' : '📦 Take Away'}
                </Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Time:</Text>
                <Text style={styles.confirmValue}>
                  {selectedTime ? (new Date(selectedTime).toLocaleString() || 'Not set') : 'Not set'}
                </Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={styles.confirmLabel}>Payment:</Text>
                <Text style={styles.confirmValue}>
                  {paymentMethod === 'cash' ? '💵 Cash' : paymentMethod === 'card' ? '💳 Card' : '📱 Mobile Pay'}
                </Text>
              </View>
              <View style={[styles.confirmRow, styles.confirmTotalRow]}>
                <Text style={styles.confirmTotalLabel}>Total:</Text>
                <Text style={styles.confirmTotalValue}>${(total * 1.1).toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, styles.modalButtonSpacing]}
                onPress={() => setShowPaymentModal(false)}
                disabled={processing}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm, processing && styles.modalButtonDisabled]}
                onPress={handlePlaceOrder}
                disabled={processing}
              >
                <Text style={styles.modalButtonConfirmText}>
                  {processing ? 'Processing...' : 'Confirm & Pay'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
  cartItem: {
    marginBottom: 12,
    elevation: 2,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#ff5252',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartItemIngredients: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  radioGroup: {
    // gap replaced with marginBottom on children
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  radioOptionSpacing: {
    marginTop: 12,
  },
  radioOptionSelected: {
    borderColor: THEME_COLOR,
    backgroundColor: THEME_COLOR + '10',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME_COLOR,
  },
  radioLabel: {
    fontSize: 16,
    color: '#666',
  },
  radioLabelSelected: {
    color: THEME_COLOR,
    fontWeight: '600',
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeButtonText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  timeButtonIcon: {
    fontSize: 20,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  paymentOptionSpacing: {
    marginLeft: 12,
  },
  paymentOptionSelected: {
    borderColor: THEME_COLOR,
    backgroundColor: THEME_COLOR + '10',
  },
  paymentIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  paymentLabelSelected: {
    color: THEME_COLOR,
    fontWeight: '600',
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  checkoutButton: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSpacing: {
    marginRight: 12,
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonConfirm: {
    backgroundColor: THEME_COLOR,
  },
  modalButtonDisabled: {
    opacity: 0.6,
  },
  modalButtonCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmDetails: {
    marginVertical: 20,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  confirmLabel: {
    fontSize: 16,
    color: '#666',
  },
  confirmValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  confirmTotalRow: {
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
    marginTop: 8,
    paddingTop: 16,
  },
  confirmTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  confirmTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
});

