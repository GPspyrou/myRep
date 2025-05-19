// app/sitemap.xml/route.ts
import { db } from '@/app/firebase/firebaseServer';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://propertyhall.com';

  // Fetch public house listings
  const housesQ = query(collection(db, 'houses'), where('isPublic', '==', true));
  const snapshot = await getDocs(housesQ);

  // Generate dynamic house URLs with lastmod
  const houseRoutes = snapshot.docs.map(doc => {
    const data = doc.data();
    const lastmod = data.updatedAt?.toDate().toISOString() ?? new Date().toISOString(); // fallback to now
    return `<url>
      <loc>${baseUrl}/houses/${doc.id}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
  });

  // Static routes with a hardcoded lastmod (could be dynamic if needed)
  const now = new Date().toISOString();
  const staticRoutes = [
    '', '/listings', '/sell-with-us', '/contact', '/login', '/privacy-policy',
  ].map(path => {
    return `<url>
      <loc>${baseUrl}${path}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes.join('\n')}
  ${houseRoutes.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Last-Modified': now,
    },
  });
}
