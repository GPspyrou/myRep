'use client';
import React, { forwardRef, useState, useRef, useLayoutEffect, useImperativeHandle } from 'react';
import { motion, useInView } from 'framer-motion';

type PropertyDescriptionProps = {
  description: string;
  collapsedMaxHeight?: string;
  expanded?: boolean;
  onToggle?: () => void;
};

const PropertyDescription = forwardRef<HTMLDivElement, PropertyDescriptionProps>(
  ({ description, collapsedMaxHeight = '16rem', expanded: controlledExpanded, onToggle }, ref) => {
    const isControlled = controlledExpanded !== undefined;
    const [localExpanded, setLocalExpanded] = useState(false);
    const expanded = isControlled ? controlledExpanded : localExpanded;
    const containerRef = useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, margin: '-50px' });
    const [shouldShowToggle, setShouldShowToggle] = useState(false);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const paras = description.split('\n').filter(p => p.trim().length > 0);

    useLayoutEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const computedStyle = window.getComputedStyle(el);
      const maxHeight = parseFloat(computedStyle.maxHeight);
      if (!isNaN(maxHeight) && el.scrollHeight > maxHeight + 20) {
        setShouldShowToggle(true);
      }
    }, [description, collapsedMaxHeight]);

    const toggle = () => {
      if (isControlled && onToggle) onToggle();
      else setLocalExpanded(prev => !prev);
    };
    return (
      <div className="w-full">
        <h2 className="mb-4 text-xl md:text-2xl font-semibold text-gray-900 tracking-tight capitalize">
          Περιγραφή
        </h2>
        <div
          ref={containerRef}
          style={{
            maxHeight: expanded ? 'none' : collapsedMaxHeight,
            overflow: 'hidden',
            transition: 'max-height 0.5s ease',
          }}
        >
          {paras.map((p, i) => (
            <motion.p
              key={i}
              className="mb-4 text-base leading-relaxed text-gray-700 whitespace-pre-line"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeOut' }}
            >
              {p}
            </motion.p>
          ))}
        </div>
        {shouldShowToggle && (
          <button
            onClick={toggle}
            className="mt-3 text-sm font-medium text-blue-600 hover:underline transition-all"
          >
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    );
  }
);    

export default PropertyDescription;