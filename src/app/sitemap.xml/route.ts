// app/sitemap.xml/route.ts
import { db } from '@/app/firebase/firebaseServer';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://propertyhall.com'; // 🔁 Update if needed

  // Fetch only public house listings
  const housesQ = query(collection(db, 'houses'), where('isPublic', '==', true));
  const snapshot = await getDocs(housesQ);

  // Generate dynamic house URLs
  const houseRoutes = snapshot.docs.map(doc => {
    return `<url>
      <loc>${baseUrl}/houses/${doc.id}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  });

  // Define static routes from your NavBar + homepage
  const staticRoutes = [
    '', // homepage
    '/listings',
    '/sell-with-us',
    '/contact',
    '/login',
    '/privacy-policy',
  ].map(path => {
    return `<url>
      <loc>${baseUrl}${path}</loc>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`;
  });

  // Final XML structure
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes.join('\n')}
  ${houseRoutes.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
