import { create } from 'zustand';
import {
  saveFavorites,
  getFavorites,
  saveUserSession,
  getUserSession,
  clearUserSession,
  saveUserAccount,
  getUserAccount,
} from '../data/storage';

export const useBowlStore = create((set, get) => ({
  favorites: [],
  bowls: [],
  initialized: false,
  user: null,
  isAuthenticated: false,
  initialize: async () => {
    if (get().initialized) return;
    const savedFavorites = await getFavorites();
    // Remove duplicates based on id
    const uniqueFavorites = savedFavorites.filter((bowl, index, self) =>
      index === self.findIndex((b) => b.id === bowl.id)
    );

    // Check for saved user session
    const savedUser = await getUserSession();

    set({
      favorites: uniqueFavorites,
      initialized: true,
      user: savedUser,
      isAuthenticated: !!savedUser,
    });

    // Save deduplicated favorites back to storage
    if (uniqueFavorites.length !== savedFavorites.length) {
      await saveFavorites(uniqueFavorites);
    }
  },
  signup: async (name, email, password) => {
    // Validate input
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { success: false, error: 'All fields are required' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const existingAccount = await getUserAccount(email);
    if (existingAccount) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Create new account
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
    };

    await saveUserAccount(email, userData);

    // Auto-login after signup
    const user = {
      email: userData.email,
      name: userData.name,
      loginTime: new Date().toISOString(),
    };
    await saveUserSession(user);
    set({ user, isAuthenticated: true });

    return { success: true };
  },
  login: async (email, password) => {
    // Validate input
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'Please enter both email and password' };
    }

    // Check for demo account
    if (email === 'demo@bowlapp.com' && password === 'demo123') {
      const user = {
        email: 'demo@bowlapp.com',
        name: 'Demo User',
        loginTime: new Date().toISOString(),
      };
      await saveUserSession(user);
      set({ user, isAuthenticated: true });
      return { success: true };
    }

    // Check against stored accounts
    const account = await getUserAccount(email);
    if (account && account.password === password) {
      const user = {
        email: account.email,
        name: account.name,
        loginTime: new Date().toISOString(),
      };
      await saveUserSession(user);
      set({ user, isAuthenticated: true });
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  },
  logout: async () => {
    await clearUserSession();
    set({ user: null, isAuthenticated: false });
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
  setBowls: (bowls) => {
    // Remove duplicates before setting
    const uniqueBowls = bowls.filter((bowl, index, self) =>
      index === self.findIndex((b) => b.id === bowl.id)
    );
    set({ bowls: uniqueBowls });
  },
}));
