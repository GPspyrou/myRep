// app/houses/[id]/page.js

import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getFirebaseAdminAuth, getFirebaseAdminDB } from '@/app/lib/firebaseAdmin'
import NavBar from '@/app/lib/NavBar'
import DetailsContent from '@/app/components/DetailsPageComponents/DetailsContent'

export const metadata = {
  title: 'Property Details',
}

export default async function PropertyPage({ params }) {
  const adminDb = getFirebaseAdminDB()
  if (!adminDb) {
    console.error('[PropertyPage] Firebase Admin DB not initialized')
    throw new Error('Internal server error')
  }

  const { id } = params

  let houseSnap
  try {
    houseSnap = await adminDb.collection('houses').doc(id).get()
  } catch (err) {
    console.error('[PropertyPage] Error fetching document:', err)
    notFound()
  }

  if (!houseSnap.exists) {
    console.warn('[PropertyPage] House not found:', id)
    notFound()
  }

  const houseData = houseSnap.data()

  const renderContent = () => (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1">
        <DetailsContent property={houseData} />
      </div>
    </div>
  )

  // 2. Public → show
  if (houseData.isPublic) {
    return renderContent()
  }

  // 3. Private → check session cookie
  const sessionCookie = cookies().get('__session')?.value
  if (!sessionCookie) {
    console.warn('[PropertyPage] No session cookie, redirecting to login')
    return redirect('/login')
  }

  const adminAuth = getFirebaseAdminAuth()
  if (!adminAuth) {
    console.error('[PropertyPage] Firebase Admin Auth not initialized')
    throw new Error('Internal server error')
  }

  let decoded
  try {
    decoded = await adminAuth.verifySessionCookie(sessionCookie, true)
  } catch (err) {
    console.error('[PropertyPage] Invalid session cookie:', err)
    return redirect('/login')
  }

  const { uid, role } = decoded || {}
  if (!uid) {
    console.error('[PropertyPage] Missing UID in decoded cookie:', decoded)
    return redirect('/login')
  }

  // 4a. Admins always see it
  if (role === 'admin') {
    return renderContent()
  }

  // Sanity-check allowedUsers
  if (
    !Array.isArray(houseData.allowedUsers) ||
    !houseData.allowedUsers.every((x) => typeof x === 'string')
  ) {
    console.error(
      '[PropertyPage] Invalid allowedUsers array:',
      houseData.allowedUsers
    )
    return redirect('/login')
  }

  // 4b. Otherwise must be in allowedUsers[]
  if (houseData.allowedUsers.includes(uid)) {
    return renderContent()
  }

  // 5. No access
  console.warn(
    '[PropertyPage] UID not in allowedUsers, redirecting:',
    uid,
    houseData.allowedUsers
  )
  return redirect('/login')
}
