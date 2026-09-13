import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, browserLocalPersistence, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const isNewApp = !getApps().length;
export const firebaseApp = isNewApp ? initializeApp(firebaseConfig) : getApp();

export const auth = isNewApp 
  ? initializeAuth(firebaseApp, { 
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver
    })
  : getAuth(firebaseApp);

let dbInstance;
try {
  dbInstance = initializeFirestore(firebaseApp, { experimentalForceLongPolling: true }, firebaseConfigJson.firestoreDatabaseId);
} catch (e) {
  dbInstance = getFirestore(firebaseApp, firebaseConfigJson.firestoreDatabaseId);
}
export const db = dbInstance;

export const storage = getStorage(firebaseApp);
