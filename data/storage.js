import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  } catch (e) {
    console.log(e);
  }
};

export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem('favorites');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const saveUserSession = async (user) => {
  try {
    await AsyncStorage.setItem('userSession', JSON.stringify(user));
  } catch (e) {
    console.log(e);
  }
};

export const getUserSession = async () => {
  try {
    const data = await AsyncStorage.getItem('userSession');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const clearUserSession = async () => {
  try {
    await AsyncStorage.removeItem('userSession');
  } catch (e) {
    console.log(e);
  }
};

// User accounts storage
export const saveUserAccount = async (email, userData) => {
  try {
    const accounts = await getUserAccounts();
    accounts[email.toLowerCase()] = userData;
    await AsyncStorage.setItem('userAccounts', JSON.stringify(accounts));
  } catch (e) {
    console.log(e);
  }
};

export const getUserAccounts = async () => {
  try {
    const data = await AsyncStorage.getItem('userAccounts');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.log(e);
    return {};
  }
};

export const getUserAccount = async (email) => {
  try {
    const accounts = await getUserAccounts();
    return accounts[email.toLowerCase()] || null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
