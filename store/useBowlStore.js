import { create } from 'zustand';
import { saveFavorites, getFavorites } from '../data/storage';

export const useBowlStore = create((set, get) => ({
  favorites: [],
  bowls: [],
  initialized: false,
  initialize: async () => {
    if (get().initialized) return;
    const savedFavorites = await getFavorites();
    set({ favorites: savedFavorites, initialized: true });
  },
  addFavorite: async (bowl) => {
    const newFavorites = [...get().favorites, bowl];
    set({ favorites: newFavorites });
    await saveFavorites(newFavorites);
  },
  removeFavorite: async (id) => {
    const newFavorites = get().favorites.filter((b) => b.id !== id);
    set({ favorites: newFavorites });
    await saveFavorites(newFavorites);
  },
  setBowls: (bowls) => set({ bowls }),
}));
