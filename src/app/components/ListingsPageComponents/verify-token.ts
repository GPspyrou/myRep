import { verifySessionCookie } from '@/app/lib/firebaseAdmin';

export async function verifyIdTokenFromCookie(cookieValue: string): Promise<string | null> {
  try {
    const decoded = await verifySessionCookie(cookieValue);
    return decoded.uid;
  } catch (error) {
    console.error('Invalid Firebase session cookie:', error);
    return null;
  }
}
