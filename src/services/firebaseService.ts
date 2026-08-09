import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  EmailAuthProvider,
  linkWithCredential,
  signInWithPopup,
  AuthCredential,
  User as FirebaseUser
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  runTransaction,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase.js';
import { Order, User, CartItem } from '../types/index.js';
import { ExternalInventoryService } from './externalInventoryService.js';

// Firebase Collections
const USERS_COLLECTION = 'users';
const ORDERS_COLLECTION = 'orders';

// Utility to validate Ethiopian and international phone numbers
export const isValidPhone = (phone?: string): boolean => {
  if (!phone) return false;
  const p = phone.trim();
  if (!p) return false;
  if (
    p === '+251 911 000 000' ||
    p === '0911000000' ||
    p === '0000000000' ||
    p === '+251911000000' ||
    p === '+251 900 000 000'
  ) return false;
  return p.length >= 7;
};

// Recursively strips undefined properties to prevent Firestore setDoc/updateDoc invalid data errors
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleaned[key] = sanitizeForFirestore(value);
      }
    }
    return cleaned as T;
  }
  return data;
}

// -------------------------------------------------------------
// 1. ORDERS SERVICE (Firestore DB)
// -------------------------------------------------------------
export const FirestoreOrderService = {
  async createOrder(order: Order): Promise<Order> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, order.id);
      await setDoc(docRef, sanitizeForFirestore({
        ...order,
        createdAt: order.createdAt || new Date().toISOString()
      }));

      // Notify Central Inventory System of stock reservation
      const orderItemsToReserve = order.items.map(item => ({
        productId: item.productId || (item as any).product?.id,
        quantity: item.quantity
      })).filter(item => Boolean(item.productId));

      if (orderItemsToReserve.length > 0) {
        await ExternalInventoryService.notifyOrderPlaced(orderItemsToReserve);
      }

      return order;
    } catch (err) {
      console.error('Error creating order in Firestore:', err);
      return order;
    }
  },

  async getOrders(userId?: string): Promise<Order[]> {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      let snapshot;
      
      // If a specific real user ID is provided, query by userId first
      if (userId && userId !== 'guest' && userId !== 'user-customer' && userId !== 'user-admin') {
        try {
          const q = query(colRef, where('userId', '==', userId));
          snapshot = await getDocs(q);
        } catch {
          snapshot = await getDocs(colRef);
        }
      } else {
        snapshot = await getDocs(colRef);
      }

      const ordersList: Order[] = [];
      snapshot.forEach(docSnap => {
        ordersList.push(docSnap.data() as Order);
      });

      // If user-customer or specific userId is requested, filter in memory
      let result = ordersList;
      if (userId && userId !== 'user-admin') {
        result = ordersList.filter(o => o.userId === userId || o.customerEmail?.toLowerCase() === userId.toLowerCase());
      }

      return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.warn('Firestore getOrders warning:', err);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, sanitizeForFirestore({
      status,
      updatedAt: new Date().toISOString()
    }));
  },

  async updateOrderPayment(orderId: string, updates: {
    isPaid: boolean;
    paymentStatus: 'pending' | 'paid' | 'failed';
    status?: Order['status'];
    paymentTimestamp?: string;
    transactionRef?: string;
    paymentGatewayResponse?: string;
  }): Promise<void> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(docRef, sanitizeForFirestore({
        ...updates,
        updatedAt: new Date().toISOString()
      }));
    } catch (err) {
      console.warn('Firestore updateOrderPayment notice:', err);
    }
  },

  async getOrderByTxRef(txRef: string): Promise<Order | null> {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      const snapshot = await getDocs(colRef);
      let found: Order | null = null;
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Order;
        if (data.txRef === txRef || data.transactionRef === txRef || data.id === txRef || data.orderNumber === txRef) {
          found = data;
        }
      });
      return found;
    } catch (err) {
      console.warn('Firestore getOrderByTxRef warning:', err);
      return null;
    }
  }
};

