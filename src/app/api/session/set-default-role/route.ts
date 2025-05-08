// src/app/api/session/set-default-role/route.ts
import { getFirebaseAdminAuth } from '@/app/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
 

  const body = await req.json().catch(() => ({}));
  const { uid } = body as { uid?: string };

  if (!uid) {
    return NextResponse.json(
      { error: 'Missing uid in request body' },
      { status: 400 }
    );
  }

  const adminAuth = getFirebaseAdminAuth();
  if (!adminAuth) {
    return NextResponse.json(
      { error: 'Firebase Admin not available' },
      { status: 500 }
    );
  }

  const defaultRole = 'public'; // or use process.env.DEFAULT_ROLE

  try {
    await adminAuth.setCustomUserClaims(uid, { role: defaultRole });
    return NextResponse.json(
      { message: `Default role set to ${defaultRole}` }
    );
  } catch (err) {
    console.error('Error setting default role:', err);
    return NextResponse.json(
      { error: 'Failed to set default role' },
      { status: 500 }
    );
  }
}
