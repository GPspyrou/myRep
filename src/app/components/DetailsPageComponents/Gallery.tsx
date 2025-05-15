// app/components/DetailsPageComponents/Gallery.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation, FreeMode, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Modal from "./Modal";

export interface GalleryImage { src: string; alt: string; }
interface GalleryProps { images: GalleryImage[]; }

const thumbVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

export default function Gallery({ images }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mainSwiperRef = useRef<any>(null);
  const thumbSwiperRef = useRef<any>(null);

  useEffect(() => {
    thumbSwiperRef.current?.slideToLoop(selectedIndex, 600);
  }, [selectedIndex]);

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
  const thumbsPerView = Math.min(images.length, 5);

  return (
    <div className="flex flex-col items-center  max-w-[100%] mx-auto bg-[#e9e5dd]">
      {/* Main Carousel */}
      <div className="w-full 
                h-[200px] sm:h-[300px] md:h-[500px] 
                lg:h-[800px] 
                overflow-hidden
                border border-black">
        <Swiper
          onSwiper={(s) => (mainSwiperRef.current = s)}
          onSlideChange={(s) => setSelectedIndex(s.realIndex)}
          
          navigation loop autoplay={{ delay: 4000, disableOnInteraction: false }}
          speed={600} modules={[Navigation, Autoplay]}
          className="w-full h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div onClick={() => setIsModalOpen(true)} className="w-full h-full">
                <Image
                  src={img.src} alt={img.alt}
                  width={600} height={400}
                  className="object-cover w-full h-full rounded-sm cursor-pointer"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnail Carousel */}
      {images.length > 1 && (
        <div className="w-full h-full bg-[#D6D2C4]/50 py-4 px-2">
          <Swiper
            onSwiper={(s) => (thumbSwiperRef.current = s)}
            freeMode
            spaceBetween={8}
            loop={images.length > 1}
            breakpoints={{
              320: { slidesPerView: Math.min(thumbsPerView, 2) },
              640: { slidesPerView: Math.min(thumbsPerView, 3) },
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
                    viewport={{ once: false, amount: 0.3, root: thumbSwiperRef.current?.el }}
                    variants={thumbVariants}
                    onClick={() => {
                      setSelectedIndex(idx);
                      mainSwiperRef.current?.slideToLoop(idx);
                    }}
                    className={`
                      relative aspect-square w-full cursor-pointer overflow-hidden
                      transition-transform duration-300 ease-in-out border-2
                      ${isSelected
                        ? "border-black p-1 shadow-[0_4px_10px_rgba(0,0,0,0.3)] scale-110"
                        : "border-transparent"}
                    `}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      loading="eager"
                      className={`object-cover ${isSelected ? "scale-110" : ""}`}
                    />
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* Modal */}
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