// -------------------------------------------------------------
// 3. USER AUTHENTICATION & USERS COLLECTION (Firebase Auth + Firestore DB)
// -------------------------------------------------------------
export const FirebaseAuthService = {
  async saveUserProfile(user: User, provider: 'email_password' | 'google' | 'form' = 'email_password'): Promise<User> {
    try {
      const userDocRef = doc(db, USERS_COLLECTION, user.id);
      let existingData = {};
      try {
        const existingSnap = await getDoc(userDocRef);
        if (existingSnap.exists()) {
          existingData = existingSnap.data();
        }
      } catch (fsErr) {
        console.warn('saveUserProfile Firestore read notice:', fsErr);
      }

      const profileToSave: User = {
        ...(existingData as any),
        ...user,
        authProvider: provider,
        signupMethod: provider === 'google' ? 'GOOGLE_POPUP' : 'EMAIL_FORM',
        updatedAt: new Date().toISOString()
      };

      try {
        await setDoc(userDocRef, {
          ...profileToSave,
          createdAt: (existingData as any).createdAt || new Date().toISOString()
        }, { merge: true });
      } catch (fsErr) {
        console.warn('saveUserProfile Firestore write notice:', fsErr);
      }

      return profileToSave;
    } catch (err) {
      console.warn('saveUserProfile catch notice:', err);
      return user;
    }
  },

  async registerWithEmail(email: string, pass: string, fullName: string, phone: string): Promise<User> {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = userCred.user;
    const role: 'ADMIN' | 'USER' = email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';

    const userProfile: User = {
      id: fbUser.uid,
      email: fbUser.email || email,
      fullName: fullName || email.split('@')[0],
      phone: phone || '',
      role,
      authProvider: 'email_password',
      signupMethod: 'EMAIL_FORM',
      addresses: [
        {
          id: 'addr-1',
          street: 'Addis Ababa Central',
          city: 'Addis Ababa',
          region: 'Addis Ababa',
          isDefault: true
        }
      ]
    };

    // Save profile to Firestore users collection if available
    try {
      await setDoc(doc(db, USERS_COLLECTION, fbUser.uid), {
        ...userProfile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (fsErr) {
      console.warn('Firestore user registration setDoc notice:', fsErr);
    }

    return userProfile;
  },

  async loginWithEmail(email: string, pass: string): Promise<User> {
    const userCred = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = userCred.user;

    const role: 'ADMIN' | 'USER' = email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const fallbackUser: User = {
      id: fbUser.uid,
      email: fbUser.email || email,
      fullName: fbUser.displayName || email.split('@')[0],
      phone: '',
      role,
      authProvider: 'email_password',
      signupMethod: 'EMAIL_FORM',
      addresses: []
    };

    // Attempt fetching user profile from Firestore
    try {
      const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        if (!data.authProvider) {
          await updateDoc(userDocRef, { authProvider: 'email_password', signupMethod: 'EMAIL_FORM' }).catch(() => {});
        }
        return { ...data, authProvider: data.authProvider || 'email_password' };
      }

      await setDoc(userDocRef, {
        ...fallbackUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).catch(() => {});
    } catch (fsErr) {
      console.warn('Firestore doc fetch notice during email login:', fsErr);
    }

    return fallbackUser;
  },

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // 1. Authenticate with Firebase Google Auth Popup
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    const role: 'ADMIN' | 'USER' = (fbUser.email || '').toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const googleUser: User = {
      id: fbUser.uid,
      email: fbUser.email || 'google_user@habeshathreads.com',
      fullName: fbUser.displayName || 'Habesha Customer',
      phone: fbUser.phoneNumber || '',
      role,
      authProvider: 'google',
      signupMethod: 'GOOGLE_POPUP',
      addresses: []
    };

    // 2. Sync profile to Firestore if available without throwing error if Firestore DB is offline/uninitialized
    try {
      const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        return { ...data, authProvider: 'google' };
      }

      await setDoc(userDocRef, {
        ...googleUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (fsErr) {
      console.warn('Firestore doc sync notice during Google login:', fsErr);
    }

    return googleUser;
  },

  async linkGoogleAccount(email: string, pass: string, pendingGoogleCred: AuthCredential): Promise<User> {
    const userCred = await signInWithEmailAndPassword(auth, email, pass);
    let linkedFbUser = userCred.user;

    try {
      const linkResult = await linkWithCredential(linkedFbUser, pendingGoogleCred);
      linkedFbUser = linkResult.user;
    } catch (linkErr: any) {
      console.warn('Google credential linking warning:', linkErr);
      if (linkErr.code !== 'auth/credential-already-in-use') {
        throw linkErr;
      }
    }

    const role: 'ADMIN' | 'USER' = (linkedFbUser.email || email).toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const updatedUser: User = {
      id: linkedFbUser.uid,
      email: linkedFbUser.email || email,
      fullName: linkedFbUser.displayName || email.split('@')[0],
      phone: linkedFbUser.phoneNumber || '',
      role,
      authProvider: 'google',
      signupMethod: 'EMAIL_AND_GOOGLE',
      addresses: []
    };

    try {
      const userDocRef = doc(db, USERS_COLLECTION, linkedFbUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as User;
        const merged: User = { ...data, authProvider: 'google', signupMethod: 'EMAIL_AND_GOOGLE' };
        await updateDoc(userDocRef, { authProvider: 'google', signupMethod: 'EMAIL_AND_GOOGLE' }).catch(() => {});
        return merged;
      }
      await setDoc(userDocRef, {
        ...updatedUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }).catch(() => {});
    } catch (fsErr) {
      console.warn('Firestore sync notice during Google link:', fsErr);
    }

    return updatedUser;
  },

  async linkPasswordToCurrentUser(pass: string): Promise<User> {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('No authenticated user found to link password.');
    }
    const emailCred = EmailAuthProvider.credential(currentUser.email, pass);
    const linkRes = await linkWithCredential(currentUser, emailCred);
    const fbUser = linkRes.user;

    try {
      const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
      await updateDoc(userDocRef, { signupMethod: 'EMAIL_AND_GOOGLE' }).catch(() => {});
      const docSnap = await getDoc(userDocRef).catch(() => null);
      if (docSnap && docSnap.exists()) {
        return docSnap.data() as User;
      }
    } catch (fsErr) {
      console.warn('Firestore update notice during password link:', fsErr);
    }

    return {
      id: fbUser.uid,
      email: fbUser.email || '',
      fullName: fbUser.displayName || 'Customer',
      phone: fbUser.phoneNumber || '',
      role: (fbUser.email || '').toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
      authProvider: 'email_password',
      signupMethod: 'EMAIL_AND_GOOGLE',
      addresses: []
    };
  },

  async updateUserPhone(uid: string, phone: string): Promise<void> {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, {
      phone,
      updatedAt: new Date().toISOString()
    });
  },

  async logout(): Promise<void> {
    await firebaseSignOut(auth);
  },

  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        callback(null);
        return;
      }
      try {
        const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          callback(docSnap.data() as User);
        } else {
          callback({
            id: fbUser.uid,
            email: fbUser.email || '',
            fullName: fbUser.displayName || 'Habesha User',
            phone: '',
            role: (fbUser.email || '').toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
            authProvider: fbUser.providerData.some(p => p.providerId === 'google.com') ? 'google' : 'email_password',
            signupMethod: fbUser.providerData.some(p => p.providerId === 'google.com') ? 'GOOGLE_POPUP' : 'EMAIL_FORM',
            addresses: []
          });
        }
      } catch (e) {
        console.warn('Error fetching auth user profile from Firestore:', e);
      }
    });
  }
};

