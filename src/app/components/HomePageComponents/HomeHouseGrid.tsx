// Updated HomeHouseGrid.tsx with responsive enhancements
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { House } from '@/app/types/house';
import { motion } from 'framer-motion';

type HouseGridProps = {
  houses: House[];
};

export default function HomeHouseGrid({ houses }: HouseGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {houses.slice(0, 6).map((house, index) => (
        <motion.div
          key={house.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-[#FAF9F6] transition-shadow duration-200 hover:shadow-lg"
        >
          <Link href={`/houses/${house.id}`}>  
            <div className="relative w-full h-48 sm:h-56 md:h-64 cursor-pointer">
              <Image
                src={house.images[0]?.src || '/placeholder.jpg'}
                alt={house.images[0]?.alt || house.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </Link>

          <div className="p-3 sm:p-4 md:p-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-1">
              {house.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-2">
              {house.price}€
            </p>
            <div className="flex flex-wrap items-center text-gray-600 text-sm sm:text-base mb-4 space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                  <Image src="/icons/m2.svg" alt="m²" fill className="object-contain" />
                </div>
                <span className="font-bold text-sm sm:text-base">
                  {house.size}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                  <Image src="/icons/bedroom.svg" alt="Bedrooms" fill className="object-contain" />
                </div>
                <span className="font-bold text-sm sm:text-base">
                  {house.bedrooms}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 relative">
                  <Image src="/icons/bathroom.svg" alt="Bathrooms" fill className="object-contain" />
                </div>
                <span className="font-bold text-sm sm:text-base">
                  {house.bathrooms}
                </span>
              </div>
            </div>

            <Link
              href={`/houses/${house.id}`}
              className="block w-full text-center py-2 text-sm sm:text-base font-medium border border-[rgb(184,161,125)] bg-[rgb(184,161,125)] text-white rounded transition-colors duration-200 hover:bg-white hover:text-black hover:border-black"
            >
              View Property
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
