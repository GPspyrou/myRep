// app/pages/index.tsx  (or wherever your HomePage lives)
 // remove this if you’re in a .tsx server component file

import HomeCarousel from '@/app/components/HomePageComponents/HomeCarousel';
import Filters from '@/app/components/HomePageComponents/Filters';
import HomeHouseGrid from '@/app/components/HomePageComponents/HomeHouseGrid';
import FAQ, { FAQItem } from '@/app/components/HomePageComponents/FAQ';
import InvestGreece from '@/app/components/HomePageComponents/InvestGreece';
import HomeHeroSection from '@/app/components/HomePageComponents/HomeHero';
import Footer from '@/app/lib/Footer';
import Image from 'next/image';
import { House } from '@/app/types/house';

// ← NEW: import your client‐SDK instance instead of the Admin one
import { db } from '@/app/firebase/firebaseServer';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const metadata: Metadata = {
  title: 'Property Hall – Find Your Dream Home in Greece',
  description:
    'Browse featured properties for sale and rent in Greece. Expert guidance, transparent pricing, and a seamless experience. Start your search today!',
  openGraph: {
    title: 'Property Hall – Your Gateway to Real Estate in Greece',
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
    siteName: 'Property Hall',
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
}

export default async function HomePage() {
  // build a Firestore query just like you would client‐side
  const housesQ = query(
    collection(db, 'houses'),
    where('isPublic', '==', true)
  );

  // run it
  const snapshot = await getDocs(housesQ);

  // map out your House[]
  const houses: House[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<House, 'id'>),
  }));
  const housesForSale = houses.filter(house => house.listingType === 'sale');
  const rentalHouses = houses.filter(house => house.listingType === 'rental');
  const baseUrl = 'https://propertyhall.example.com'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: houses.map((h, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${baseUrl}/houses/${h.id}`,
    })),
  }

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
        <HomeHeroSection houses={houses} />
        

        {/* Buy With Us */}
        <div className="w-full bg-white shadow-lg py-16 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-6">
              <h2 className="text-5xl font-medium text-[#361e1a] mb-4">
                Discover Your Ideal Property
              </h2>
              <h2 className="text-2xl font-bold text-[#361e1a] mb-4">
                Whether you're searching for your dream home or the perfect investment, we're here every step of the way.
              </h2>
              <p className="text-[26px] text-[#361e1a] mb-6">
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
              <h2 className="text-5xl font-medium text-[#361e1a] mb-4">
                Sell Your Property with Confidence
              </h2>
              <p className="text-[26px] text-[#361e1a] mb-6">
                Selling your home doesn’t have to be stressful. With our expert guidance, you’ll enjoy comprehensive support including accurate market analysis, precise property valuations, professional styling tips, tailored marketing strategies, and skilled negotiations designed to secure the best possible price. Let us handle the complexities while you experience a smooth, rewarding selling journey.
              </p>
              <Link href="/sell-with-us">
                <span className="inline-block px-6 py-3 border border-[#361e1a] text-[#361e1a] font-medium rounded-md hover:bg-[#361e1a] hover:text-white transition cursor-pointer">
                  View Pricing Options
                </span>
              </Link>
            </div>
          </div>
        </div>
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
        <InvestGreece />
        <FAQ items={faqItems} />
        
      </div>
     
    </>
  );
}
