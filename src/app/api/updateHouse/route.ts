import { NextResponse } from 'next/server';
import { getFirebaseAdminDB, verifySessionCookie } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function PUT(req: Request) {
  const cookie = (await cookies()).get('__session')?.value;
  if (!cookie) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const decoded = await verifySessionCookie(cookie);
  if (decoded.role !== 'admin') 
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, ...houseData } = await req.json();
  const db = getFirebaseAdminDB();
  await db.collection('houses').doc(id).update(houseData);
  return NextResponse.json({ success: true });
}
