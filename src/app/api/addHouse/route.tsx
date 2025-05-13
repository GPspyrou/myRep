import { NextResponse } from 'next/server';
import { getFirebaseAdminDB, verifySessionCookie } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';


export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';


  
  const cookie = (await cookies()).get('__session')?.value;
  if (!cookie) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const decoded = await verifySessionCookie(cookie);
  if (decoded.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const db = getFirebaseAdminDB();
  const body = await req.json();

  const { id: incomingId, title, listingType, ...houseData } = body;

  if (!listingType || (listingType !== 'sale' && listingType !== 'rental')) {
    return NextResponse.json({ error: 'Invalid or missing listingType' }, { status: 400 });
  }

  const counterKey = listingType === 'sale' ? 'sale' : 'rental';
  const prefix = listingType === 'sale' ? 'S' : 'R';

  let docId: string | null = null;

  try {
    await db.runTransaction(async (transaction) => {
      const counterRef = db.collection('counters').doc(counterKey);
      const counterSnap = await transaction.get(counterRef);

      if (!counterSnap.exists) {
        throw new Error(`Counter for ${listingType} does not exist. Please initialize it in Firestore.`);
      }
      const counterData = counterSnap.data();
      const current = counterData?.current;

      if (typeof current !== 'number') {
        throw new Error(`Invalid counter value for ${listingType}`);
      }

      const next = current + 1;
      docId = `${prefix}${next.toString().padStart(4, '0')}`;

      transaction.update(counterRef, { current: next });
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error during ID generation';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  if (!docId) {
    return NextResponse.json({ error: 'Failed to generate document ID' }, { status: 500 });
  }

  await db.collection('houses').doc(docId).set({
    id: docId,
    title,
    listingType,
    ...houseData,
  });

  return NextResponse.json({ id: docId });
}
