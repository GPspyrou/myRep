'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ContactForm from '@/app/lib/ContactForm';

export default function ContactHero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative w-full  bg-white text-gray-900 py-16 px-4 sm:px-6 lg:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12">

        
        {/* Left: Text Content */}
        <motion.div
          key={isInView ? 'animate-left' : 'idle-left'}
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full lg:w-1/2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cormorant leading-tight text-[#361e1a] mb-6">
            Interested in this property?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
            Leave us your contact details and we will get back to you as soon as possible with all the information you need.
          </p>
        </motion.div>

        {/* Right: Contact Form */}
        <motion.div
          key={isInView ? 'animate-form' : 'idle-form'}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="w-full lg:w-1/2"
        >
          <div className="bg-white w-full border-gray-100 p-6 sm:p-8 ">
            <ContactForm />
          </div>
        </motion.div>
      </div>

      {/* Background Accent */}
      <div
        aria-hidden
        className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />
    </section>
  );
}