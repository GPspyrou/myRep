import HomeHouseGrid from '@/app/components/HomePageComponents/HomeHouseGrid';
import FAQ, { FAQItem } from '@/app/components/HomePageComponents/FAQ';
import InvestGreece from '@/app/components/HomePageComponents/InvestGreece';
import HomeHeroSection from '@/app/components/HomePageComponents/HomeHero';
import Footer from '@/app/lib/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { House } from '@/app/types/house';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Property Hall – Find Your Dream Home in Greece',
  description:
    'Browse featured properties for sale and rent in Greece. Expert guidance, transparent pricing, and a seamless experience. Start your search today!',
  openGraph: {
    title:
      'Property Hall – Browse featured properties for sale and rent in Greece. Expert guidance, transparent pricing, and a seamless experience. Start your search today!',
    description:
      'Discover beachfront villas, city apartments, and rental opportunities across Greece with Property Hall.',
    url: 'https://propertyhall.example.com/',
    images: [
      {
        url: 'https://propertyhall.example.com/og-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Greek villa overlooking the sea',
      },
    ],
    siteName: 'Property Hall | Real Estate Agency | Sales & Rentals',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Property Hall – Real Estate in Greece',
    description: 'Explore top listings for sale and rent across Greece.',
    images: ['https://propertyhall.example.com/og-hero.jpg'],
  },
  alternates: {
    canonical: 'https://propertyhall.com/home',
  },
};

export default async function HomePage() {
  // Initialize Admin Firestore
  const db = getFirebaseAdminDB();

  // Query 1: featured for sale
  const saleSnap = await db
    .collection('houses')
    .where('isPublic', '==', true)
    .where('listingType', '==', 'sale')
    .where('isFeatured', '==', true)
    .limit(6)
    .get();

  // Query 2: featured rentals
  const rentSnap = await db
    .collection('houses')
    .where('isPublic', '==', true)
    .where('listingType', '==', 'rental')
    .where('isFeatured', '==', true)
    .limit(6)
    .get();

  // Map snapshots to typed House objects
  const housesForSale: House[] = saleSnap.docs.map((doc) => {
    return { id: doc.id, ...(doc.data() as Omit<House, 'id'>) };
  });
  const rentalHouses: House[] = rentSnap.docs.map((doc) => {
    return { id: doc.id, ...(doc.data() as Omit<House, 'id'>) };
  });

  // Combine for schema and hero
  const featuredHouses = [...housesForSale, ...rentalHouses];
  const baseUrl = 'https://propertyhall.example.com';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: featuredHouses.map((h: House, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${baseUrl}/houses/${h.id}`,
    })),
  };

  // FAQ items
  const faqItems: FAQItem[] = [
    {
      question: 'What are the steps involved in buying properties for sale in Greece?',
      answer: (
        <ol className="list-decimal list-inside space-y-1">
          <li>Obtain a foreigner ID number.</li>
          <li>Open a Greek bank account.</li>
          <li>Sign a Reservation Contract & pay a deposit.</li>
          <li>Sign the private purchase contract.</li>
          <li>Complete at the Notary and pay the balance.</li>
        </ol>
      ),
    },
    {
      question: 'Do I need to be a Greek resident to buy a Greece villa for sale?',
      answer: <p>No—non-residents are free to purchase property in Greece. We’ll help you with all the paperwork.</p>,
    },
    {
      question: 'What are the advantages of investing in properties for rental income?',
      answer: <p>Greece offers year-round tourism, strong yields, and capital appreciation. You can legally rent out through the high season to maximize returns.</p>,
    },
  ];

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="bg-[#e9e5dd]  min-h-screen">
        <HomeHeroSection houses={featuredHouses} />
        
        {/* For Sale Section */}
        <section className="w-full shadow-lg bg-[#e9e5dd]">
          <div className="max-w-7xl mx-auto p-12">
            <h2 className="text-4xl text-center text-[#361e1a] mb-8">
              Featured Properties For Sale
            </h2>
            <HomeHouseGrid houses={housesForSale} />
          </div>
        </section>

        {/* Rental Section */}
        <section className="bg-[#D6D2C4] shadow-lg rounded-md">
          <div className="max-w-7xl mx-auto p-12">
            <h2 className="text-4xl text-[#361e1a] text-center mb-8">
              Featured Rental Properties
            </h2>
            <HomeHouseGrid houses={rentalHouses} />
          </div>
        </section>

        {/* Buy With Us */}
        <div className="w-full bg-white shadow-lg py-16 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-6">
              <h2 className="text-5xl font-medium font-cormorant font-bold text-[#361e1a] mb-4">
                Discover Your Ideal Property
              </h2>
              <h2 className="text-3xl  text-[#361e1a] mb-4">
                Whether you're searching for your dream home or the perfect investment, we're here every step of the way.
              </h2>
              <p className="text-2xl text-[#361e1a] mb-6">
                Our dedicated team provides expert guidance on current market trends, property valuations, and strategic negotiation techniques to help you secure the ideal property at the best possible value. Let us simplify your buying experience and make your property dreams a reality.
              </p>
              <Link href="/listings">
                <span className="inline-block px-6 py-3 border border-[#361e1a] text-[#361e1a] font-medium rounded-md hover:bg-[#361e1a] hover:text-white transition cursor-pointer">
                  Explore Our Listings
                </span>
              </Link>
            </div>
            <div className="md:w-1/2 p-6">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/propertyhall-31280.firebasestorage.app/o/istockphoto-1483031614-1024x1024.jpg?alt=media&token=dc3249b3-88b1-4dc0-a5b2-bdc5a1e2f6dd"
                alt="Luxurious living room"
                width={1000}
                height={1000}
                className="w-full h-auto shadow-md rounded-md object-cover"
                priority
              />
            </div>
          </div>
        </div>
        
        {/* Sell With Us */}
        <div className="w-full bg-[#D6D2C4] shadow-lg py-16 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-6">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/propertyhall-31280.firebasestorage.app/o/istockphoto-1469939366-612x612.jpg?alt=media&token=7cbe11b6-b42a-478e-b125-994ce45c02cb"
                alt="Property showcase"
                width={1000}
                height={1000}
                className="w-full h-auto shadow-md rounded-md object-cover"
                priority
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h2 className="text-5xl font-cormorant font-medium font-bold text-[#361e1a] mb-4">
                Sell Your Property with Confidence
              </h2>
              <p className="text-3xl text-[#361e1a] mb-6">
              Selling your home shouldn't be stressful.
              Our expert team offers valuations, styling advice, marketing, and negotiation to help you sell at the best price.
              </p>
              <p className="text-2xl text-[#361e1a] mb-6">
                We don’t just list your property—we craft a story that resonates with the right audience. Through premium visuals, elevated branding, and strategic exposure across digital and global real estate channels, we ensure your listing stands out in a competitive market.
              </p>
              
              <Link href="/sell-with-us">
                <span className="inline-block px-6 py-3 border border-[#361e1a] text-[#361e1a] font-medium rounded-md hover:bg-[#361e1a] hover:text-white transition cursor-pointer">
                  View Pricing Options
                </span>
              </Link>
            </div>
          </div>
        </div>
        
        <InvestGreece />
        <FAQ items={faqItems} />
        <Footer />
      </div>
     
    </>
  );
}
