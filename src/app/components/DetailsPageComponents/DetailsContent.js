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
          <div className="w-full md:w-[20%] h-full pt-20 overflow-y-shown px-4 py-6 bg-#bg-[#e9e5dd] ">
            <PropertyHeader property={property} fields={headerFields} />
          </div>
        )}
      </div>
      {/* Description (conditional) */}
      
      {description && (
        <div className="bg-[#D6D2C4] p-4 w-[30%] mx-left overflow-hidden transition-[max-height] duration-500 ease-in-out">
          <PropertyDescription description={description} />
          

        </div>
      )}
      <div className="w-full h-full   sm:h-[300px] md:h-[400px]">
          <DetailsMap location={property.location} title={property.title} />
          
        </div>  
      
      <div className="flex max-w-full items-start justify-between px-4 md:px-8 flex-col md:flex-row gap-6 pt-20 md:gap-8">
        {detailFields && detailFields.length > 0 && (
          <div className="w-[30%]  bg-[#D6D2C4] p-4">
            <PropertyDetails property={property} fields={detailFields} />
            
          </div>
          
        )}
        <div className="w-full md:w-[40%] lg:w-[30%]">
                  <ContactForm> </ContactForm>
                  
        </div>
        
      </div>
      {/* Footer */}<Footer></Footer>
  
       
       
    </main>
  );
}