// -------------------------------------------------------------
// 4. USER BAG & FAVORITES DATA SERVICE (Firestore DB)
// -------------------------------------------------------------
export const FirestoreUserDataService = {
  async getUserData(userId: string): Promise<{ cart: CartItem[]; wishlist: string[] }> {
    if (!userId) return { cart: [], wishlist: [] };
    try {
      const userDocRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          cart: Array.isArray(data.cart) ? data.cart : [],
          wishlist: Array.isArray(data.wishlist) ? data.wishlist : (Array.isArray(data.wishlistIds) ? data.wishlistIds : [])
        };
      }
      return { cart: [], wishlist: [] };
    } catch (err) {
      console.warn('Error fetching user bag/favorites from Firestore:', err);
      return { cart: [], wishlist: [] };
    }
  },

  async saveUserCart(userId: string, cart: CartItem[]): Promise<void> {
    if (!userId) return;
    try {
      const userDocRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(userDocRef, {
        cart,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Error saving user cart to Firestore:', err);
    }
  },

  async saveUserWishlist(userId: string, wishlist: string[]): Promise<void> {
    if (!userId) return;
    try {
      const userDocRef = doc(db, USERS_COLLECTION, userId);
      await setDoc(userDocRef, {
        wishlist,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Error saving user wishlist to Firestore:', err);
    }
  },

  subscribeToUserData(userId: string, onUpdate: (data: { cart: CartItem[]; wishlist: string[] }) => void) {
    if (!userId) return () => {};
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    return onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onUpdate({
          cart: Array.isArray(data.cart) ? data.cart : [],
          wishlist: Array.isArray(data.wishlist) ? data.wishlist : (Array.isArray(data.wishlistIds) ? data.wishlistIds : [])
        });
      }
    }, (error) => {
      console.warn('UserData snapshot notice:', error);
    });
  }
};

