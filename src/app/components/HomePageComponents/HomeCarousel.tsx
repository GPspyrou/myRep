'use client';

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

export default function HomeCarousel({ houses }: Props) {
  return (
    <div className="relative w-full h-screen">
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
        {houses.map((house) => {
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

                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-white z-10">
                  <div>
                    <h2 className="text-lg sm:text-2xl font-light">{house.title}</h2>
                    <p className="mt-1 text-base sm:text-xl font-medium">
                      {house.price}€
                    </p>
                  </div>
                  <Link
                    href={`/houses/${house.id}`}
                    className="mt-3 sm:mt-0 inline-block px-4 py-2 text-sm sm:text-base font-medium border border-white text-white rounded hover:bg-white hover:text-black transition"
                  >
                    View Property
                  </Link>
                </div>

                {/* Optional: Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
