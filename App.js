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
import MemberIntegralScreen from './screens/MemberIntegralScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import CustomHeader from './components/CustomHeader';
import { scheduleDailyReminder } from './utils/notificationHelper';
import { useBowlStore } from './store/useBowlStore';
import { THEME_COLOR } from './config/constants';

const Stack = createNativeStackNavigator();

// theme colors
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
    // make sure it only runs once
    if (!initialized.current && !storeInitialized) {
      initialized.current = true;
      // load saved data
      initialize();
      // set up daily reminder
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
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={({ navigation }) => ({
                  header: () => <CustomHeader navigation={navigation} title="Home" />,
                })}
              />
              <Stack.Screen
                name="Menu"
                component={MenuScreen}
                options={({ navigation }) => ({
                  header: () => <CustomHeader navigation={navigation} title="Menu" />,
                })}
              />
              <Stack.Screen
                name="Bowl Builder"
                component={BowlBuilderScreen}
                options={({ navigation }) => ({
                  header: () => <CustomHeader navigation={navigation} title="Bowl Builder" />,
                })}
              />
              <Stack.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={({ navigation }) => ({
                  header: () => <CustomHeader navigation={navigation} title="Favorites" />,
                })}
              />
              <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={({ navigation }) => ({
                  header: () => <CustomHeader navigation={navigation} title="Profile" />,
                })}
              />
              <Stack.Screen
                name="Member Integral"
                component={MemberIntegralScreen}
                options={({ navigation }) => ({
                  header: () => <CustomHeader navigation={navigation} title="Member Points" />,
                })}
              />
              <Stack.Screen
                name="Order"
                component={OrderScreen}
                options={({ navigation }) => ({
                  header: () => <CustomHeader navigation={navigation} title="My Order" />,
                })}
              />
              <Stack.Screen
                name="Order History"
                component={OrderHistoryScreen}
                options={({ navigation }) => ({
                  header: () => <CustomHeader navigation={navigation} title="Order History" />,
                })}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
