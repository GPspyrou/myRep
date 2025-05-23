'use client';

import { useState } from 'react';
import HouseGridWrapper from '@/app/components/ListingsPageComponents/HouseGridWrapper';
import ClientMapWrapper from '@/app/components/ListingsPageComponents/ClientMapWrapper';
import { House } from '@/app/types/house';

type Props = {
  initialHouses: House[];
};

export default function ListingsContent({ initialHouses }: Props) {
  const [houses] = useState(initialHouses);
  const [viewState, setViewState] = useState(() => {
    if (initialHouses.length) {
      const h = initialHouses[0];
      return {
        latitude: Number(h.location.latitude),
        longitude: Number(h.location.longitude),
        zoom: 12,
      };
    }
    return { latitude: 0, longitude: 0, zoom: 2 };
  });

  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  if (houses.length === 0) return <div>No houses found.</div>;

  return (
    <div className="flex flex-col md:flex-row  flex-1 overflow-hidden">
      <div className="flex-1 md:flex-[0.95] overflow-y-scroll  scrollbar-hide p-6 pt-20 bg-[#e9e5dd] sm:mt-10 relative shadow-[10px_0px_20px_rgba(0,0,0,0.15)] z-20 mt-[50px]">
        <HouseGridWrapper
          houses={houses}
          onHover={(house) => {
            setSelectedHouse(house);
            if (house) {
              setViewState({
                latitude: Number(house.location.latitude),
                longitude: Number(house.location.longitude),
                zoom: 15,
              });
            }
          }}
        />
        <div className="pointer-events-none absolute top-0 -right-2 w-5 h-full bg-gradient-to-l from-[rgba(0,0,0,0.15)] to-transparent" />
      </div>
      <div className="hidden md:flex md:flex-1 h-full relative z-10">
        <ClientMapWrapper
          houses={houses}
          viewState={viewState}
          selectedHouse={selectedHouse}
          setViewState={setViewState}
          setSelectedHouse={setSelectedHouse}
        />
      </div>
    </div>
  );
}
