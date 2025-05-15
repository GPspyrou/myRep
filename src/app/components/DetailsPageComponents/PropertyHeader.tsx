'use client';

import React from 'react';
import {
  HomeIcon,
  TagIcon,
  BuildingOffice2Icon,
  Squares2X2Icon,
  Cog6ToothIcon,
  CalendarIcon,
  BoltIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export interface PropertyHeaderProps {
  property: Record<string, any>;
  fields: string[];
}

// Capitalize and space out camelCase or PascalCase keys
function capitalizeField(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

const DEFAULT_ICON = <CheckCircleIcon className="w-6 h-6 text-gray-700" />;

// Default icons for known fields
const ICONS: Record<string, React.ReactNode> = {
  category: <HomeIcon className="w-6 h-6 text-gray-700" />,
  rooms: <BuildingOffice2Icon className="w-6 h-6 text-gray-700" />,
  bedrooms: <Squares2X2Icon className="w-6 h-6 text-gray-700" />,
  bathrooms: <Cog6ToothIcon className="w-6 h-6 text-gray-700" />,
  size: <HomeIcon className="w-6 h-6 text-gray-700" />,
  yearBuilt: <CalendarIcon className="w-6 h-6 text-gray-700" />,
  energyClass: <BoltIcon className="w-6 h-6 text-gray-700" />,
  listingType: <TagIcon className="w-6 h-6 text-gray-700" />,
};

// Formatters for known fields
const FORMATTERS: Record<string, (value: any) => string> = {
  category: (v) => v,
  rooms: (v) => `${v} rooms`,
  bedrooms: (v) => `${v} bedrooms`,
  bathrooms: (v) => `${v} bathrooms`,
  size: (v) => `${v} m² liveable area`,
  yearBuilt: (v) => `Constructed in ${v}`,
  energyClass: (v) => `Energy certificate ${v}`,
  listingType: (v) =>
    v === 'sale'
      ? 'Offer Type: For Sale'
      : v === 'rent'
      ? 'Offer Type: For Rent'
      : `Offer Type: ${capitalizeField(v)}`,
};

export default function PropertyHeader({
  property,
  fields,
}: PropertyHeaderProps) {
  const { title, location, price } = property;

  const excludeFields = new Set(['title', 'location', 'price']);

  const summaryItems = fields
    .filter((key) => !excludeFields.has(key) && property[key] != null)
    .map((key) => {
      const value = property[key];
      const icon = ICONS[key] ?? DEFAULT_ICON;
      const formatter = FORMATTERS[key];
      const text = formatter
        ? formatter(value)
        : `${capitalizeField(key)}: ${value}`;

      return { key, icon, text };
    });

  const locationLabel = [
    property.yearBuilt ?? '',
    location?.city ?? ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
      <div className="w-full mx-auto ">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="mb-20">
            <h1 className="text-4xl  text-gray-900 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{locationLabel}</p>
          </div>
          <div className="mt-10 mr-7 ">
            <span className="text-2xl font-semibold md:text-3xl font-medium text-black">
              €{price}
            </span>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1  gap-3 sm:gap-4">
          {summaryItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-black shadow-2xl transition-shadow duration-200"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-sm font-semibold text-gray-800">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

  );
}
