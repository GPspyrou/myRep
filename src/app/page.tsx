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

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
      <div className="bg-white min-h-screen">
        <HomeHeroSection houses={houses} />

        <section className="w-full shadow-lg bg-[#e9e5dd]">
          <div className="max-w-7xl mx-auto p-12">
            <h1 className="text-4xl text-center text-[#361e1a] mb-8">
              Featured Properties For Sale
            </h1>
            <HomeHouseGrid houses={houses} />
          </div>
        </section>

        <section className="bg-[#D6D2C4] shadow-lg rounded-md">
          <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-4xl text-[#361e1a] text-center mb-8">
              Featured Rental Properties
            </h1>
            <HomeHouseGrid houses={houses} />
          </div>
        </section>

        {/* Buy With Us */}
        <div className="w-full bg-white shadow-lg py-16 px-4 sm:px-6 lg:px-12">
          <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 p-6">
              <h1 className="text-5xl font-medium text-[#361e1a] mb-4">
                Discover Your Ideal Property
              </h1>
              <h2 className="text-2xl font-bold text-[#361e1a] mb-4">
                Whether you're searching for your dream home or the perfect investment, we're here every step of the way.
              </h2>
              <p className="text-[26px] text-[#361e1a] mb-6">
                Our dedicated team provides expert guidance on current market trends, property valuations, and strategic negotiation techniques to help you secure the ideal property at the best possible value. Let us simplify your buying experience and make your property dreams a reality.
              </p>
              <button className="px-6 py-3 border border-[#361e1a] text-[#361e1a] font-medium rounded-md hover:bg-[#361e1a] hover:text-white transition">
                Explore Our Listings
              </button>
            </div>
            <div className="md:w-1/2 p-6">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/propertyhall-31280.appspot.com/o/istockphoto-1483031614-1024x1024.jpg?alt=media"
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
                src="https://firebasestorage.googleapis.com/v0/b/propertyhall-31280.appspot.com/o/istockphoto-1469939366-612x612.jpg?alt=media"
                alt="Property showcase"
                width={1000}
                height={1000}
                className="w-full h-auto shadow-md rounded-md object-cover"
                priority
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h1 className="text-5xl font-medium text-[#361e1a] mb-4">
                Sell Your Property with Confidence
              </h1>
              <p className="text-[26px] text-[#361e1a] mb-6">
                Selling your home doesn’t have to be stressful. With our expert guidance, you’ll enjoy comprehensive support including accurate market analysis, precise property valuations, professional styling tips, tailored marketing strategies, and skilled negotiations designed to secure the best possible price. Let us handle the complexities while you experience a smooth, rewarding selling journey.
              </p>
              <button className="px-6 py-3 border border-[#361e1a] text-[#361e1a] font-medium rounded-md hover:bg-[#361e1a] hover:text-white transition">
                View Pricing Options
              </button>
            </div>
          </div>
        </div>

        <InvestGreece />
        <FAQ items={faqItems} />
        
      </div>
    </>
  );
}
