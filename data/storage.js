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
