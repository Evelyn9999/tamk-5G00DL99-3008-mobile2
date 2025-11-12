import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import BowlBuilderScreen from './screens/BowlBuilderScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';
import { scheduleDailyReminder } from './utils/notificationHelper';
import { useBowlStore } from './store/useBowlStore';
import { THEME_COLOR } from './config/constants';

const Stack = createNativeStackNavigator();

// Custom theme for React Native Paper
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: THEME_COLOR,
    primaryContainer: THEME_COLOR + '20',
  },
};

export default function App() {
  const initialized = useRef(false);
  const initialize = useBowlStore((state) => state.initialize);
  const storeInitialized = useBowlStore((state) => state.initialized);
  const isAuthenticated = useBowlStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Only initialize once
    if (!initialized.current && !storeInitialized) {
      initialized.current = true;
      // Initialize store (load favorites from storage and check auth)
      initialize();
      // Schedule the daily notification when the app runs
      scheduleDailyReminder();
    }
  }, [initialize, storeInitialized]);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: THEME_COLOR,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{
                  headerShown: true,
                  title: 'Sign Up',
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Menu" component={MenuScreen} />
              <Stack.Screen name="Bowl Builder" component={BowlBuilderScreen} />
              <Stack.Screen name="Favorites" component={FavoritesScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
