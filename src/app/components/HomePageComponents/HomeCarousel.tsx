'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import { House } from '@/app/types/house';

interface Props {
  houses: House[];
}

export default function HomeCarousel({ houses }: Props) {
  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-screen">
      {/* Hide nav arrows on mobile */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .swiper-button-prev,
          .swiper-button-next {
            display: none !important;
          }
        }
      `}</style>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}           
        loop
        className="w-full h-full"
      >
        {houses.map((house) => {
          const img = house.images?.[0];
          return (
            <SwiperSlide key={house.id}>
              <div className="relative w-full h-full overflow-hidden">
                {img ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center bg-gray-100 h-full">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}

                {/* Info panel */}
                <div
                  className="
                    absolute inset-x-4 bottom-4 z-10
                    flex flex-col items-center text-center space-y-2
                    sm:flex-row sm:justify-between sm:items-center sm:text-left sm:space-y-0
                  "
                >
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-light">
                      {house.title}
                    </h2>
                    <p className="mt-1 text-base sm:text-lg md:text-xl font-medium">
                      {house.price}€
                    </p>
                  </div>

                  {/* Bottom-center on mobile, normal flow on sm+ */}
                  <Link
                    href={`/houses/${house.id}`}
                    className="
                      inline-block
                      px-4 py-2
                      text-sm sm:text-base
                      font-medium border border-white
                      text-white rounded
                      hover:bg-white hover:text-black transition

                      absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
                      sm:static sm:transform-none
                    "
                  >
                    View Property
                  </Link>
                </div>

                {/* Stronger gradient for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}