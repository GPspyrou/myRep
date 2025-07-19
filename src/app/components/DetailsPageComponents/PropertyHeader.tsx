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

function capitalizeField(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

const DEFAULT_ICON = <CheckCircleIcon className="w-5 h-5 text-gray-400" />;

const ICONS: Record<string, React.ReactNode> = {
  category: <HomeIcon className="w-5 h-5 text-gray-400" />,
  rooms: <BuildingOffice2Icon className="w-5 h-5 text-gray-400" />,
  bedrooms: <Squares2X2Icon className="w-5 h-5 text-gray-400" />,
  bathrooms: <Cog6ToothIcon className="w-5 h-5 text-gray-400" />,
  size: <HomeIcon className="w-5 h-5 text-gray-400" />,
  yearBuilt: <CalendarIcon className="w-5 h-5 text-gray-400" />,
  energyClass: <BoltIcon className="w-5 h-5 text-gray-400" />,
  listingType: <TagIcon className="w-5 h-5 text-gray-400" />,
};

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

  const locationLabel = [property.yearBuilt ?? '', location?.city ?? '']
    .filter(Boolean)
    .join(' • ');

  return (
    <div className="w-full mx-auto text-gray-900">

      {/* Title / Price */}
      <div className="flex flex-col font-cormorant lg:flex-row lg:items-center  justify-between mb-10 gap-6">
        <div>
          <h1 className="text-6xl md:text-4xl tracking-tight mb-1">
            {title}
          </h1>
          <p className="text-sm text-gray-500">{locationLabel}</p>
        </div>

        <div className="mt-2 lg:mt-0">
          <span className="text-6xl font-cormorant font-semibold text-primary">
            €{price}
          </span>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryItems.map((item) => (
          <div
            key={item.key}
            className="flex items-start gap-3 p-0 sm:p-4 sm:rounded-md sm:bg-gray-50 sm:border sm:border-gray-200 sm:hover:border-gray-300 sm:hover:shadow-sm transition-all duration-200"
          >
            {/* Icon + Text */}
            <div className="w-6 h-6 flex items-center justify-center">
              {item.icon}
            </div>
            <div className="text-sm text-gray-800 leading-snug">
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
