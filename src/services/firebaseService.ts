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
  runTransaction
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase.js';
import { Product, Order, User } from '../types/index.js';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts.js';

// Firebase Collections
const USERS_COLLECTION = 'users';
const PRODUCTS_COLLECTION = 'products';
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
// 1. INVENTORY & PRODUCTS SERVICE (Firestore DB)
// -------------------------------------------------------------
export const FirestoreInventoryService = {
  // Ensure default products exist in Firestore
  async seedProductsIfEmpty(): Promise<Product[]> {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(colRef);

      if (snapshot.empty) {
        console.log('Seeding initial Habesha Threads inventory to Firebase Firestore...');
        for (const prod of SAMPLE_PRODUCTS) {
          const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
          await setDoc(docRef, {
            ...prod,
            stock: prod.stock ?? 15,
            updatedAt: new Date().toISOString()
          });
        }
        return SAMPLE_PRODUCTS;
      }

      const productsList: Product[] = [];
      snapshot.forEach(docSnap => {
        productsList.push(docSnap.data() as Product);
      });
      return productsList;
    } catch (error) {
      console.warn('Firestore seed/fetch error, using fallback:', error);
      return SAMPLE_PRODUCTS;
    }
  },

  async getProducts(): Promise<Product[]> {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        return this.seedProductsIfEmpty();
      }
      const products: Product[] = [];
      snapshot.forEach(docSnap => {
        products.push(docSnap.data() as Product);
      });
      return products;
    } catch (err) {
      console.error('Error fetching products from Firestore:', err);
      return SAMPLE_PRODUCTS;
    }
  },

  async saveProduct(product: Product): Promise<Product> {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, {
      ...product,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return product;
  },

  async updateStock(productId: string, newStockQuantity: number): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      stock: newStockQuantity,
      updatedAt: new Date().toISOString()
    });
  },

  async deleteProduct(productId: string): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  }
};

// -------------------------------------------------------------
// 2. ORDERS SERVICE (Firestore DB)
// -------------------------------------------------------------
export const FirestoreOrderService = {
  async createOrder(order: Order): Promise<Order> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, order.id);
      await setDoc(docRef, {
        ...order,
        createdAt: order.createdAt || new Date().toISOString()
      });

      // Deduct inventory stock in Firestore inside transaction/update & in-memory fallback
      for (const item of order.items) {
        try {
          const targetId = item.productId || (item as any).product?.id;
          if (!targetId) continue;
          
          // Fallback in-memory SAMPLE_PRODUCTS update
          const sampleIdx = SAMPLE_PRODUCTS.findIndex(p => p.id === targetId);
          if (sampleIdx !== -1) {
            SAMPLE_PRODUCTS[sampleIdx].stock = Math.max(0, (SAMPLE_PRODUCTS[sampleIdx].stock || 15) - item.quantity);
          }

          const prodRef = doc(db, PRODUCTS_COLLECTION, targetId);
          const prodSnap = await getDoc(prodRef);
          if (prodSnap.exists()) {
            const currentStock = prodSnap.data().stock ?? 15;
            const updatedStock = Math.max(0, currentStock - item.quantity);
            await updateDoc(prodRef, {
              stock: updatedStock
            });
          }
        } catch (e) {
          console.warn('Inventory stock update error for order item:', item, e);
        }
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
      let q = query(colRef);
      if (userId && userId !== 'guest' && userId !== 'user-customer' && userId !== 'user-admin') {
        q = query(colRef, where('userId', '==', userId));
      }
      const snapshot = await getDocs(q);
      const ordersList: Order[] = [];
      snapshot.forEach(docSnap => {
        ordersList.push(docSnap.data() as Order);
      });
      return ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.error('Error fetching orders from Firestore:', err);
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
  async registerWithEmail(email: string, pass: string, fullName: string, phone: string): Promise<User> {
    const userCred = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = userCred.user;
    const role: 'ADMIN' | 'USER' = email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';

    const userProfile: User = {
      id: fbUser.uid,
      email: fbUser.email || email,
      fullName: fullName || email.split('@')[0],
      phone: phone || '+251 911 000 000',
      role,
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
      createdAt: new Date().toISOString()
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
      return docSnap.data() as User;
    }

    const role: 'ADMIN' | 'USER' = email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const fallbackUser: User = {
      id: fbUser.uid,
      email: fbUser.email || email,
      fullName: fbUser.displayName || email.split('@')[0],
      phone: '',
      role,
      addresses: []
    };

    await setDoc(userDocRef, {
      ...fallbackUser,
      createdAt: new Date().toISOString()
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
      return docSnap.data() as User;
    }

    const role: 'ADMIN' | 'USER' = (fbUser.email || '').toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const googleUser: User = {
      id: fbUser.uid,
      email: fbUser.email || 'google_user@habeshathreads.com',
      fullName: fbUser.displayName || 'Habesha Customer',
      phone: fbUser.phoneNumber || '',
      role,
      addresses: []
    };

    await setDoc(userDocRef, {
      ...googleUser,
      createdAt: new Date().toISOString()
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
            addresses: []
          });
        }
      } catch (e) {
        console.warn('Error fetching auth user profile from Firestore:', e);
      }
    });
  }
};
