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
    <div className="min-h-screen flex flex-col bg-[#e9e5dd]">
      <main className="flex-grow flex flex-col gap-8 pt-0">
        {/* Gallery + Header (Unchanged) */}
        <div className="flex flex-col bg-[#e9e5dd] md:flex-row w-full">
          <div className="w-full md:w-[80%] h-[50vh] md:h-full overflow-hidden">
            <Gallery
              images={property.images.map((img, i) => ({
                src: img.src,
                alt: img.alt || `Property image ${i + 1}`,
              }))}
            />
          </div>
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

        {/* New Two-Column Layout */}
        <div className="flex flex-col md:flex-row gap-6 px-4 md:px-12 py-8">
          {/* Left Column: Description + Map */}
          <div className="w-full md:w-[60%] flex flex-col gap-6">
            {description && (
              <div className="bg-transparent ">
                <PropertyDescription
                  ref={descRef}
                  description={description}
                  collapsedMaxHeight="16rem"
                  expanded={expandedDescription}
                  onToggle={toggleDescription}
                />
              </div>
            )}
            <div className="h-[300px] md:h-[400px]">
              <DetailsMap location={property.location} title={property.title} />
            </div>
          </div>

          {/* Right Column: Property Details + Contact Form */}
          <div className="w-full md:w-[40%] flex flex-col gap-6">
            {detailFields?.length > 0 && (
              <div className="bg-[#D6D2C4] rounded-xl shadow-md p-6 transition-shadow hover:shadow-lg">
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
            <div className="sticky top-20">
              <div className="w-full sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] pt-10  mx-auto">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}