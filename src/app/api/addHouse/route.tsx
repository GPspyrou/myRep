import { NextResponse } from 'next/server';
import { getFirebaseAdminDB, verifySessionCookie } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookie = (await cookies()).get('__session')?.value;
  if (!cookie) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const decoded = await verifySessionCookie(cookie);
  if (decoded.role !== 'admin') 
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const data = await req.json();
  const { id, ...houseData } = data;
  const db = getFirebaseAdminDB();
  const ref = await db.collection('houses').add(houseData);
  return NextResponse.json({ id: ref.id });
}
