// src/app/components/DetailsPageComponents/DetailsMap.tsx
'use client';

import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useMemo } from 'react';

interface DetailsMapProps {
  location: {
    latitude: number | string;
    longitude: number | string;
  };
  title: string;
}

export default function DetailsMap({
  location: { latitude, longitude },
  title,
}: DetailsMapProps) {
  // 1️⃣ Always call hooks at the top level
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // 2️⃣ Then derive memoized values
  const lat = useMemo(() => Number(latitude), [latitude]);
  const lng = useMemo(() => Number(longitude), [longitude]);

  // 3️⃣ Guard invalid coordinates
  if (isNaN(lat) || isNaN(lng)) {
    console.error('DetailsMap: Invalid lat/lng:', latitude, longitude);
    return (
      <div className="w-full h-full flex items-center justify-center">
        Invalid location
      </div>
    );
  }

  // 4️⃣ Handle load states
  if (loadError) {
    return <div>Error loading map</div>;
  }
  if (!isLoaded) {
    return <div>Loading map…</div>;
  }

  // 5️⃣ Render the map once loaded and valid
  return (
    <div className="w-full h-full relative rounded border-[1.5px] border-black overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={{ lat, lng }}
        zoom={12}
        options={{
          mapTypeId: 'hybrid',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
        }}
      >
        <Marker
          position={{ lat, lng }}
          title={title}
          icon={{
            url: '/marker.svg',                     // your custom SVG in /public
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40),
          }}
        />
      </GoogleMap>

      <a
        href={`https://www.google.com/maps?q=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-100 hover:bg-opacity-75 text-white text-sm font-medium px-3 py-1 rounded shadow transition"
      >
        View on maps
      </a>
    </div>
  );
}
