'use client';

import Head from 'next/head';
import Link from 'next/link';
import { db } from '@/app/firebase/firebaseServer';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default async function SitemapPage() {
  const staticRoutes = [
    { path: '/', label: 'Home' },
    { path: '/listings', label: 'Listings' },
    { path: '/sell-with-us', label: 'Sell With Us' },
    { path: '/contact', label: 'Contact' },
    { path: '/login', label: 'Login' },
  ];

  const housesQ = query(collection(db, 'houses'), where('isPublic', '==', true));
  const snapshot = await getDocs(housesQ);
  const houseRoutes = snapshot.docs.map(doc => ({
    path: `/houses/${doc.id}`,
    label: (doc.data() as any).title || doc.id,
  }));

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
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

          <li className="mt-6 text-xl font-semibold">Property Listings</li>
          <ul className="ml-4 list-disc space-y-1">
            {houseRoutes.map(route => (
              <li key={route.path}>
                <Link href={route.path} className="text-blue-600 hover:underline">
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </ul>
      </main>
    </>
  );
}
