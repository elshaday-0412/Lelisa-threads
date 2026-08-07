import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
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

// -------------------------------------------------------------
// 1. ORDERS SERVICE (Firestore DB)
// -------------------------------------------------------------
export const FirestoreOrderService = {
  async createOrder(order: Order): Promise<Order> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, order.id);
      await setDoc(docRef, {
        ...order,
        createdAt: order.createdAt || new Date().toISOString()
      });

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
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  }
};

// -------------------------------------------------------------
// 3. USER AUTHENTICATION & USERS COLLECTION (Firebase Auth + Firestore DB)
// -------------------------------------------------------------
export const FirebaseAuthService = {
  async saveUserProfile(user: User, provider: 'email_password' | 'google' | 'form' = 'email_password'): Promise<User> {
    const userDocRef = doc(db, USERS_COLLECTION, user.id);
    const existingSnap = await getDoc(userDocRef);
    const existingData = existingSnap.exists() ? existingSnap.data() : {};

    const profileToSave: User = {
      ...existingData,
      ...user,
      authProvider: provider,
      signupMethod: provider === 'google' ? 'GOOGLE_POPUP' : 'EMAIL_FORM',
      updatedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, {
      ...profileToSave,
      createdAt: existingData.createdAt || new Date().toISOString()
    }, { merge: true });

    return profileToSave;
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

    // Save profile to Firestore users collection
    await setDoc(doc(db, USERS_COLLECTION, fbUser.uid), {
      ...userProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return userProfile;
  },

  async loginWithEmail(email: string, pass: string): Promise<User> {
    const userCred = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = userCred.user;

    // Fetch user profile from Firestore
    const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as User;
      if (!data.authProvider) {
        await updateDoc(userDocRef, { authProvider: 'email_password', signupMethod: 'EMAIL_FORM' }).catch(() => {});
      }
      return { ...data, authProvider: data.authProvider || 'email_password' };
    }

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

    await setDoc(userDocRef, {
      ...fallbackUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return fallbackUser;
  },

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const fbUser = result.user;

    const userDocRef = doc(db, USERS_COLLECTION, fbUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as User;
      return { ...data, authProvider: 'google' };
    }

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

    await setDoc(userDocRef, {
      ...googleUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return googleUser;
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

