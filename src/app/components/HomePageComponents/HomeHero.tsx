// Updated HomeHeroSection.tsx
'use client';

import HomeCarousel from './HomeCarousel';
import Filters from './Filters';
import { House } from '@/app/types/house';

interface Props {
  houses: House[];
}

export default function HomeHeroSection({ houses }: Props) {
  return (
    <div className="relative w-full overflow-hidden shadow-2xl md:min-h-[1200px]">

      {/* Full-width carousel */}
      <HomeCarousel houses={houses} />

      {/* Filters overlay */}
      <div
        className="
          absolute left-1/2 bottom-0
          transform -translate-x-1/2 -translate-y-1/2
          z-20
        "
      >
        <Filters houses={houses} />
      </div>

      {/* Spacer */}
      <div className="h-[20px] sm:h-[200px] md:h-[480px]" aria-hidden="true" />
    </div>
  );
}
