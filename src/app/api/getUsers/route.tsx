import { NextResponse } from 'next/server';
import { getFirebaseAdminAuth, verifySessionCookie } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET() {
  const cookie = (await cookies()).get('__session')?.value;
  if (!cookie) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const decoded = await verifySessionCookie(cookie);
  if (decoded.role !== 'admin') 
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const auth = getFirebaseAdminAuth();
  const list = await auth.listUsers();
  const users = list.users.map(u => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
  }));
  return NextResponse.json({ users });
}
