// src/app/components/DetailsPageComponents/PropertyHeader.tsx
'use client';

import React from 'react';

export interface PropertyHeaderProps {
  title: string;
  locationLabel: string;
  price: string;
  category?: string;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt?: string;
  size?: string;           // e.g. "120"
  energyClass?: string;    // e.g. "A"
}

export default function PropertyHeader({
  title,
  locationLabel,
  price,
  category,
  rooms,
  bedrooms,
  bathrooms,
  yearBuilt,
  size,
  energyClass,
}: PropertyHeaderProps) {
  // Build an array of only the items that have a value
  const summaryItems = [
    category && { icon: '🏠',          text: category },
    rooms     && { icon: '🛋️',         text: `${rooms} rooms` },
    bedrooms  && { icon: '🛏️',         text: `${bedrooms} bedrooms` },
    bathrooms && { icon: '🛁',         text: `${bathrooms} bathrooms` },
    size      && { icon: '🏠',          text: `${size} m² liveable area` },
    yearBuilt && { icon: '🔨',         text: `Construction year ${yearBuilt}` },
    energyClass && {
      icon: '🟩',
      text: `Energy certificate ${energyClass}`,
    },
  ].filter(Boolean) as { icon: string; text: string }[];

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Title + subtitle + price */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="text-gray-500 mt-1">{locationLabel}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-3xl font-semibold">{price}</span>
          </div>
        </div>

        {/* Icons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {summaryItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2 text-gray-700"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
