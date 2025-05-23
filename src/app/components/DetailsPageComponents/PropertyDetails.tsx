'use client';

import React, {
  forwardRef,
  useRef,
  useState,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import { motion } from 'framer-motion';

type PropertyDetailsProps = {
  property: Record<string, any>;
  fields: string[];
  collapsedMaxHeight?: string;
  expanded?: boolean;
  onToggle?: () => void;
};

const PropertyDetails = forwardRef<HTMLElement, PropertyDetailsProps>(
  ({ property, fields, collapsedMaxHeight = '16rem', expanded: controlledExpanded, onToggle }, ref) => {
    const internalRef = useRef<HTMLUListElement>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLUListElement);
    const [showToggle, setShowToggle] = useState(false);
    const isControlled = controlledExpanded !== undefined;
    const [localExpanded, setLocalExpanded] = useState(false);
    const expanded = isControlled ? controlledExpanded! : localExpanded;

    useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el) return;
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const maxHeightNum = parseFloat(collapsedMaxHeight);
      const maxHeightPx = maxHeightNum * rootFontSize;
      if (!isNaN(maxHeightPx) && el.scrollHeight > maxHeightPx + 10) {
        setShowToggle(true);
      }
    }, [collapsedMaxHeight]);

    const entries = Object.entries(property).filter(
      ([k, v]) =>
        fields.includes(k) &&
        v != null &&
        !(typeof v === 'string' && !v.trim()) &&
        typeof v !== 'object'
    );

    const toggle = () => {
      if (isControlled && onToggle) onToggle();
      else setLocalExpanded(x => !x);
    };

    const listItemVariants = {
      hidden: { opacity: 0, y: 16 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    };

    const underlineVariants = {
      hidden: { width: '0%' },
      visible: {
        width: '100%',
        transition: {
          duration: 1,
          ease: 'easeOut',
          delay: 0.2,
        },
      },
    };

    return (
      <div>
        <motion.ul
          ref={internalRef}
          layout
          initial={false}
          animate={{ height: expanded ? 'auto' : collapsedMaxHeight }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ overflow: 'hidden' }}
          className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {entries.map(([key, value], idx) => (
            <motion.li
              key={idx}
              variants={listItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative py-1 font-medium"
            >
              <div className="flex gap-x-2 items-baseline relative">
                <strong className="text-[1rem] text-[#361e1a]">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                </strong>
                <span className="text-[1.05rem] font-medium text-black">{value}</span>
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] bg-neutral-400"
                  variants={underlineVariants}
                />
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {showToggle && (
          <button
            onClick={toggle}
            className="mt-2 block mx-auto text-sm font-semibold underline hover:no-underline"
          >
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>
    );
  }
);

PropertyDetails.displayName = 'PropertyDetails';

export default PropertyDetails;