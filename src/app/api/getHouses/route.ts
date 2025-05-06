import { NextResponse } from 'next/server';
import { getFirebaseAdminDB, verifySessionCookie } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function GET() {
  // you can choose to make this public or protected; here we'll protect it
  const cookie = (await cookies()).get('__session')?.value;
  if (!cookie) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  // will throw if invalid or revoked
  await verifySessionCookie(cookie);

  const db = getFirebaseAdminDB();
  const snap = await db.collection('houses').get();
  const houses = snap.docs.map((d: { id: any; data: () => any; }) => ({ id: d.id, ...d.data() }));
  return NextResponse.json(houses);
}
