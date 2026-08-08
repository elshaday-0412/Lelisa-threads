import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Product, CartItem, User } from '../types/index.js';
import { WishlistService } from '../services/api.js';

import { Language, Translations, translations } from '../translations/translations.js';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, qty?: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // QuickView
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  pendingPhoneUser: User | null;
  setPendingPhoneUser: (user: User | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authLoading: boolean;
  authModalReason: string | null;
  setAuthModalReason: (reason: string | null) => void;
  requireAuth: (action: () => void, modalReason?: string) => boolean;
  executePendingAction: () => void;
  loginAsDemoAdmin: () => void;
  loginAsDemoUser: () => void;
  logout: () => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Currency formatting
  formatPrice: (amountInBirr: number) => string;
  currencyMode: 'ETB' | 'USD';
  setCurrencyMode: (mode: 'ETB' | 'USD') => void;

  // Dark Mode
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;

  // Language & Translation
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Cart state - strictly initialized empty for user isolation
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state - strictly initialized empty for user isolation
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Helper to sync cart with Firebase Firestore for current authenticated user
  const syncCartToFirebase = (newCart: CartItem[], targetUid?: string) => {
    const uid = targetUid || user?.id;
    if (uid) {
      import('../services/firebaseService.js').then(({ FirestoreUserDataService }) => {
        FirestoreUserDataService.saveUserCart(uid, newCart);
      });
    }
  };

  // Helper to sync wishlist with Firebase Firestore for current authenticated user
  const syncWishlistToFirebase = (newWishlist: string[], targetUid?: string) => {
    const uid = targetUid || user?.id;
    if (uid) {
      import('../services/firebaseService.js').then(({ FirestoreUserDataService }) => {
        FirestoreUserDataService.saveUserWishlist(uid, newWishlist);
      });
    }
  };

  // QuickView state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Auth state - Default to null to allow fresh registration
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ht_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // Remove legacy demo customer account from persistence
      if (parsed.id === 'user-customer') {
        localStorage.removeItem('ht_user');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [pendingPhoneUser, setPendingPhoneUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const requireAuth = (action: () => void, modalReason?: string): boolean => {
    if (user) {
      action();
      return true;
    } else {
      pendingActionRef.current = action;
      if (modalReason) {
        setAuthModalReason(modalReason);
      } else {
        setAuthModalReason('Please log in or create an account to use this feature.');
      }
      setIsAuthModalOpen(true);
      return false;
    }
  };

  const executePendingAction = () => {
    if (pendingActionRef.current) {
      const actionToRun = pendingActionRef.current;
      pendingActionRef.current = null;
      setAuthModalReason(null);
      setTimeout(() => {
        actionToRun();
      }, 100);
    }
  };

  // Currency display toggle (ETB vs USD luxury reference)
  const [currencyMode, setCurrencyMode] = useState<'ETB' | 'USD'>('ETB');

  // Dark Mode State with localStorage persistence & system preference check
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ht_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ht_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ht_theme', 'light');
    }
  }, [isDarkMode]);

  // Language State (EN, AM, OM)
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ht_lang');
    if (saved === 'AM' || saved === 'OM' || saved === 'EN') return saved as Language;
    return 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ht_lang', lang);
  };

  const t = translations[language] || translations.EN;

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`ht_cart_${user.id}`, JSON.stringify(cart));
    } else {
      localStorage.removeItem('ht_cart');
    }
  }, [cart, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`ht_wishlist_${user.id}`, JSON.stringify(wishlistIds));
    } else {
      localStorage.removeItem('ht_wishlist');
    }
  }, [wishlistIds, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ht_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ht_user');
    }
  }, [user]);

  // Initialize Firebase Auth listener & user session
  useEffect(() => {
    import('../services/firebaseService.js').then(({ FirebaseAuthService, FirestoreUserDataService, isValidPhone }) => {
      const unsubscribe = FirebaseAuthService.onAuthChange(async authUser => {
        if (authUser) {
          if (isValidPhone(authUser.phone)) {
            setUser(authUser);
            setPendingPhoneUser(null);
            // Load user-specific bag and favorites from Firebase Firestore
            const userData = await FirestoreUserDataService.getUserData(authUser.id);
            setCart(userData.cart);
            setWishlistIds(userData.wishlist);
          } else {
            setUser(null);
            setPendingPhoneUser(authUser);
            setCart([]);
            setWishlistIds([]);
            setIsAuthModalOpen(true);
          }
        } else {
          // Immediately clear displayed bag items, favorites, badges on sign-out
          setUser(null);
          setPendingPhoneUser(null);
          setCart([]);
          setWishlistIds([]);
          localStorage.removeItem('ht_user');
          localStorage.removeItem('ht_cart');
          localStorage.removeItem('ht_wishlist');
        }
        setAuthLoading(false);
      });
      return () => unsubscribe();
    }).catch(e => {
      console.warn('Firebase Service load notice:', e);
      setAuthLoading(false);
    });
  }, []);

  const showToast = (title: string, message = '', type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (product: Product, size?: string, color?: string, qty = 1) => {
    const selectedSize = size || product.sizes[0] || 'Standard';
    const selectedColor = color || product.colors[0] || 'White & Gold';

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex].quantity += qty;
      } else {
        updated = [...prev, { product, quantity: qty, selectedSize, selectedColor }];
      }
      syncCartToFirebase(updated);
      return updated;
    });

    showToast('Added to Bag', `${product.name} (${selectedSize})`, 'success');
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      syncCartToFirebase(updated);
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => {
      const updated = prev.filter((_, i) => i !== index);
      syncCartToFirebase(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    syncCartToFirebase([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const toggleWishlist = (productId: string) => {
    setWishlistIds(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(
        exists ? 'Removed from Favorites' : 'Saved to Favorites',
        exists ? 'Item removed from wishlist' : 'Item added to your wishlist',
        'info'
      );
      syncWishlistToFirebase(updated);
      return updated;
    });

    if (user) {
      WishlistService.toggleWishlist(user.id, productId).catch(() => {});
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  const loginAsDemoAdmin = async () => {
    const adminUser: User = {
      id: 'user-admin',
      email: 'admin@habeshathreads.com',
      fullName: 'Sara Tadesse (Admin)',
      phone: '+251 911 234 567',
      role: 'ADMIN',
      addresses: [
        {
          id: 'addr-1',
          street: 'Bole Road, Around Friendship',
          city: 'Addis Ababa',
          region: 'Addis Ababa',
          isDefault: true
        }
      ]
    };
    setUser(adminUser);
    const { FirestoreUserDataService } = await import('../services/firebaseService.js');
    const userData = await FirestoreUserDataService.getUserData(adminUser.id);
    setCart(userData.cart);
    setWishlistIds(userData.wishlist);
    showToast('Admin Mode Enabled', 'Logged in as Sara Tadesse (Admin)', 'success');
    setIsAuthModalOpen(false);
  };

  const loginAsDemoUser = async () => {
    const custUser: User = {
      id: 'user-customer',
      email: 'user@habeshathreads.com',
      fullName: 'Dawit Abebe',
      phone: '+251 912 876 543',
      role: 'USER',
      addresses: [
        {
          id: 'addr-2',
          street: 'Kazanchis, Near ECA',
          city: 'Addis Ababa',
          region: 'Addis Ababa',
          isDefault: true
        }
      ]
    };
    setUser(custUser);
    const { FirestoreUserDataService } = await import('../services/firebaseService.js');
    const userData = await FirestoreUserDataService.getUserData(custUser.id);
    setCart(userData.cart);
    setWishlistIds(userData.wishlist);
    showToast('Customer Mode Enabled', 'Logged in as Dawit Abebe', 'success');
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setPendingPhoneUser(null);
    setCart([]);
    setWishlistIds([]);
    localStorage.removeItem('ht_user');
    localStorage.removeItem('ht_cart');
    localStorage.removeItem('ht_wishlist');
    setIsAuthModalOpen(false);
    import('../services/firebaseService.js').then(({ FirebaseAuthService }) => {
      FirebaseAuthService.logout().catch(err => {
        console.warn('Firebase logout notice:', err);
      });
    });
    showToast('Signed Out', 'You have been logged out of your account.', 'info');
  };

  // Convert ETB to USD luxury format if USD toggle is active (1 USD ≈ 120 ETB)
  const formatPrice = (amountInBirr: number) => {
    if (currencyMode === 'USD') {
      const usd = Math.round(amountInBirr / 40); // displaying proportional luxury price in $ around $350-$450
      return `$${usd.toLocaleString()}`;
    }
    return `${amountInBirr.toLocaleString()} ETB`;
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        quickViewProduct,
        setQuickViewProduct,
        user,
        setUser,
        pendingPhoneUser,
        setPendingPhoneUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authLoading,
        authModalReason,
        setAuthModalReason,
        requireAuth,
        executePendingAction,
        loginAsDemoAdmin,
        loginAsDemoUser,
        logout,
        toasts,
        showToast,
        removeToast,
        formatPrice,
        currencyMode,
        setCurrencyMode,
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,
        language,
        setLanguage,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
