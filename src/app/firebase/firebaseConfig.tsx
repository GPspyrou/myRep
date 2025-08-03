// app/firebase/firebaseConfig.ts

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';

// Your Firebase config object
export const firebaseConfig = {
  apiKey:             process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain:         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId:          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  databaseURL:        process.env.NEXT_PUBLIC_FIREBASE_DATABASEURL!,
  storageBucket:      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId:              process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId:      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Initialize (singleton) Firebase App
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize and export SDK services
export const auth: Auth       = getAuth(app);
export const db: Firestore    = initializeFirestore(app, { experimentalForceLongPolling: true });
export const functions: Functions = getFunctions(app);

// Default-export config so it’s easy to pass into initializeApp() again
export default firebaseConfig;