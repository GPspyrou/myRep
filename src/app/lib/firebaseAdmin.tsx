// src/lib/firebaseAdmin.ts
import {
  cert,
  getApps,
  initializeApp,
  getApp,
  App,
  ServiceAccount
} from 'firebase-admin/app';
import {
  getAuth,
  Auth,
  DecodedIdToken
} from 'firebase-admin/auth';
import {
  getFirestore,
  Firestore
} from 'firebase-admin/firestore';

let firebaseAdminAuth: Auth | null = null;
let firebaseAdminDB: Firestore | null = null;

function initializeFirebaseAdmin(): App {
  if (!getApps().length) {
    const serviceAccount: ServiceAccount = {
      projectId:     process.env.ADMIN_PROJECT_ID!,
      clientEmail:   process.env.ADMIN_CLIENT_EMAIL!,
      privateKey:    process.env.ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n")
    };

    initializeApp({
      credential: cert(serviceAccount)
    });
  }
  return getApp();
}

// Lazily initialize / cache Auth and Firestore
export function getFirebaseAdminAuth(): Auth {
  if (!firebaseAdminAuth) {
    const app = initializeFirebaseAdmin();
    firebaseAdminAuth = getAuth(app);
  }
  return firebaseAdminAuth;
}

export function getFirebaseAdminDB(): Firestore {
  if (!firebaseAdminDB) {
    const app = initializeFirebaseAdmin();
    firebaseAdminDB = getFirestore(app);
  }
  return firebaseAdminDB;
}

/**
 * Verify a Firebase session cookie (the one you set on /api/session)
 * @param sessionCookie the raw cookie value from `cookies().get('__session')?.value`
 * @returns the decoded ID token (with uid, email, customClaims, etc), or throws
 */
export async function verifySessionCookie(
  sessionCookie: string
): Promise<DecodedIdToken> {
  // The second parameter checks that the cookie hasn't been revoked.
  return await getFirebaseAdminAuth().verifySessionCookie(
    sessionCookie,
    /* checkRevoked= */ true
  );
}

/**
 * (Optional) Verify a plain ID token (if you ever need it instead of session cookies)
 */
export async function verifyIdToken(
  idToken: string
): Promise<DecodedIdToken> {
  return await getFirebaseAdminAuth().verifyIdToken(idToken, /* checkRevoked= */ true);
}
