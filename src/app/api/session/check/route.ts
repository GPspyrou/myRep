// app/api/session/check/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getFirebaseAdminAuth } from '@/app/lib/firebaseAdmin';

const COOKIE_NAME = process.env.COOKIE_NAME || '__session';

export async function GET() {
  const sessionCookie = (await cookies()).get(COOKIE_NAME)?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const auth = getFirebaseAdminAuth();
    await auth.verifySessionCookie(sessionCookie, true); // true = check revocation
    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }
}
