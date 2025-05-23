'use client';

import React, {
  forwardRef,
  useState,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import { motion } from 'framer-motion';

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
    const contentRef = useRef<HTMLDivElement>(null);

    const [shouldShowToggle, setShouldShowToggle] = useState(false);

    useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

    const paras = description.split('\n').filter(p => p.trim().length > 0);

    useLayoutEffect(() => {
      const el = contentRef.current;
      if (!el) return;

      const maxHeightNum = parseFloat(collapsedMaxHeight);
      if (!isNaN(maxHeightNum) && el.scrollHeight > maxHeightNum + 10) {
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
          Description
        </h2>

        <motion.div
          ref={containerRef}
          layout
          initial={false}
          animate={{
            height: expanded ? 'auto' : collapsedMaxHeight,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
        >
          <div ref={contentRef}>
            {paras.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="mb-4 text-base leading-relaxed text-gray-700 whitespace-pre-line"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </motion.div>

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