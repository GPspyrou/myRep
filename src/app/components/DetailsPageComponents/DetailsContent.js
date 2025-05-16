'use client';
import { useState, useRef } from 'react';
import Gallery from './Gallery';
import PropertyDetails from './PropertyDetails';
import PropertyDescription from './PropertyDescription';
import DetailsMap from './DetailsMap';
import PropertyHeader from './PropertyHeader';
import ContactForm from '@/app/lib/ContactForm';
import Footer from '@/app/lib/Footer';

export default function DetailsContent({ property }) {
  const descRef = useRef(null);
  const detailsRef = useRef(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  const headerFields = property.propertyHeaders ?? property.PropertyHeaders ?? null;
  const detailFields = property.propertyDetails ?? property.PropertyDetails ?? null;
  const description = property.description ?? null;

  const toggleDescription = () => {
    const newExpanded = !expandedDescription;
    setExpandedDescription(newExpanded);
    if (newExpanded && descRef.current && detailsRef.current) {
      const descHeight = descRef.current.scrollHeight;
      const detailsHeight = detailsRef.current.scrollHeight;
      if (detailsHeight <= descHeight) {
        setExpandedDetails(true);
      }
    }
  };

  const toggleDetails = () => {
    const newExpanded = !expandedDetails;
    setExpandedDetails(newExpanded);
    if (newExpanded && descRef.current && detailsRef.current) {
      const descHeight = descRef.current.scrollHeight;
      const detailsHeight = detailsRef.current.scrollHeight;
      if (descHeight <= detailsHeight) {
        setExpandedDescription(true);
      }
    }
  };

  return (
    <main className="flex flex-col gap-8 min-h-screen bg-[#e9e5dd] pt-0 pb-44">
      {/* Side-by-side: Gallery + Header */}
      <div className="flex flex-col bg-[#e9e5dd] md:flex-row w-full">
        {/* Gallery - Left side */}
        <div className="w-full md:w-[80%] h-[50vh] md:h-full overflow-hidden">
          <Gallery
            images={property.images.map((img, i) => ({
              src: img.src,
              alt: img.alt || `Property image ${i + 1}`,
            }))}
          />
        </div>

        {/* Property Header - Right side */}
        {headerFields && headerFields.length > 0 && (
          <div
          className="sticky top-20 bg-[#e9e5dd] p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 5rem)' }}
        >
          <div className="relative overflow-visible">
            <PropertyHeader property={property} fields={headerFields} />
          </div>
        </div>
        
        )}
      </div>

      {/* Description + Details side-by-side */}
      {(description || (detailFields && detailFields.length > 0)) && (
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 px-4 md:px-12 py-8">
  {description && (
    <div className="w-full md:w-[60%] bg-[#D6D2C4]  rounded-xl shadow-md p-6 transition-shadow hover:shadow-lg">
      <PropertyDescription
        ref={descRef}
        description={description}
        collapsedMaxHeight="16rem"
        expanded={expandedDescription}
        onToggle={toggleDescription}
      />
    </div>
  )}
  {detailFields?.length > 0 && (
    <div className="w-full md:w-[40%] bg-[#D6D2C4] rounded-xl shadow-md p-6 transition-shadow hover:shadow-lg">
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

      )}

      {/* Map + Contact Form Side-by-Side */}
      <div className="flex flex-col md:flex-row justify-between gap-6 px-4 md:px-8 pt-20">
        {/* Map */}
        <div className="w-full md:w-[60%] h-[300px] md:h-[400px]">
          <DetailsMap location={property.location} title={property.title} />
        </div>

        {/* Contact Form */}
        <div className="w-full md:w-[40%] lg:w-[30%]">
          <ContactForm />
        </div>
      </div>

      <Footer />
    </main>
  );
}