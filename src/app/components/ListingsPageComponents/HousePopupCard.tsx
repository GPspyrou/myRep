'use client';

import Image from 'next/image';
import { House } from '@/app/types/house'; // Ensure this path is correct

type HousePopupCardProps = {
  house: House;
};

export default function HousePopupCard({ house }: HousePopupCardProps) {
  return (
    <div className="relative w-72 h-64 rounded-xl overflow-hidden shadow-lg fade-in-popup border-2 border-black">
      <Image
        src={house.images[0]?.src || '/placeholder.jpg'}
        alt={house.title}
        fill
        className="object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-gradient-to-t from-black/90 via-black/70 to-transparent">
        <h3 className="text-xl font-semibold truncate">{house.title}</h3>
        <p className="mt-1 text-lg font-bold">{house.price}</p>
        {house.bedrooms != null && house.bathrooms != null && (
          <p className="mt-2 text-sm">
            {house.bedrooms} bd • {house.bathrooms} ba • {house.size} sqft
          </p>
        )}
        <button
          onClick={() => window.open(`/houses/${house.id}`, '_blank')}
          className="mt-4 w-full py-2 text-center bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
        >
          View Details
        </button>
      </div>
      {/* Styles are kept local to this component */}
      <style jsx>{`
        .fade-in-popup {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
