import { create } from 'zustand';
import { saveFavorites, getFavorites } from '../data/storage';

export const useBowlStore = create((set, get) => ({
  favorites: [],
  bowls: [],
  initialized: false,
  initialize: async () => {
    if (get().initialized) return;
    const savedFavorites = await getFavorites();
    // Remove duplicates based on id
    const uniqueFavorites = savedFavorites.filter((bowl, index, self) =>
      index === self.findIndex((b) => b.id === bowl.id)
    );
    set({ favorites: uniqueFavorites, initialized: true });
    // Save deduplicated favorites back to storage
    if (uniqueFavorites.length !== savedFavorites.length) {
      await saveFavorites(uniqueFavorites);
    }
  },
  addFavorite: async (bowl) => {
    const currentFavorites = get().favorites;
    // Check if bowl is already in favorites
    if (currentFavorites.some((f) => f.id === bowl.id)) {
      return; // Already in favorites, don't add again
    }
    const newFavorites = [...currentFavorites, bowl];
    set({ favorites: newFavorites });
    await saveFavorites(newFavorites);
  },
  removeFavorite: async (id) => {
    const newFavorites = get().favorites.filter((b) => b.id !== id);
    set({ favorites: newFavorites });
    await saveFavorites(newFavorites);
  },
  clearAllFavorites: async () => {
    set({ favorites: [] });
    await saveFavorites([]);
  },
  setBowls: (bowls) => set({ bowls }),
}));
