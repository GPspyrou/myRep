// Updated HomePage.tsx with responsive media queries
import NavBar from '@/app/lib/NavBar';
import HomeCarousel from '@/app/components/HomePageComponents/HomeCarousel';
import Filters from '@/app/components/HomePageComponents/Filters';
import Footer from '@/app/lib/Footer';
import InvestGreece from '@/app/components/HomePageComponents/InvestGreece';
import HomeHouseGrid from '@/app/components/HomePageComponents/HomeHouseGrid';
import FAQ, { FAQItem } from '@/app/components/HomePageComponents/FAQ';
import HomeHeroSection from '@/app/components/HomePageComponents/HomeHero';
import { getFirebaseAdminDB } from '@/app/lib/firebaseAdmin';
import { House } from '@/app/types/house';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function HomePage() {
  const db = getFirebaseAdminDB();
  if (!db) throw new Error('Firebase Admin DB not initialized.');

  const snapshot = await db
    .collection('houses')
    .where('isPublic', '==', true)
    .get();

  const houses: House[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<House, 'id'>),
  }));

  const faqItems: FAQItem[] = [
    {
      question: 'What are the steps involved in buying properties for sale in Greece?',
      answer: (
        <ol className="list-decimal list-inside space-y-1 text-sm sm:text-base md:text-lg">
          <li>Obtain an foreigner ID number.</li>
          <li>Open a Greek bank account.</li>
          <li>Sign a Reservation Contract & pay deposit.</li>
          <li>Sign the private purchase contract.</li>
          <li>Complete at the Notary and pay the balance.</li>
        </ol>
      ),
    },
    {
      question: 'Do I need to be a Greek resident to buy an Greece villa for sale?',
      answer: (
        <p className="text-sm sm:text-base md:text-lg">
          No – non-residents are free to purchase property in Greece. We’ll help you with all the paperwork.
        </p>
      ),
    },
    {
      question: 'What are the advantages of investing in properties for rental income?',
      answer: (
        <p className="text-sm sm:text-base md:text-lg">
          Greece offers year-round tourism, strong yields, and capital appreciation. You can legally rent out through the high season to maximize returns.
        </p>
      ),
    },
  ];

  return (
    <>
      <NavBar />
      <main className="bg-white min-h-screen pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        {/* Hero + Filters */}
        <HomeHeroSection houses={houses} />

        {/* Featured Properties */}
        <section className="w-full shadow-lg bg-[#e9e5dd]">
          <div className="max-w-7xl mx-auto p-6 sm:p-8 md:p-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-[#361e1a] mb-6 sm:mb-8 md:mb-12">
              Featured Properties For Sale
            </h1>
            <HomeHouseGrid houses={houses} />
          </div>
        </section>

        {/* Featured Rentals */}
        <section className="w-full bg-[#D6D2C4] shadow-lg">
          <div className="max-w-7xl mx-auto p-6 sm:p-8 md:p-12 rounded-md">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#361e1a] text-center mb-6 sm:mb-8 md:mb-12">
              Featured Rental Properties
            </h2>
            <HomeHouseGrid houses={houses} />
          </div>
        </section>

        {/* Buy With Us */}
        <section className="w-full bg-white shadow-lg py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#361e1a]">
                Discover Your Ideal Property
              </h2>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#361e1a]">
                Whether you're searching for your dream home or the perfect investment,
                we're here every step of the way.
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-[#361e1a]">
                Our dedicated team provides expert guidance on current market trends, property valuations, and strategic negotiation techniques to help you secure the ideal property at the best possible value. Let us simplify your buying experience and make your property dreams a reality.
              </p>
              <button className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-medium border border-[#361e1a] text-[#361e1a] rounded-md hover:bg-[#361e1a] hover:text-white transition-all duration-200">
                Explore Our Listings
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/propertyhall-31280.firebasestorage.app/o/istockphoto-1483031614-1024x1024.jpg?alt=media&token=dc3249b3-88b1-4dc0-a5b2-bdc5a1e2f6dd"
                alt="Luxurious living room"
                width={1000}
                height={800}
                className="w-full h-auto shadow-md rounded-md object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Sell With Us */}
        <section className="w-full bg-[#D6D2C4] shadow-lg py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/propertyhall-31280.firebasestorage.app/o/istockphoto-1469939366-612x612.jpg?alt=media&token=7cbe11b6-b42a-478e-b125-994ce45c02cb"
                alt="Property showcase"
                width={1000}
                height={800}
                className="w-full h-auto shadow-md rounded-md object-cover"
                priority
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#361e1a]">
                Sell Your Property with Confidence
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-[#361e1a]">
                Selling your home doesn't have to be stressful. With our expert guidance, you'll enjoy comprehensive support including accurate market analysis, precise property valuations, professional styling tips, tailored marketing strategies, and skilled negotiations designed to secure the best possible price. Let us handle the complexities while you experience a smooth, rewarding selling journey.
              </p>
              <button className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-medium border border-[#361e1a] text-[#361e1a] rounded-md hover:bg-[#361e1a] hover:text-white transition-all duration-200">
                View Pricing Options
              </button>
            </div>
          </div>
        </section>

        {/* Invest & FAQ */}
        <InvestGreece />
        <FAQ items={faqItems} />
      </main>
      {/*<Footer />*/}
    </>
  );
}