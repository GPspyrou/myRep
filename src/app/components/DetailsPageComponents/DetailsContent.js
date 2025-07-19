'use client';

import React, { useState, useRef } from 'react';
import Gallery from './Gallery';
import PropertyDetails from './PropertyDetails';
import PropertyDescription from './PropertyDescription';
import PropertyHeader from './PropertyHeader';
import ThumbnailCarousel from './ThumbnailCarousel';
import ContactForm from '@/app/lib/ContactForm';
import Footer from '@/app/lib/Footer';
import ContactHero from './ContactHero';

export default function DetailsContent({ property }) {
  // Refs for imperative handles
  const descRef    = useRef(null);
  const detailsRef = useRef(null);
  const swiperRef  = useRef(null);

  // Expand/collapse state
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedDetails,     setExpandedDetails]     = useState(false);

  // Active thumbnail index
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Normalize incoming fields
  const headerFields = property.propertyHeaders    ?? property.PropertyHeaders    ?? [];
  const detailFields = property.propertyDetails   ?? property.PropertyDetails    ?? [];
  const description  = property.description        ?? '';

  const toggleDescription = () => {
    const next = !expandedDescription;
    setExpandedDescription(next);
    if (
      next &&
      descRef.current &&
      detailsRef.current &&
      detailsRef.current.scrollHeight <= descRef.current.scrollHeight
    ) {
      setExpandedDetails(true);
    }
  };

  const toggleDetails = () => {
    const next = !expandedDetails;
    setExpandedDetails(next);
    if (
      next &&
      descRef.current &&
      detailsRef.current &&
      descRef.current.scrollHeight <= detailsRef.current.scrollHeight
    ) {
      setExpandedDescription(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#e9e5dd]">

      {/* Main content area grows to push footer down */}
      <main className="flex-1 flex flex-col w-full">
        
        {/* — Gallery — */}
        <div className="w-full overflow-hidden">
          <Gallery
            images={property.images.map((img, i) => ({
              src: img.src,
              alt: img.alt ?? `Property image ${i + 1}`,
            }))}
          />
        </div>

        {/* — Two‐column section — */}
        <div className="flex flex-col lg:flex-row justify-end px-4 md:px-12 lg:px-0 py-8">

          {/* Sidebar (sticky on lg+) */}
          <aside
              className="hidden lg:block sticky top-20 bg-[#e9e5dd] p-6 overflow-y-auto scrollbar-hide "
              style={{
                width: '100%',
                maxHeight: 'calc(100vh - 5rem )'
              }}
            >
              <div className="flex flex-col gap-8 ">
                {headerFields.length > 0 && (
                  <div className="mb-0">
                    <PropertyHeader property={property} fields={headerFields} />
                  </div>
                )}
                {detailFields.length > 0 && (
                  <div className="bg-white p-4">
                    <PropertyDetails
                      ref={detailsRef}
                      property={property}
                      fields={detailFields}
                      collapsedMaxHeight="16rem"
                      expanded={expandedDetails}
                      onToggle={toggleDetails}
                    />
                  </div>
                )}
              </div>
            </aside>

          {/* Main column */}
          <section className="w-full lg:w-[70%] flex flex-col gap-6 lg:ml-auto">
            {description && (
              <div className="bg-white  shadow">
                <PropertyDescription
                  ref={descRef}
                  description={description}
                  collapsedMaxHeight="16rem"
                  expanded={expandedDescription}
                  onToggle={toggleDescription}
                  image={property.images[2]}
                />
              </div>
            )}

            <div className="bg-white p-6 shadow flex flex-col gap-6">
              <ThumbnailCarousel
                images={property.images.map((img, i) => ({
                  src: img.src,
                  alt: img.alt ?? `Thumb ${i + 1}`,
                }))}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
                swiperRef={swiperRef}
              />
              
            </div>
            <ContactHero />
          </section>
        
        </div>
      </main>

      {/* — Footer pinned to bottom when content is short — */}
      <Footer />
    </div>
  );
}
