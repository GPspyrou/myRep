'use client';

import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

export interface FAQItem {
  question: string;
  answer: ReactNode;
}

interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className="max-w-7xl mx-auto my-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col lg:flex-row lg:space-x-12">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          viewport={{ once: true }}
          className="lg:w-1/3 mb-8 lg:mb-0"
        >
          <h2 className="text-3xl font-extrabold mb-4">
            The Most Frequently Asked Questions About Property in Ibiza
          </h2>
          <p className="text-gray-700 mb-2">
            Here are the questions we are most often asked by people wanting to buy a property in Ibiza.
          </p>
          <p className="text-gray-700">
            If you don’t see the answer to your question, then feel free to ask us in the chat box.
          </p>
        </motion.div>

        {/* Right column: accordion */}
        <div className="lg:w-2/3 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
              viewport={{ once: true }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none"
              >
                <span className="flex-1 text-gray-900 font-medium">
                  {item.question}
                </span>
                <span className="ml-4 text-2xl text-gray-500">
                  {openIndex === i ? '−' : '+'}
                </span>
              </button>

              {/* always render, but animate max-height & padding */}
              <div
                className={[
                  'overflow-hidden bg-gray-50 px-5',
                  openIndex === i
                    ? 'transition-[max-height,padding] duration-300 ease-in max-h-screen py-4'
                    : 'max-h-0 py-0 transition-none'
                ].join(' ')}
              >
                {item.answer}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
