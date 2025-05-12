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
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
                {title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{locationLabel}</p>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-medium text-gray-800">
                €{price}
              </span>
            </div>
          </div>
    
          {/* Feature Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {summaryItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-black shadow-2xl transition-shadow duration-200"
              >
                <span className="text-2xl text-gray-700">{item.icon}</span>
                <span className="text-sm text-gray-800">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
    
}
