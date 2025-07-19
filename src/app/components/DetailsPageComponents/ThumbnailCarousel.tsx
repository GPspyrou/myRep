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

const thumbVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
};

const ThumbnailCarousel = forwardRef(function ThumbnailCarousel(
  { images, selectedIndex, onSelect, swiperRef }: ThumbnailCarouselProps,
  _ref
) {
  const thumbsPerView = Math.min(3);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(selectedIndex);

  useEffect(() => {
    swiperRef.current?.slideToLoop(selectedIndex, 600);
  }, [selectedIndex, swiperRef]);

  return (
    <div className="w-full h-full bg-[#D6D2C4]/50 py-4 px-2 overflow-hidden">
    {/* Arrow Controls */}
    <div className="flex justify-end items-center px-2 mb-2 gap-2">
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        ← Prev
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
      >
        Next →
      </button>
    </div>

    <div className="w-full h-full bg-[#D6D2C4]/50 py-4 px-2">
      <Swiper
        onSwiper={(s) => (swiperRef.current = s)}
        freeMode
        spaceBetween={35}
        loop={images.length > 1}
        breakpoints={{
          320: { slidesPerView: thumbsPerView - 1 },
          640: { slidesPerView: thumbsPerView - 1 },
          1024: { slidesPerView: thumbsPerView },
        }}
        modules={[FreeMode]}
        className="h-[1000%]"
      >
        {images.map((img, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <SwiperSlide key={idx}>
              <motion.div
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3, root: swiperRef.current?.el }}
                variants={thumbVariants}
                onClick={() => {
                    setModalIndex(idx);
                    setIsModalOpen(true);
                    onSelect(idx);
                }}
                className={`
                    relative aspect-square w-full cursor-pointer overflow-hidden
                    transition-transform duration-300 ease-in-out
                    
                `}
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
    </div>
  );
});

export default ThumbnailCarousel;