// -------------------------------------------------------------
// 5. PRODUCT REVIEWS & USER RATINGS SERVICE (Firestore DB)
// -------------------------------------------------------------
export const FirestoreReviewService = {
  async addReview(reviewData: {
    productId: string;
    userId: string;
    userName: string;
    userEmail?: string;
    rating: number;
    comment: string;
  }) {
    try {
      const reviewColRef = collection(db, 'reviews');
      const reviewDocRef = doc(reviewColRef);
      const newReview = {
        id: reviewDocRef.id,
        productId: reviewData.productId,
        userId: reviewData.userId || 'anonymous',
        userName: reviewData.userName || 'Anonymous Habesha',
        userEmail: reviewData.userEmail || '',
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // 1. Store individual review in 'reviews' collection
      await setDoc(reviewDocRef, newReview);

      // 2. Fetch all reviews for product to calculate average rating
      const q = query(collection(db, 'reviews'), where('productId', '==', reviewData.productId));
      const snap = await getDocs(q);
      const reviewsList: any[] = [];
      snap.forEach(d => reviewsList.push(d.data()));

      const reviewCount = reviewsList.length;
      const avgRating = reviewCount > 0
        ? Number((reviewsList.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviewCount).toFixed(1))
        : Number(reviewData.rating);

      // 3. Update user profile document in Firestore with user rating history
      if (reviewData.userId && reviewData.userId !== 'anonymous') {
        const userDocRef = doc(db, USERS_COLLECTION, reviewData.userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const userRatings = Array.isArray(userData.ratings) ? userData.ratings : [];
          userRatings.unshift({
            reviewId: newReview.id,
            productId: reviewData.productId,
            rating: newReview.rating,
            comment: newReview.comment,
            createdAt: newReview.createdAt
          });
          await updateDoc(userDocRef, {
            ratings: userRatings,
            updatedAt: new Date().toISOString()
          });
        }
      }

      return newReview;
    } catch (err) {
      console.warn('Firestore review storage notice:', err);
      return {
        id: `rev-${Date.now()}`,
        productId: reviewData.productId,
        userId: reviewData.userId,
        userName: reviewData.userName,
        userEmail: reviewData.userEmail,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        createdAt: new Date().toISOString().split('T')[0]
      };
    }
  },

  async getProductReviews(productId: string) {
    try {
      const q = query(collection(db, 'reviews'), where('productId', '==', productId));
      const snap = await getDocs(q);
      const reviewsList: any[] = [];
      snap.forEach(d => reviewsList.push(d.data()));
      return reviewsList;
    } catch (err) {
      console.warn('Firestore getProductReviews notice:', err);
      return [];
    }
  }
};

