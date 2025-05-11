import NavBar from '@/app/lib/NavBar';
import ListingsClientWrapper from '@/app/components/ListingsPageComponents/ListingsClientWrapper';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { verifyIdTokenFromCookie } from '@/app/components/ListingsPageComponents/verify-token';
import { House } from '@/app/types/house';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RawSearchParams = Partial<{
  mode: 'sale' | 'rental';
  category: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  ref: string;
}>;

export default async function SecureListingsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const { mode, category, bedrooms: bStr, minPrice: minStr, maxPrice: maxStr, ref: refParam } = await searchParams;
  const bedrooms = bStr ? parseInt(bStr, 10) : undefined;
  const minPrice = minStr ? parseInt(minStr, 10) : undefined;
  const maxPrice = maxStr ? parseInt(maxStr, 10) : undefined;
  const refSearch = refParam ? refParam.toLowerCase() : undefined;

  const db = getFirebaseAdminDB();
  if (!db) throw new Error('Firebase Admin DB not initialized.');

  // Fetch public houses
  const snapshot = await db
    .collection('houses')
    .where('isPublic', '==', true)
    .get();

  let publicHouses: House[] = snapshot.docs.map(doc => {
    const data = doc.data() as House;
    return {
      ...data,
      id: doc.id,
      location: {
        latitude: Number(data.location.latitude),
        longitude: Number(data.location.longitude),
      },
      isAdditional: false,
    };
  });

  // Check user auth via cookie and get additional user-specific houses
  let userHouses: House[] = [];
  const cookieStore = cookies();
  const token = (await cookieStore).get('__session')?.value;

  if (token) {
    const userId = await verifyIdTokenFromCookie(token);
    if (userId) {
      const userSnap = await db
        .collection('houses')
        .where('userId', '==', userId)
        .get();

      userHouses = userSnap.docs.map(doc => {
        const data = doc.data() as House;
        return {
          ...data,
          id: doc.id,
          location: {
            latitude: Number(data.location.latitude),
            longitude: Number(data.location.longitude),
          },
          isAdditional: true,
        };
      });
    }
  }

  // Combine all houses
  let allHouses: House[] = [...publicHouses, ...userHouses];

  // Apply filters to all houses
  allHouses = allHouses.filter(h => {
    const hBedrooms = typeof h.bedrooms === 'string' ? parseInt(h.bedrooms, 10) : h.bedrooms;
    const hPrice = parseInt(h.price, 10);
    const matchesMode = !mode || h.listingType === mode;
    const matchesCategory = !category || h.category === category;
    const matchesBedrooms = bedrooms === undefined || hBedrooms === bedrooms;
    const matchesMinPrice = minPrice === undefined || (!isNaN(hPrice) && hPrice >= minPrice);
    const matchesMaxPrice = maxPrice === undefined || (!isNaN(hPrice) && hPrice <= maxPrice);
    const matchesRef = !refSearch || (h.title && h.title.toLowerCase().includes(refSearch));

    return matchesMode && matchesCategory && matchesBedrooms && matchesMinPrice && matchesMaxPrice && matchesRef;
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavBar />
      <ListingsClientWrapper initialHouses={allHouses} />
    </div>
  );
}