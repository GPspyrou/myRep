'use client';

import HomeCarousel from './HomeCarousel';
import Filters from './Filters';
import { House } from '@/app/types/house';

interface Props {
  houses: House[];
}

export default function HomeHeroSection({ houses }: Props) {
  return (
    <div className="relative w-full min-h-[1200px]  bg-[#D6D2C4] shadow-2xl  overflow-hidden">
      {/* Carousel */}
      <HomeCarousel houses={houses} />

      {/* Filters - Positioned at the bottom center of carousel */}
      <div className="absolute w-full bottom-6 pb-60 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
        <Filters houses={houses} />
      </div>
    </div>
  );
}
