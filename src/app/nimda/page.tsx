// src/app/admin/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionCookie } from '@/app/lib/firebaseAdmin';
import AdminDashboard from '@/app/components/AdminPageComponents/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookie = (await cookies()).get('__session')?.value;
  if (!cookie) return redirect('/login');

  try {
    const decoded = await verifySessionCookie(cookie);
    if (decoded.role !== 'admin') return redirect('/unauthorized');
  } catch {
    return redirect('/login');
  }

  return <AdminDashboard />;
}
