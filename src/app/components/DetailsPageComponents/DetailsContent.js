'use client';

import Gallery from './Gallery';
import PropertyDetails from './PropertyDetails';
import PropertyDescription from './PropertyDescription';
import DetailsMap from './DetailsMap';
import PropertyHeader from './PropertyHeader';

export default function DetailsContent({ property }) {
  const headerFields =
    property.propertyHeaders ??
    property.PropertyHeaders ??
    null;
  const detailFields =
    property.propertyDetails ??
    property.PropertyDetails ??
    null;
  const description = property.description ?? null;

  return (
    <main className="flex flex-col gap-8 min-h-screen bg-[#D6D2C4] pt-0 pb-44 px-4 md:px-44">
      {/* Gallery */}
      <Gallery
        images={property.images.map((img, i) => ({
          src: img.src,
          alt: img.alt || `Property image ${i + 1}`,
        }))}
      />

      {/* Header (conditional) */}
      {headerFields && headerFields.length > 0 && (
        <div className="mb-10 rounded-xl border border-black shadow-2xl bg-gradient-to-br from-[#F3F2ED] to-[#DDD9CE] p-6">
          <PropertyHeader property={property} fields={headerFields} />
        </div>
      )}

      {/* Details + Map */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 h-[300px] md:h-[500px] w-full">
        {detailFields && detailFields.length > 0 && (
          <div className="flex-1 bg-[#D6D2C4] p-4">
            <PropertyDetails property={property} fields={detailFields} />
          </div>
        )}
        <div className="w-full md:w-[63%] mt-4 md:mt-5 h-[200px] sm:h-[300px] md:h-[500px]">
          <DetailsMap location={property.location} title={property.title} />
        </div>
      </div>

      {/* Description (conditional) */}
      {description && (
        <div className="bg-[#D6D2C4] p-4 overflow-hidden transition-[max-height] duration-500 ease-in-out">
          <PropertyDescription description={description} />
        </div>
      )}
    </main>
  );
}
