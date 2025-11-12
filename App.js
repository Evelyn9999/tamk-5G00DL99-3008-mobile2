import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import BowlBuilderScreen from './screens/BowlBuilderScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import { scheduleDailyReminder } from './utils/notificationHelper';
import { useBowlStore } from './store/useBowlStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const initialized = useRef(false);
  const initialize = useBowlStore((state) => state.initialize);
  const storeInitialized = useBowlStore((state) => state.initialized);

  useEffect(() => {
    // Only initialize once
    if (!initialized.current && !storeInitialized) {
      initialized.current = true;
      // Initialize store (load favorites from storage)
      initialize();
      // Schedule the daily notification when the app runs
      scheduleDailyReminder();
    }
  }, [initialize, storeInitialized]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Bowl Builder" component={BowlBuilderScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
