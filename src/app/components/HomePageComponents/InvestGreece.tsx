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
    <div className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#003B71]">Investment in Greece</h2>
        <p className="mt-4 text-lg font-medium text-[#003B71]">
          A cliffside villa in Santorini, a historic apartment in Athens,<br />
          or a seaside retreat in Crete – your dream is within reach
        </p>

        {/* Icons Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              <div className="text-4xl">{item.icon}</div>
              <h3 className="font-bold text-lg text-[#003B71]">{item.title}</h3>
              <p className="text-sm text-[#003B71]">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="w-16 h-1 bg-pink-400 mx-auto my-12" />

        {/* Reasons List */}
        <h3 className="text-xl font-bold text-[#003B71] mb-4">
          5 reasons which make Greece a great place to invest
        </h3>
        <ul className="list-disc text-left max-w-2xl mx-auto space-y-2 text-[#003B71] text-sm pl-5">
          {reasons.map((reason, idx) => (
            <li key={idx}>{reason}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InvestGreece;
