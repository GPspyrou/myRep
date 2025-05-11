// /app/api/listings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import * as admin from 'firebase-admin';
import { applyRateLimit } from '@/app/lib/LargeRateLimiter';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await applyRateLimit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const appCheckToken = req.headers.get('x-firebase-appcheck');

  if (!appCheckToken) {
    return NextResponse.json({ error: 'Missing App Check token' }, { status: 401 });
  }

  try {
    await admin.appCheck().verifyToken(appCheckToken);
  } catch (err) {
    console.error('Invalid App Check token', err);
    return NextResponse.json({ error: 'Invalid App Check token' }, { status: 403 });
  }

  const db = getFirebaseAdminDB();
  if (!db) return NextResponse.json({ error: 'No DB' }, { status: 500 });

  const snapshot = await db
    .collection('houses')
    .where('isPublic', '==', true)
    .get();

  const publicHouses = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));

  return NextResponse.json(publicHouses);
}
