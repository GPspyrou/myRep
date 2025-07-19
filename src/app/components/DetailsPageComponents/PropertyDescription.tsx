'use client';

import React, {
  forwardRef,
  useState,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type PropertyDescriptionProps = {
  description: string;
  collapsedMaxHeight?: string;
  expanded?: boolean;
  onToggle?: () => void;
  image?: { src: string; alt?: string };
  heading?: string;
};

const PropertyDescription = forwardRef<HTMLDivElement, PropertyDescriptionProps>(
  (
    {
      description,
      collapsedMaxHeight = '16rem',
      expanded: controlledExpanded,
      onToggle,
      image,
      heading = 'Description',
    },
    ref
  ) => {
    const isControlled = controlledExpanded !== undefined;
    const [localExpanded, setLocalExpanded] = useState(false);
    const expanded = isControlled ? controlledExpanded : localExpanded;

    const containerRef = useRef<HTMLDivElement>(null);
    const remainingContentRef = useRef<HTMLDivElement>(null);
    const [shouldShowToggle, setShouldShowToggle] = useState(false);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const paras = description
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const firstParagraph = paras[0] || '';
    const remainingParagraphs = paras.slice(1);

    useLayoutEffect(() => {
      if (!remainingParagraphs.length) {
        setShouldShowToggle(false);
        return;
      }
      const el = remainingContentRef.current;
      if (!el) return;

      let numericMax = parseFloat(collapsedMaxHeight);
      if (isNaN(numericMax)) {
        if (collapsedMaxHeight.endsWith('rem')) {
          const rem = parseFloat(collapsedMaxHeight.replace('rem', ''));
          if (!isNaN(rem)) numericMax = rem * 16;
        }
      }

      if (!isNaN(numericMax)) {
        setShouldShowToggle(el.scrollHeight > numericMax + 10);
      } else {
        setShouldShowToggle(el.scrollHeight > 300);
      }
    }, [description, collapsedMaxHeight, remainingParagraphs.length]);

    const toggle = () => {
      if (isControlled && onToggle) onToggle();
      else setLocalExpanded(prev => !prev);
    };

    return (
      <div ref={containerRef} className="w-full px-4 sm:px-6 md:px-12">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: false }}
          className="font-cormorant font-light uppercase text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-[#361e1a] pt-12 sm:pt-20 mb-5"
        >
          {heading}
        </motion.h2>

        {/* First Paragraph */}
        {firstParagraph && (
          <motion.p
            key="first-paragraph"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: false }}
            className="mb-8 text-base md:text-lg leading-relaxed text-gray-700 whitespace-pre-line"
          >
            {firstParagraph}
          </motion.p>
        )}

        {/* Image */}
        {image && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="relative w-full min-h-[200px] md:min-h-[400px] overflow-hidden mb-12 rounded"
          >
            <Image
              src={image.src}
              alt={image.alt || 'Property image'}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Remaining Paragraphs */}
        {remainingParagraphs.length > 0 && (
          <div>
            <motion.div
              layout
              initial={false}
              animate={{
                height: expanded ? 'auto' : collapsedMaxHeight,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
              aria-expanded={expanded}
              aria-label="Additional description"
            >
              <motion.div
                ref={remainingContentRef}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.15,
                    },
                  },
                }}
              >
                {remainingParagraphs.map((p, i) => (
                  <motion.p
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4 }}
                    className="mb-4 text-base md:text-lg leading-relaxed text-gray-700 whitespace-pre-line"
                  >
                    {p}
                  </motion.p>
                ))}
              </motion.div>
            </motion.div>

            {/* Toggle Button */}
            {shouldShowToggle && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={toggle}
                  className="text-sm font-light text-black hover:underline transition-all"
                  type="button"
                  aria-controls="additional-description"
                >
                  {expanded ? 'Read Less' : 'Read More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

PropertyDescription.displayName = 'PropertyDescription';

export default PropertyDescription;
