import { create } from 'zustand';
import {
  saveFavorites,
  getFavorites,
  saveUserSession,
  getUserSession,
  clearUserSession,
  saveUserAccount,
  getUserAccount,
  saveUserPoints,
  getUserPoints,
  saveCart,
  getCart,
  saveOrderHistory,
  getOrderHistory,
} from '../data/storage';

export const useBowlStore = create((set, get) => ({
  favorites: [],
  bowls: [],
  cart: [],
  orderHistory: [],
  points: { total: 0, history: [] },
  initialized: false,
  user: null,
  isAuthenticated: false,
  initialize: async () => {
    if (get().initialized) return;
    const savedFavorites = await getFavorites();
    // remove duplicates
    const uniqueFavorites = savedFavorites.filter((bowl, index, self) =>
      index === self.findIndex((b) => b.id === bowl.id)
    );

    // check if user is logged in
    const savedUser = await getUserSession();

    set({
      favorites: uniqueFavorites,
      initialized: true,
      user: savedUser,
      isAuthenticated: !!savedUser,
    });

    // load points if logged in
    if (savedUser?.email) {
      const pointsData = await getUserPoints(savedUser.email);
      set({ points: pointsData });
    }

    // load cart
    const cart = await getCart();
    set({ cart });

    // load order history if logged in
    if (savedUser?.email) {
      const history = await getOrderHistory(savedUser.email);
      set({ orderHistory: history });
    }

    // save cleaned up favorites
    if (uniqueFavorites.length !== savedFavorites.length) {
      await saveFavorites(uniqueFavorites);
    }
  },
  signup: async (name, email, password) => {
    // check if fields are filled
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { success: false, error: 'All fields are required' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // check if email already exists
    const existingAccount = await getUserAccount(email);
    if (existingAccount) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // create account
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      createdAt: new Date().toISOString(),
    };

    await saveUserAccount(email, userData);

    // login automatically after signup
    const user = {
      email: userData.email,
      name: userData.name,
      loginTime: new Date().toISOString(),
    };
    await saveUserSession(user);
    const pointsData = await getUserPoints(user.email);
    set({ user, isAuthenticated: true, points: pointsData });

    return { success: true };
  },
  login: async (email, password) => {
    // check if fields are filled
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'Please enter both email and password' };
    }

    // Normalize email to lowercase for consistent comparison
    const normalizedEmail = email.toLowerCase().trim();

    // demo account
    if (normalizedEmail === 'demo@bowlapp.com' && password === 'demo123') {
      const user = {
        email: 'demo@bowlapp.com',
        name: 'Demo User',
        loginTime: new Date().toISOString(),
      };
      await saveUserSession(user);
      const pointsData = await getUserPoints(user.email);
      set({ user, isAuthenticated: true, points: pointsData });
      return { success: true };
    }

    // check if account exists
    const account = await getUserAccount(normalizedEmail);
    if (account && account.password === password) {
      const user = {
        email: account.email,
        name: account.name,
        loginTime: new Date().toISOString(),
      };
      await saveUserSession(user);
      const pointsData = await getUserPoints(user.email);
      set({ user, isAuthenticated: true, points: pointsData });
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  },
  logout: async () => {
    await clearUserSession();
    set({ user: null, isAuthenticated: false, points: { total: 0, history: [] } });
  },
  addFavorite: async (bowl) => {
    const currentFavorites = get().favorites;
    // check if already in favorites
    if (currentFavorites.some((f) => f.id === bowl.id)) {
      return;
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
    // remove duplicates
    const uniqueBowls = bowls.filter((bowl, index, self) =>
      index === self.findIndex((b) => b.id === bowl.id)
    );
    set({ bowls: uniqueBowls });
  },
  loadPoints: async () => {
    const user = get().user;
    if (!user?.email) return;
    const pointsData = await getUserPoints(user.email);
    set({ points: pointsData });
  },
  addPoints: async (amount, reason = 'Receipt scanned') => {
    const user = get().user;
    if (!user?.email) return { success: false, error: 'User not logged in' };

    const currentPoints = get().points;
    const newTotal = currentPoints.total + amount;
    const newHistory = [
      ...currentPoints.history,
      {
        amount,
        reason,
        date: new Date().toISOString(),
      },
    ];

    const updatedPoints = {
      total: newTotal,
      history: newHistory,
    };

    set({ points: updatedPoints });
    await saveUserPoints(user.email, updatedPoints);
    return { success: true, newTotal };
  },
  loadCart: async () => {
    const cart = await getCart();
    set({ cart: cart || [] });
  },
  addToCart: async (bowl, customizations = {}) => {
    const cart = get().cart || [];
    const cartItem = {
      id: Date.now().toString(),
      bowl: { ...bowl },
      customizations: {
        selectedIngredients: customizations.selectedIngredients || bowl.ingredients || [],
        ...customizations,
      },
      quantity: 1,
      price: bowl.price || 10.00,
      addedAt: new Date().toISOString(),
    };
    const newCart = [...cart, cartItem];
    set({ cart: newCart });
    await saveCart(newCart);
  },
  removeFromCart: async (itemId) => {
    const cart = get().cart || [];
    const newCart = cart.filter((item) => item.id !== itemId);
    set({ cart: newCart });
    await saveCart(newCart);
  },
  updateCartItemQuantity: async (itemId, quantity) => {
    const cart = get().cart || [];
    const newCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    set({ cart: newCart });
    await saveCart(newCart);
  },
  clearCart: async () => {
    set({ cart: [] });
    await saveCart([]);
  },
  loadOrderHistory: async () => {
    const user = get().user;
    if (!user?.email) return;
    const history = await getOrderHistory(user.email);
    set({ orderHistory: history });
  },
  placeOrder: async (orderData) => {
    const user = get().user;
    if (!user?.email) return { success: false, error: 'User not logged in' };

    const cart = get().cart || [];
    if (!cart || cart.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = {
      id: Date.now().toString(),
      items: [...cart],
      total: total,
      orderType: orderData.orderType || 'dine-in',
      paymentMethod: orderData.paymentMethod || 'cash',
      selectedTime: orderData.selectedTime || new Date().toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      userEmail: user.email,
    };

    const history = get().orderHistory;
    const newHistory = [order, ...history];
    set({ orderHistory: newHistory, cart: [] });
    await saveOrderHistory(user.email, newHistory);
    await saveCart([]);

    // add points for order (1 point per dollar)
    const pointsEarned = Math.floor(total);
    if (pointsEarned > 0) {
      await get().addPoints(pointsEarned, `Order #${order.id.substring(0, 6)}`);
    }

    return { success: true, order };
  },
}));
