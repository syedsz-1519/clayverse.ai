/**
 * Firebase Configuration
 * Initializes Firebase services for Clayverse AI
 * 
 * Services:
 * - Authentication (Email/Password, Social logins)
 * - Firestore Database (Real-time user data sync)
 * - Cloud Storage (User avatars, certificates)
 * - Analytics (Event tracking)
 */

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  type Auth,
  connectAuthEmulator
} from 'firebase/auth';
import { 
  getFirestore, 
  type Firestore,
  connectFirestoreEmulator,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { 
  getStorage, 
  type FirebaseStorage,
  connectStorageEmulator
} from 'firebase/storage';
import { 
  getAnalytics, 
  type Analytics,
  logEvent 
} from 'firebase/analytics';

/**
 * Firebase Configuration
 * Load from environment variables for security
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

/**
 * Validate Firebase Configuration
 * Ensure all required keys are present
 */
function validateFirebaseConfig() {
  const requiredKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

  if (missingKeys.length > 0) {
    console.warn(
      '⚠️ Firebase Configuration Warning:',
      `Missing keys: ${missingKeys.join(', ')}`,
      'Add these to your .env file for full functionality'
    );
    return false;
  }

  return true;
}

// Validate configuration on module load
const isConfigValid = validateFirebaseConfig();

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

try {
  // Initialize Firebase App
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');

  // Initialize Authentication
  auth = getAuth(app);
  console.log('✅ Firebase Authentication initialized');

  // Initialize Firestore
  firestore = getFirestore(app);
  
  // Enable offline persistence (for web)
  // This allows Firestore to work offline and sync when online
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(firestore).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('Browser does not support offline persistence');
      }
    });
  }
  console.log('✅ Firestore Database initialized');

  // Initialize Cloud Storage
  storage = getStorage(app);
  console.log('✅ Cloud Storage initialized');

  // Initialize Analytics (if app ID is provided)
  if (firebaseConfig.appId && typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized');
  }

  /**
   * Development Environment: Use Emulators
   * Comment out for production
   */
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
    try {
      // Auth Emulator
      if (!auth.currentUser && auth.app.automaticDataCollectionEnabled) {
        connectAuthEmulator(auth, 'http://localhost:9099');
        console.log('🔧 Using Firebase Auth Emulator');
      }

      // Firestore Emulator
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      console.log('🔧 Using Firestore Emulator');

      // Storage Emulator
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('🔧 Using Storage Emulator');
    } catch (error) {
      console.warn('Could not connect to Firebase Emulators:', error);
    }
  }

} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw new Error('Firebase could not be initialized. Please check your configuration.');
}

/**
 * Export configured Firebase services
 */
export { app, auth, firestore, storage, analytics, isConfigValid };

/**
 * Utility function to log analytics events
 */
export function logClayverseEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (analytics) {
    logEvent(analytics, eventName, {
      ...eventParams,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Type definitions for Firebase services
 */
export type { FirebaseApp, Auth, Firestore, FirebaseStorage, Analytics };

/**
 * Configuration check helper
 */
export function isFirebaseReady(): boolean {
  return isConfigValid && !!app && !!auth && !!firestore && !!storage;
}

/**
 * Get Firebase service status
 */
export function getFirebaseStatus() {
  return {
    app: !!app,
    auth: !!auth,
    firestore: !!firestore,
    storage: !!storage,
    analytics: !!analytics,
    configValid: isConfigValid,
    ready: isFirebaseReady(),
  };
}
