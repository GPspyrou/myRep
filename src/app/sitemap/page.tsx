// app/sitemap/page.tsx
import Link from 'next/link';
import { Metadata } from 'next';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';

// Prevent search engines from indexing this utility page
export const metadata: Metadata = {
  title: 'Sitemap - Property Hall',
  robots: { index: false, follow: true },
};

export default async function SitemapPage() {
  const baseUrl = '';
  const now = new Date().toISOString();

  // Fetch public house listings via Admin SDK
  const db = getFirebaseAdminDB();
  const snapshot = await db.collection('houses').where('isPublic', '==', true).get();

  // Static routes
  const staticRoutes = [
    { path: '/', label: 'Home' },
    { path: '/listings', label: 'Listings' },
    { path: '/sell-with-us', label: 'Sell With Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/login', label: 'Login' },
  ];

  // Dynamic property routes
  const houseRoutes = snapshot.docs.map(doc => {
    const data = doc.data() as { title?: string };
    return { path: `/houses/${doc.id}`, label: data.title ?? doc.id };
  });

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Sitemap</h1>

      <ul className="space-y-2">
        {staticRoutes.map(route => (
          <li key={route.path}>
            <Link href={route.path} className="text-blue-600 hover:underline">
              {route.label}
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Property Listings</h2>
        <ul className="ml-4 list-disc space-y-1">
          {houseRoutes.map(route => (
            <li key={route.path}>
              <Link href={route.path} className="text-blue-600 hover:underline">
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
