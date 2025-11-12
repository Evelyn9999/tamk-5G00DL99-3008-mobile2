import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useBowlStore } from '../store/useBowlStore';
import { THEME_COLOR } from '../config/constants';

export default function MemberIntegralScreen({ navigation }) {
  const { user, points, loadPoints, addPoints } = useBowlStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (user?.email) {
      loadPoints();
    }
  }, [user, loadPoints]);

  useEffect(() => {
    if (showCamera && !permission?.granted) {
      requestPermission();
    }
  }, [showCamera, permission, requestPermission]);

  const handleScanReceipt = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to scan receipts. Please enable it in your device settings.'
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current || scanning) return;

    setScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      // simulate scanning receipt (would use ocr in real app)
      setTimeout(async () => {
        // give random points between 10-50 for demo
        const pointsEarned = Math.floor(Math.random() * 41) + 10;

        const result = await addPoints(pointsEarned, 'Receipt scanned');
        if (result.success) {
          Alert.alert(
            '✅ Receipt Scanned!',
            `You earned ${pointsEarned} points!\n\nTotal points: ${result.newTotal}`,
            [
              {
                text: 'Scan Another',
                onPress: () => setScanning(false),
              },
              {
                text: 'Done',
                onPress: () => {
                  setShowCamera(false);
                  setScanning(false);
                },
              },
            ]
          );
        }
      }, 1500);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan receipt: ' + error.message);
      setScanning(false);
    }
  };

  const closeCamera = () => {
    setShowCamera(false);
    setScanning(false);
  };

  if (showCamera) {
    if (!permission) {
      return (
        <View style={styles.container}>
          <Text style={styles.message}>Requesting camera permission...</Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.message}>We need your permission to use the camera</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={closeCamera}>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraTopBar}>
              <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.cameraTitle}>Scan Receipt</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.scanArea}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Text style={styles.scanHint}>Position receipt within the frame</Text>
            </View>

            <View style={styles.cameraBottomBar}>
              <TouchableOpacity
                style={[styles.captureButton, scanning && styles.captureButtonDisabled]}
                onPress={takePicture}
                disabled={scanning}
              >
                <View style={styles.captureButtonInner}>
                  {scanning ? (
                    <Text style={styles.scanningText}>Processing...</Text>
                  ) : (
                    <Text style={styles.captureButtonText}>📷</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Points Header */}
        <Card style={styles.pointsCard}>
          <Card.Content>
            <Text style={styles.pointsLabel}>Your Points</Text>
            <Text style={styles.pointsValue}>{(points.total || 0).toString()}</Text>
            <Text style={styles.pointsSubtext}>Scan receipts to earn more points!</Text>
          </Card.Content>
        </Card>

        {/* Scan Receipt Button */}
        <Card style={styles.cardSection}>
          <Card.Content>
            <Button
              mode="contained"
              icon="camera"
              onPress={handleScanReceipt}
              style={styles.scanButton}
              buttonColor={THEME_COLOR}
            >
              Scan Receipt
            </Button>
            <Text style={styles.scanDescription}>
              Take a photo of your receipt to automatically earn points. Earn 1 point for every $1 spent!
            </Text>
          </Card.Content>
        </Card>

        {/* Points History */}
        <Card style={styles.cardSection}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Points History</Text>
            <Divider style={styles.divider} />
            {points.history && points.history.length > 0 ? (
              points.history
                .slice()
                .reverse()
                .slice(0, 10)
                .map((entry, index) => (
                  <View key={index}>
                    <View style={styles.historyItem}>
                      <View style={styles.historyLeft}>
                        <Text style={styles.historyReason}>{entry.reason}</Text>
                        <Text style={styles.historyDate}>
                          {new Date(entry.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={styles.historyPoints}>+{entry.amount.toString()}</Text>
                    </View>
                    {index < Math.min(points.history.length - 1, 9) && (
                      <Divider style={styles.divider} />
                    )}
                  </View>
                ))
            ) : (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>No points history yet</Text>
                <Text style={styles.emptyHistorySubtext}>
                  Scan your first receipt to start earning points!
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Rewards Info */}
        <Card style={styles.cardSection}>
          <Card.Content>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <Divider style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📸</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Scan Receipt</Text>
                <Text style={styles.infoDescription}>
                  Take a photo of your purchase receipt
                </Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⭐</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Earn Points</Text>
                <Text style={styles.infoDescription}>
                  Get 1 point for every $1 you spend
                </Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🎁</Text>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Redeem Rewards</Text>
                <Text style={styles.infoDescription}>
                  Use your points for discounts and special offers
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
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
  pointsCard: {
    backgroundColor: THEME_COLOR,
    marginBottom: 20,
    elevation: 4,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  pointsSubtext: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  cardSection: {
    marginBottom: 20,
    elevation: 2,
  },
  scanButton: {
    marginBottom: 12,
  },
  scanDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  divider: {
    marginVertical: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyLeft: {
    flex: 1,
  },
  historyReason: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
  },
  historyPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  emptyHistory: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  scanFrame: {
    width: '100%',
    aspectRatio: 1.5,
    borderWidth: 2,
    borderColor: THEME_COLOR,
    borderRadius: 12,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: THEME_COLOR,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scanHint: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 8,
  },
  cameraBottomBar: {
    padding: 30,
    paddingBottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: THEME_COLOR,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 32,
  },
  scanningText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  message: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#333',
    fontSize: 18,
    padding: 20,
  },
  button: {
    backgroundColor: THEME_COLOR,
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: THEME_COLOR,
  },
  secondaryButtonText: {
    color: THEME_COLOR,
  },
});

