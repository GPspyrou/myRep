// Updated InvestGreece.tsx with responsive media queries
'use client';

import { FC } from 'react';

const features = [
  {
    title: 'Stunning Islands',
    description: 'Over 200 breathtaking islands to explore and invest in',
    icon: '🏝️',
  },
  {
    title: 'Low Property Taxes',
    description: 'Real estate taxes are significantly lower than in many EU countries',
    icon: '💶',
  },
  {
    title: 'Excellent Healthcare',
    description: 'Access to quality medical care at competitive prices',
    icon: '🏥',
  },
  {
    title: 'Strong Tourism Market',
    description: 'High rental demand thanks to year-round tourism',
    icon: '📈',
  },
];

const reasons = [
  'Stable government policies attracting foreign investors',
  'Golden Visa Program with EU residency options',
  'Low cost of living with high quality of life',
  'Rich cultural heritage and Mediterranean climate',
  'Increasing demand for short-term rentals (Airbnb-friendly)',
];

const InvestGreece: FC = () => {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto text-center px-2 sm:px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003B71]">
          Investment in Greece
        </h2>
        <p className="mt-4 text-base sm:text-lg md:text-xl font-medium text-[#003B71] leading-relaxed">
          A cliffside villa in Santorini, a historic apartment in Athens,
          <br className="block sm:hidden" />
          or a seaside retreat in Crete – your dream is within reach
        </p>

        {/* Icons Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 text-center">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-3 sm:space-y-4 md:space-y-6">
              <div className="text-3xl sm:text-4xl md:text-5xl">{item.icon}</div>
              <h3 className="font-bold text-base sm:text-lg md:text-xl text-[#003B71]">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-[#003B71]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-12 sm:w-16 md:w-20 h-1 bg-pink-400 mx-auto my-8 sm:my-10 md:my-12" />

        {/* Reasons List */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#003B71] mb-4">
          5 reasons which make Greece a great place to invest
        </h3>
        <ul className="list-disc text-left max-w-xl sm:max-w-2xl mx-auto space-y-2 text-[#003B71] text-xs sm:text-sm md:text-base pl-4 sm:pl-5 md:pl-6">
          {reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvestGreece;
