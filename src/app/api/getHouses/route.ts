// app/api/getHouses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseAdminDB, verifySessionCookie } from '@/app/lib/firebaseAdmin';
import { getToken } from 'firebase/app-check';

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
    const userRole = decodedToken.role || 'user'; // fallback in case no role

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

    const houses = snapshot.docs.map((doc: { id: any; data: () => any; }) => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ houses });
  } catch (error: any) {
    console.error('[getHouses] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch houses.' },
      { status: 500 }
    );
  }
}
