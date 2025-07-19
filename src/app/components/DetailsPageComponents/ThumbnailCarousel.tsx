'use client';

import { useState, useEffect, forwardRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import { motion } from 'framer-motion';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/free-mode';
import Modal from './Modal';

export interface GalleryImage {
  src: string;
  alt: string;
}

interface ThumbnailCarouselProps {
  images: GalleryImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  swiperRef: React.MutableRefObject<any>;
}

const ThumbnailCarousel = forwardRef(function ThumbnailCarousel(
  { images, selectedIndex, onSelect, swiperRef }: ThumbnailCarouselProps,
  _ref
) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(selectedIndex);

  useEffect(() => {
    swiperRef.current?.slideToLoop(selectedIndex, 600);
  }, [selectedIndex, swiperRef]);

  return (
    <div className="w-full h-full bg-white py-4 px-4 sm:px-6 rounded">
      {/* Arrow Controls */}
      <div className="flex justify-end items-center mb-4 gap-2">
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="px-3 py-1 text-sm text-black lg:text-inherit bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
      >
        ← Prev
      </button>

      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="px-3 py-1 text-sm text-black lg:text-inherit bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
      >
        Next →
      </button>
      </div>

      {/* Swiper */}
      <Swiper
        onSwiper={(s) => (swiperRef.current = s)}
        freeMode
        spaceBetween={16}
        loop={images.length > 1}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          1024: { slidesPerView: 4 },
        }}
        modules={[FreeMode]}
        className="w-full"
      >
        {images.map((img, idx) => {
          return (
            <SwiperSlide key={idx}>
              <motion.div
                custom={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3, root: swiperRef.current?.el }}
                onClick={() => {
                  setModalIndex(idx);
                  setIsModalOpen(true);
                  onSelect(idx);
                }}
                className="relative w-full aspect-square cursor-pointer overflow-hidden rounded shadow hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  loading="eager"
                  className="object-cover"
                />
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Modal Viewer */}
      <Modal
        isOpen={isModalOpen}
        image={images[modalIndex]}
        onClose={() => setIsModalOpen(false)}
        onPrev={() => setModalIndex((prev) => (prev - 1 + images.length) % images.length)}
        onNext={() => setModalIndex((prev) => (prev + 1) % images.length)}
      />
    </div>
  );
});

export default ThumbnailCarousel;