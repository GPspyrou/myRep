'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import { House } from '@/app/types/house';

interface Props {
  houses: House[];
}

export default function HomeHeroSection({ houses }: Props) {
  const router = useRouter();
  const { ref, inView } = useInView({
       triggerOnce: true,
       threshold: 0,                     // fire on even 1px visibility
       rootMargin: '0px 0px -0px 0px'  // shrink the bottom of viewport by 200px
     });
    
  const categories = useMemo(
    () => Array.from(new Set(houses.map(h => h.category))).sort(),
    [houses]
  );
  const bedrooms = useMemo(
    () =>
      Array.from(new Set(houses.map(h => h.bedrooms))).sort(
        (a, b) => +a - +b
      ),
    [houses]
  );
  const prices = useMemo(() => {
    const all = houses
      .map(h => parseInt(h.price, 10))
      .filter(n => !isNaN(n));
    return Array.from(new Set(all)).sort((a, b) => a - b);
  }, [houses]);

  const [mode, setMode] = useState<'sale' | 'rental'>('sale');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [refName, setRefName] = useState('');
  const [bedroom, setBedroom] = useState('');

  const handleApply = () => {
    const params = new URLSearchParams();
    params.set('mode', mode);
    if (category) params.set('category', category);
    if (bedroom) params.set('bedrooms', bedroom);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (refName) params.set('ref', refName);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div>
      {/* Carousel */}
      <div className="relative w-full h-[60vh] md:h-screen">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop
          className="w-full h-full"
        >
          {houses.map(house => {
            const img = house.images?.[0];
            return (
              <SwiperSlide key={house.id}>
                <div className="relative w-full h-full overflow-hidden">
                  {img ? (
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100 h-full">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-white z-10 space-y-2 sm:space-y-0">
                    <div>
                      <h2 className="text-base sm:text-xl md:text-2xl font-light">
                        {house.title}
                      </h2>
                      <p className="mt-1 text-sm sm:text-lg md:text-xl font-medium">
                        {house.price}€
                      </p>
                    </div>
                    <Link
                      href={`/houses/${house.id}`}
                      className="mt-2 sm:mt-0 inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium border border-white text-white rounded hover:bg-white hover:text-black transition"
                    >
                      View Property
                    </Link>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
    
        {/* Search Property overlay at bottom of carousel (shown after filters in view) */}
        {inView && (
          <div className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-sm md:max-w-md p-4 pointer-events-none z-20">
            <div className="bg-black/70 backdrop-blur-sm border-2 border-white py-3 px-4 sm:px-6 text-white pointer-events-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center">
                Search Property
              </h2>
            </div>
          </div>
        )}
      </div>

      {/* Filters below carousel */}
      <div
        ref={ref}
        className={`mt-8 transition-all shadow-md duration-300 ease-out transform ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Sale/Rental Tabs */}
        <div className="mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg flex justify-center border-b-2 border-pink-200">
          {(['sale', 'rental'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 sm:px-6 py-2 font-medium tracking-widest uppercase ${
                mode === m
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-300'
              } text-sm sm:text-base`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Filter Form */}
        <div className="mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg bg-white px-4 sm:px-6 pt-6 pb-8 shadow-sm">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleApply();
            }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4"
          >
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full sm:w-40 border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
            >
              <option value="">Type</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              className="w-full sm:w-32 border border-gray-300 rounded-md px-3 py-2\tbg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
            >
              <option value="">Min Price</option>
              {prices.map(p => (
                <option key={p} value={p}>
                  {p} €
                </option>
              ))}
            </select>

            <select
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="w-full sm:w-32 border border-gray-300 rounded-md px-3 py-2\tbg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
            >
              <option value="">Max Price</option>
              {prices.map(p => (
                <option key={p} value={p}>
                  {p} €
                </option>
              ))}
            </select>

            <input
              type="text"
              value={refName}
              onChange={e => setRefName(e.target.value)}
              placeholder="Ref. or Name"
              className="w-full sm:w-48\tborder border-gray-300 rounded-md px-3 py-2\tbg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
            />

            <select
              value={bedroom}
              onChange={e => setBedroom(e.target.value)}
              className="w-full sm:w-32\tborder border-gray-300 rounded-md px-3 py-2\tbg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
            >
              <option value="">Bedrooms</option>
              {bedrooms.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <div className="w-full flex justify-center mt-6">
              <button
                type="submit"
                className="px-8 sm:px-10 py-3 font-medium rounded-md bg-[rgb(184,161,125)] text-white text-lg tracking-wide hover:bg-white hover:text-black hover;border hover;border-black transition-all duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}