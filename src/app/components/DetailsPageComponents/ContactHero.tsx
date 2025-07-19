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
      className="relative w-full bg-white text-gray-900 py-24 px-6 sm:px-8 lg:px-16 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left: Text Content */}
        <motion.div
          key={isInView ? 'animate-left' : 'idle-left'}
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full lg:w-1/2"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-cormorant leading-tight text-[#361e1a] mb-6">
            Interested in this property?
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
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
          <div className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
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
