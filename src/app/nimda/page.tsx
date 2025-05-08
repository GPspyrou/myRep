// src/app/admin/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/app/lib/firebaseAdmin';
import AdminDashboard from '@/app/components/AdminPageComponents/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Read session cookie synchronously
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get('__session')?.value;
  if (!sessionCookie) {
    return redirect('/login');
  }

  try {
    const decoded = await verifySessionCookie(sessionCookie);
    if (decoded.role !== 'admin') {
      return redirect('/unauthorized');
    }
  } catch (error) {
    // Invalid or expired cookie
    return redirect('/login');
  }

  return <AdminDashboard />;
}
