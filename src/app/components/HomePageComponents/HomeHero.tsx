'use client';

import HomeCarousel from './HomeCarousel';
import Filters from './Filters';
import { House } from '@/app/types/house';

interface Props {
  houses: House[];
}

export default function HomeHeroSection({ houses }: Props) {
    return (
      <div className="relative w-full bg-[#D6D2C4] shadow-2xl overflow-hidden">
        {/* Carousel */}
        <HomeCarousel houses={houses} />
  
        {/* Filters */}
        {/* – on md+ screens, absolutely overlayed; on smaller, static and full width */}
        <div
          className={`
            w-full
            md:absolute md:bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 md:translate-y-1/2
            md:pb-60
            z-10
          `}
        >
          <div className="mx-auto md:w-[36%] px-4 md:px-0">
            <Filters houses={houses} />
          </div>
        </div>
      </div>
    );
  }
  