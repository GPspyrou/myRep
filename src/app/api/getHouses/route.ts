import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDB, verifySessionCookie } from '@/app/lib/firebaseAdmin';
import { applyRateLimit } from '@/app/lib/LargeRateLimiter';

export async function GET(req: NextRequest) {
  
  try {
    const sessionCookie = req.cookies.get('__session')?.value;

    if (!sessionCookie) {
      console.log('[getHouses] Missing session cookie.');
      return NextResponse.json(
        { error: 'User must be authenticated.' },
        { status: 401 }
      );
    }

    const decodedToken = await verifySessionCookie(sessionCookie);
    const db = getFirebaseAdminDB();
    const userRole = decodedToken.role || 'user';

    let snapshot;

    if (userRole === 'admin') {
      console.log('[getHouses] Admin request. Fetching all houses.');
      snapshot = await db.collection('houses').get();
    } else {
      console.log('[getHouses] Non-admin request. Fetching allowed private houses.');
      snapshot = await db
        .collection('houses')
        .where('isPublic', '==', false)
        .where('allowedUsers', 'array-contains', decodedToken.uid)
        .get();
    }

    const houses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  
    return NextResponse.json({ houses });
  } catch (error: any) {
    console.error('[getHouses] Error:', error.code, error.message);
    if (error.code && error.code.includes('auth/')) {
      return NextResponse.json({ error: 'Authentication error: Invalid or expired session.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch houses.' }, { status: 500 });
  }
}