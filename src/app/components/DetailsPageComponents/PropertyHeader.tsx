'use client';

import React from 'react';

export interface PropertyHeaderProps {
  property: Record<string, any>;
  fields: string[];
}

// Default icons for known fields, with a fallback checkmark for unknown keys
const ICONS: Record<string, string> = {
  category: '🏠',
  rooms: '🛋️',
  bedrooms: '🛏️',
  bathrooms: '🛁',
  size: '🏠',
  yearBuilt: '🔨',
  energyClass: '🟩',
};
const DEFAULT_ICON = '✔️';

// Formatters for known fields; unknown fields will use a generic toString()
const FORMATTERS: Record<string, (value: any) => string> = {
  category: (v) => v,
  rooms: (v) => `${v} rooms`,
  bedrooms: (v) => `${v} bedrooms`,
  bathrooms: (v) => `${v} bathrooms`,
  size: (v) => `${v} m² liveable area`,
  yearBuilt: (v) => `Constructed in ${v}`,
  energyClass: (v) => `Energy certificate ${v}`,
};

export default function PropertyHeader({
  property,
  fields,
}: PropertyHeaderProps) {
  const { title, location, price } = property;

  // Exclude fields already displayed elsewhere
  const excludeFields = new Set(['title', 'location', 'price']);

  // Build summary items dynamically based on 'fields', excluding title/price
  const summaryItems = fields
    .filter((key) => !excludeFields.has(key) && property[key] != null)
    .map((key) => {
      const value = property[key];
      const icon = ICONS[key] ?? DEFAULT_ICON;
      const formatter = FORMATTERS[key] ?? ((v: any) => `${v}`);
      const text = formatter(value);
      return { key, icon, text };
    });

  const locationLabel = [
    property.yearBuilt ?? '',
    location?.city ?? ''
  ]
    .filter(Boolean)
    .join(' ');

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
            <span className="text-3xl font-semibold">€{price}</span>
          </div>
        </div>

        {/* Dynamic icons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {summaryItems.map((item) => (
            <div
              key={item.key}
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
