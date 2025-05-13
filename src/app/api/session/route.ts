import { getFirebaseAdminAuth } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


const COOKIE_NAME = process.env.COOKIE_NAME || '__session';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';


  const { token } = await req.json();
  const adminAuth = getFirebaseAdminAuth();

  if (!adminAuth) {
    return NextResponse.json(
      { error: 'Firebase Admin not available' },
      { status: 500 }
    );
  }

  try {
    const expiresIn = 60 * 60 * 1000; // 1 hour
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
  } catch (err) {
    console.error('Session creation failed:', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).delete(COOKIE_NAME);
  return NextResponse.json({ status: 'logged_out' });
}
