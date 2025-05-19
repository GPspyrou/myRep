import NavBar from '@/app/lib/NavBar';
import ListingsClientWrapper from '@/app/components/ListingsPageComponents/ListingsClientWrapper';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { cookies } from 'next/headers';
import { verifyIdTokenFromCookie } from '@/app/components/ListingsPageComponents/verify-token';
import { House } from '@/app/types/house';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const metadata = {
  robots: 'noindex, follow',
};

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
  // 1. Read and parse the filters from the URL
  const {
    mode,
    category,
    bedrooms: bStr,
    minPrice: minStr,
    maxPrice: maxStr,
    ref: refParam,
  } = await searchParams;

  const bedrooms  = bStr    ? parseInt(bStr,   10) : undefined;
  const minPrice  = minStr  ? parseInt(minStr, 10) : undefined;
  const maxPrice  = maxStr  ? parseInt(maxStr, 10) : undefined;
  const refSearch = refParam ? refParam.toLowerCase() : undefined;

  // Detect whether *any* filter was provided
  const noFiltersApplied =
    !mode &&
    !category &&
    bedrooms === undefined &&
    minPrice === undefined &&
    maxPrice === undefined &&
    !refSearch;

  // 2. Fetch public houses
  const db = getFirebaseAdminDB();
  if (!db) throw new Error('Firebase Admin DB not initialized.');

  const publicSnap = await db
    .collection('houses')
    .where('isPublic', '==', true)
    .get();

  const publicHouses: House[] = publicSnap.docs.map((doc) => {
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

  // 3. Optionally fetch user-specific (non-public) houses
  let userHouses: House[] = [];
  const token = (await cookies()).get('__session')?.value;
  if (token) {
    const userId = await verifyIdTokenFromCookie(token);
    if (userId) {
      const userSnap = await db
        .collection('houses')
        .where('allowedUsers', 'array-contains', userId)
        .where('isPublic', '==', false)
        .get();

      userHouses = userSnap.docs.map((doc) => {
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

  // 4. Combine them
  let allHouses = [...publicHouses, ...userHouses];

  // 5. If any filters were applied, run the filter logic
  if (!noFiltersApplied) {
    allHouses = allHouses.filter((h) => {
      const hBedrooms =
        typeof h.bedrooms === 'string'
          ? parseInt(h.bedrooms, 10)
          : h.bedrooms;
      const hPrice = parseInt(h.price, 10);

      const matchesMode     = !mode      || h.listingType === mode;
      const matchesCategory = !category  || h.category === category;
      const matchesBeds     = bedrooms === undefined || hBedrooms === bedrooms;
      const matchesMin      = minPrice === undefined || (!isNaN(hPrice) && hPrice >= minPrice);
      const matchesMax      = maxPrice === undefined || (!isNaN(hPrice) && hPrice <= maxPrice);
      const matchesRef = !refSearch || 
      h.title.toLowerCase().includes(refSearch) ||
      h.id.toLowerCase().includes(refSearch);


      return (
        matchesMode &&
        matchesCategory &&
        matchesBeds &&
        matchesMin &&
        matchesMax &&
        matchesRef
      );
    });
  }


  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      <NavBar />
      <ListingsClientWrapper initialHouses={allHouses} />
    </div>
  );
}