import NavBar from '@/app/lib/NavBar';
import ListingsClientWrapper from '@/app/components/ListingsPageComponents/ListingsClientWrapper';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { verifyIdTokenFromCookie } from '@/app/components/ListingsPageComponents/verify-token'; // utility you'll need to add
import { House } from '@/app/types/house';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RawSearchParams = Partial<{
  category: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
}>;

export default async function SecureListingsPage({
  searchParams,
}: {
  searchParams: RawSearchParams;
}) {
  const db = getFirebaseAdminDB();
  if (!db) throw new Error('Firebase Admin DB not initialized.');

  const {
    category,
    bedrooms: bStr,
    minPrice: minStr,
    maxPrice: maxStr,
  } = searchParams;
  const bedrooms = bStr ? parseInt(bStr, 10) : undefined;
  const minPrice = minStr ? parseInt(minStr, 10) : undefined;
  const maxPrice = maxStr ? parseInt(maxStr, 10) : undefined;

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
        ...data.location,
        latitude: Number(data.location.latitude),
        longitude: Number(data.location.longitude),
      },
      isAdditional: false,
    };
  });

  // In-memory filters
  publicHouses = publicHouses.filter(h => {
    const hBedrooms = typeof h.bedrooms === 'string' ? parseInt(h.bedrooms, 10) : h.bedrooms;
    const hPrice = parseInt(h.price, 10);

    return (!category || h.category === category) &&
      (bedrooms === undefined || hBedrooms === bedrooms) &&
      (minPrice === undefined || hPrice >= minPrice) &&
      (maxPrice === undefined || hPrice <= maxPrice);
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

  const allHouses = [...publicHouses, ...userHouses];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavBar />
      <ListingsClientWrapper initialHouses={allHouses} />
    </div>
  );
}
