// src/lib/serverAuth.ts
import { cookies } from 'next/headers';
import { verifySessionCookie } from './firebaseAdmin';
import type { DecodedIdToken } from 'firebase-admin/auth';

export async function getCurrentUser(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await verifySessionCookie(sessionCookie);
    return decoded;
  } catch (err) {
    console.error('Invalid or expired session cookie', err);
    return null;
  }
}
