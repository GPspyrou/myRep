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
  const descRef = useRef(null);
  const detailsRef = useRef(null);
  const swiperRef = useRef(null);

  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const headerFields = property.propertyHeaders ?? property.PropertyHeaders ?? [];
  const detailFields = property.propertyDetails ?? property.PropertyDetails ?? [];
  const description = property.description ?? '';

  const toggleDescription = () => {
    setExpandedDescription(prev => !prev);
  };
  
  const toggleDetails = () => {
    setExpandedDetails(prev => !prev);
  };
  

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#e9e5dd] sm:bg-white">
      <main className="flex-1 flex flex-col w-full">

{/* Gallery always first */}
<div className="w-full overflow-hidden">
  <Gallery
    images={property.images.map((img, i) => ({
      src: img.src,
      alt: img.alt ?? `Property image ${i + 1}`,
    }))}
  />
</div>

{/* Responsive stacked layout */}
<div className="flex flex-col lg:flex-row justify-end px-4 sm:px-6 md:px-8 lg:px-0 py-8 gap-6">

  {/* 🧱 MOBILE Header + Details (stacked above description) */}
  <div className="lg:hidden bg-white flex flex-col gap-6 sm:bg-white p-4 sm:p-0">
    {headerFields.length > 0 && (
      <PropertyHeader property={property} fields={headerFields} />
    )}
    {detailFields.length > 0 && (
      <div className="bg-white p-4 shadow rounded">
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

  {/* 🧱 Desktop Sidebar */}
  <aside
    className="hidden lg:block lg:w-[30%] sticky top-20 bg-white p-6 overflow-y-auto scrollbar-hide"
    style={{ maxHeight: 'calc(100vh - 5rem)' }}
  >
    <div className="flex flex-col gap-8">
      {headerFields.length > 0 && (
        <PropertyHeader property={property} fields={headerFields} />
      )}
      {detailFields.length > 0 && (
        <div className="bg-white p-4 shadow rounded">
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

  {/* 🧱 Main Column */}
  <section className="w-full lg:w-[70%] bg:white flex flex-col gap-6">
    {description && (
      <div className="bg-white ">
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

    <div className="bg-white p-4 sm:p-6   flex flex-col gap-6">
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

      <Footer />
    </div>
  );
}
