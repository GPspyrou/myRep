'use client'; // Ensures this component runs on the client side (Next.js specific)

import React, { useEffect, useRef, useState } from 'react';

// Utility function to format keys into readable labels
// Example: "yearReleased" => "Year Released"
const formatLabel = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter

// Props type definition: a property object with flexible field types, plus a list of which fields to display
type PropertyDetailsProps = {
  property: Record<string, string | number | null | undefined | object>;
  fields: string[];
};

export default function PropertyDetails({ property, fields }: PropertyDetailsProps) {
  // Ref for the container element to observe when it comes into view
  const containerRef = useRef<HTMLUListElement>(null);

  // State to trigger animation once the component is visible in the viewport
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create an IntersectionObserver to trigger animation when in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // Trigger animation
          observer.disconnect(); // Stop observing after triggered once
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    observer.observe(containerRef.current);

    // Clean up the observer on unmount
    return () => observer.disconnect();
  }, []);

  // Helper to check if a value should be rendered
  const hasRenderableValue = (v: any) =>
    v !== null &&
    v !== undefined &&
    !(typeof v === 'string' && v.trim() === '') &&
    typeof v !== 'object'; // Excludes nested objects

  // Filter entries by the incoming 'fields' array and renderable values
  const visibleEntries = Object.entries(property).filter(
    ([key, value]) => fields.includes(key) && hasRenderableValue(value)
  );

  return (
    <ul ref={containerRef} className="list-none p-0 m-0 grid grid-cols-2 gap-2">
      {visibleEntries.map(([key, value], idx) => (
        <li key={idx} className="py-3 text-base font-medium relative">
          <span className="relative block">
            {/* Render formatted key and value */}
            <strong>{formatLabel(key)}:</strong> {value as string | number}
            {/* Animated underline that expands when visible */}
            <div
              className={`absolute bottom-[-2px] left-0 h-[2px] bg-black transition-all duration-800 ${
                isVisible ? 'w-full' : 'w-0'
              }`}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
