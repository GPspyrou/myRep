// lib/firebaseAdmin.ts
import { cert, getApps, initializeApp, getApp, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let firebaseAdminAuth: Auth | null = null;
let firebaseAdminDB: Firestore | null = null;

function initializeFirebaseAdmin(): App | null {
  if (!getApps().length) {
    const serviceAccount = {
      projectId: process.env.ADMIN_PROJECT_ID,
      clientEmail: process.env.ADMIN_CLIENT_EMAIL,
      privateKey: process.env.ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    console.log('Initializing Firebase Admin SDK:', serviceAccount ? '✓ key loaded' : '✗ missing private key');

    if (!serviceAccount) {
      console.error('❌ Missing Firebase Admin SDK environment variables');
      return null;
    }

    const app = initializeApp({
      credential: cert(serviceAccount),
    });

    firebaseAdminAuth = getAuth(app);
    firebaseAdminDB = getFirestore(app);
    return app;
  } else {
    const app = getApp();
    firebaseAdminAuth = firebaseAdminAuth || getAuth(app);
    firebaseAdminDB = firebaseAdminDB || getFirestore(app);

    return app;
  }
}

export function getFirebaseAdminAuth(): Auth {
  if (!firebaseAdminAuth) {
    const app = initializeFirebaseAdmin();
    if (!app || !firebaseAdminAuth) {
      throw new Error('Firebase Admin Auth could not be initialized.');
    }
  }
  return firebaseAdminAuth;
}

export function getFirebaseAdminDB(): Firestore {
  if (!firebaseAdminDB) {
    const app = initializeFirebaseAdmin();
    if (!app || !firebaseAdminDB) {
      throw new Error('Firebase Admin DB could not be initialized.');
    }
  }
  return firebaseAdminDB;
}
