import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  // Cart state from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ht_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ht_wishlist');
    return saved ? JSON.parse(saved) : ['hb-001', 'hb-003', 'jw-001'];
  });

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
    localStorage.setItem('ht_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ht_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ht_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ht_user');
    }
  }, [user]);

  // Seed / Sync Firebase Firestore DB on initial mount
  useEffect(() => {
    import('../services/firebaseService.js').then(({ FirestoreInventoryService, FirebaseAuthService, isValidPhone }) => {
      FirestoreInventoryService.seedProductsIfEmpty().catch(err => {
        console.warn('Firestore initialization notice:', err);
      });

      const unsubscribe = FirebaseAuthService.onAuthChange(authUser => {
        if (authUser) {
          if (isValidPhone(authUser.phone)) {
            setUser(authUser);
            setPendingPhoneUser(null);
          } else {
            // User authenticated in Firebase but lacks valid phone number!
            // Do NOT log into AppContext automatically. Store in pendingPhoneUser and open AuthModal.
            setUser(null);
            setPendingPhoneUser(authUser);
            setIsAuthModalOpen(true);
          }
        } else {
          setUser(null);
          setPendingPhoneUser(null);
        }
      });
      return () => unsubscribe();
    }).catch(e => {
      console.warn('Firebase Service load notice:', e);
    });
  }, []);

  const showToast = (title: string, message = '', type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast_${Date.now()}`;
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

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [...prev, { product, quantity: qty, selectedSize, selectedColor }];
      }
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
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
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
      return updated;
    });

    if (user) {
      WishlistService.toggleWishlist(user.id, productId).catch(() => {});
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.includes(productId);

  const loginAsDemoAdmin = () => {
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
    showToast('Admin Mode Enabled', 'Logged in as Sara Tadesse (Admin)', 'success');
    setIsAuthModalOpen(false);
  };

  const loginAsDemoUser = () => {
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
    showToast('Customer Mode Enabled', 'Logged in as Dawit Abebe', 'success');
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setPendingPhoneUser(null);
    localStorage.removeItem('ht_user');
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
