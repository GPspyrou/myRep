import { getFirebaseAdminAuth } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = process.env.COOKIE_NAME || '__session';

// POST  => createSessionCookie
export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const adminAuth = getFirebaseAdminAuth();
  if (!adminAuth) {
    return NextResponse.json({ error: 'Firebase Admin not available' }, { status: 500 });
  }
  try {
    const expiresIn = 60 * 60 * 1000; // 1h
    const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });
    (await cookies()).set({
      name: COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresIn / 1000,
      sameSite: 'lax',
    });
    return NextResponse.json({ status: 'authenticated' });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

// GET   => verifySessionCookie (for your navbar)
export async function GET() {
  const adminAuth = getFirebaseAdminAuth();
  if (!adminAuth) {
    return NextResponse.json({ error: 'Firebase Admin not available' }, { status: 500 });
  }
  const sessionCookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: 'No session cookie' }, { status: 401 });
  }
  try {
    await adminAuth.verifySessionCookie(sessionCookie, true);
    return NextResponse.json({ status: 'ok' });
  } catch {
    return NextResponse.json({ error: 'Session invalid or expired' }, { status: 401 });
  }
}

// DELETE => clear the cookie
export async function DELETE() {
  (await cookies()).delete(COOKIE_NAME);
  return NextResponse.json({ status: 'logged_out' });
}
