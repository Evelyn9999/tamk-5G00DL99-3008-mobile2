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

// save user accounts
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

// save user points
export const saveUserPoints = async (email, points) => {
  try {
    await AsyncStorage.setItem(`userPoints_${email.toLowerCase()}`, JSON.stringify(points));
  } catch (e) {
    console.log(e);
  }
};

export const getUserPoints = async (email) => {
  try {
    const data = await AsyncStorage.getItem(`userPoints_${email.toLowerCase()}`);
    return data ? JSON.parse(data) : { total: 0, history: [] };
  } catch (e) {
    console.log(e);
    return { total: 0, history: [] };
  }
};

// cart storage
export const saveCart = async (cart) => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    console.log(e);
  }
};

export const getCart = async () => {
  try {
    const data = await AsyncStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

// order history storage
export const saveOrderHistory = async (email, orders) => {
  try {
    await AsyncStorage.setItem(`orderHistory_${email.toLowerCase()}`, JSON.stringify(orders));
  } catch (e) {
    console.log(e);
  }
};

export const getOrderHistory = async (email) => {
  try {
    const data = await AsyncStorage.getItem(`orderHistory_${email.toLowerCase()}`);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
};
