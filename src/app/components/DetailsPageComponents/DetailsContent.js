'use client';

import Gallery from './Gallery';
import PropertyDetails from './PropertyDetails';
import PropertyDescription from './PropertyDescription';
import DetailsMap from './DetailsMap';
import PropertyHeader from './PropertyHeader';
import ContactForm from '@/app/lib/ContactForm';
import Footer from '@/app/lib/Footer';

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
    <main className="flex flex-col gap-8 min-h-screen bg-[#e9e5dd] pt-0 pb-44">
      {/* Side-by-side: Gallery + Header */}
      <div className="flex flex-col bg-[#e9e5dd] md:flex-row w-full ">
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
          <div className="hidden md:block w-[20%] px-4">
          <div
            className="sticky top-20 bg-[#e9e5dd] p-6 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 5rem)' }}
          >
            <PropertyHeader property={property} fields={headerFields} />
          </div>
        </div>
        )}
      </div>
      {/* Description + Details side-by-side */}
      {(description || (detailFields && detailFields.length > 0)) && (
        <div className="flex flex-col md:flex-row justify-between gap-4 px-4 md:px-8">
          {description && (
            <div className="w-full md:w-[60%] bg-[#D6D2C4] p-4">
              <PropertyDescription description={description} />
            </div>
          )}
          {detailFields && detailFields.length > 0 && (
            <div className="w-full md:w-[40%] bg-[#D6D2C4] p-4">
              <PropertyDetails property={property} fields={detailFields} />
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
        <Footer></Footer>
    </main>
  );
}
