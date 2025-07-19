'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';
import Modal from './Modal';

export interface GalleryImage {
  src: string;
  alt: string;
}
interface GalleryProps {
  images: GalleryImage[];
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainSwiperRef = useRef<any>(null);

  useEffect(() => {
    if (!mainSwiperRef.current) return;
    isModalOpen
      ? mainSwiperRef.current.autoplay.stop()
      : mainSwiperRef.current.autoplay.start();
  }, [isModalOpen]);

  const showPrev = () => {
    const prev = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prev);
    mainSwiperRef.current?.slideToLoop(prev);
  };

  const showNext = () => {
    const next = (selectedIndex + 1) % images.length;
    setSelectedIndex(next);
    mainSwiperRef.current?.slideToLoop(next);
  };

  return (
    <div className="flex flex-col items-center max-w-[100%] mx-auto bg-[#e9e5dd]">
      {/* Main Carousel */}
      <div className="w-full h-[200px] sm:h-[300px] md:h-[500px] lg:h-[800px] overflow-hidden border border-black">
        <Swiper
          onSwiper={(s) => (mainSwiperRef.current = s)}
          onSlideChange={(s) => setSelectedIndex(s.realIndex)}
          navigation
          loop
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          speed={600}
          modules={[Navigation, Autoplay]}
          className="w-full h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div onClick={() => setIsModalOpen(true)} className="w-full h-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full rounded-sm cursor-pointer"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal (still works) */}
      <Modal
        isOpen={isModalOpen}
        image={images[selectedIndex]}
        onClose={() => setIsModalOpen(false)}
        onPrev={showPrev}
        onNext={showNext}
      />
    </div>
  );
}