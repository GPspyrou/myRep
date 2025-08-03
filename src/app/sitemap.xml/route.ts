// app/sitemap.xml/route.ts
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';

export async function GET() {
  const baseUrl = 'https://propertyhall.com';
  const now = new Date().toISOString();

  // Fetch public house listings via Admin SDK
  const db = getFirebaseAdminDB();
  const snapshot = await db.collection('houses').where('isPublic', '==', true).get();

  // Dynamic house URLs
  const houseRoutes = snapshot.docs.map(doc => {
    const data = doc.data() as { updatedAt?: { toDate: () => Date } };
    const lastmod = data.updatedAt?.toDate().toISOString() ?? now;
    return `<url>
    <loc>${baseUrl}/houses/${doc.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Static routes
  const staticPaths = ['', '/listings', '/sell-with-us', '/contact', '/login', '/privacy-policy'];
  const staticRoutes = staticPaths.map(path => `<url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);

  // Assemble XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.join("\n")}
${houseRoutes.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Last-Modified': now,
    },
  });
}
