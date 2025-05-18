'use client';

import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    const [isVisible, setIsVisible] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const isControlled = controlledExpanded !== undefined;
    const [localExpanded, setLocalExpanded] = useState(false);
    const expanded = isControlled ? controlledExpanded! : localExpanded;

    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);

    useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el) return;
      const maxH = parseFloat(window.getComputedStyle(el).maxHeight) || parseFloat(collapsedMaxHeight);
      if (el.scrollHeight > maxH) {
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

    return (
      <div>
        <motion.ul
          ref={internalRef}
          layout
          initial={false}
          animate={{
            height: expanded ? 'auto' : collapsedMaxHeight,
            overflow: 'hidden',
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <AnimatePresence>
            {entries.map(([key, value], idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.12,
                  ease: 'easeOut',
                }}
                className="relative py-1 font-medium"
              >
                <div className="flex gap-x-2 items-baseline relative">
                  <strong className="text-[1rem] text-[#361e1a]">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                  </strong>
                  <span className="text-[1.05rem] font-medium text-black">{value}</span>
                  <span
                    className="absolute bottom-0 left-0 h-[2px] bg-neutral-400"
                    style={{
                      width: isVisible ? '100%' : '0%',
                      transition: 'width 1s ease-out',
                      transitionDelay: `${idx * 0.15 + 0.2}s`,
                    }}
                  />
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
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
