import { create } from 'zustand';

export const useBowlStore = create((set) => ({
  favorites: [],
  bowls: [],
  addFavorite: (bowl) => set((state) => ({ favorites: [...state.favorites, bowl] })),
  removeFavorite: (id) => set((state) => ({
    favorites: state.favorites.filter((b) => b.id !== id),
  })),
  setBowls: (bowls) => set({ bowls }),
}));
