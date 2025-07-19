'use client';

import Link from 'next/link';
import ContactForm from '@/app/lib/ContactForm';
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#e6e2d8] text-black py-16 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-start gap-12">
        
        {/* Left side: Address block */}
        <div>
          <p className="text-gray-600 mb-2">Located At:</p>
          <p className="text-3xl font-light leading-snug">
            Real adress 6,<br />
            Perioxi, TK. 16541
          </p>
        </div>

        {/* Right side: Navigation links */}
        <div className="flex flex-col gap-4 text-right lg:text-left">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/listings" className="hover:underline">Listings</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
      </div>

      {/* Social & Attribution */}
      <div className="max-w-7xl mx-auto px-6 mt-16 flex flex-col lg:flex-row justify-between items-center text-xs text-gray-500">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <FaInstagram className="hover:opacity-70 cursor-pointer" />
          <FaLinkedin className="hover:opacity-70 cursor-pointer" />
          <FaYoutube className="hover:opacity-70 cursor-pointer" />
        </div>

        <p>
          Privacy Policy | Designed & Developed by{' '}
          <a
            href="https://rulerdigital.agency"
            className="font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ruler Digital Agency
          </a>
        </p>
      </div>

      
    </footer>
  );
}
