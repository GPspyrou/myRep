'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/app/firebase/firebaseClient';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

const defaultAvatar = '/icons/default-avatar.svg'; // Path to your default SVG

/**
 * Note: In next.config.js, allow Google avatar domains:
 * module.exports = {
 *   images: { domains: ['lh3.googleusercontent.com'] },
 * };
 */

const NavBar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await auth.signOut();
      const res = await fetch('/api/session', { method: 'DELETE' });
      if (res.ok) {
        router.push('/login');
      } else {
        console.error('Logout failed', await res.text());
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className={`${poppins.className} fixed inset-x-0 top-0 h-[100px] bg-white bg-gradient-to-b from-white/95 to-white/90 shadow-md flex items-center justify-between px-8 text-gray-800 text-lg font-medium z-[9999]`}>
      {/* Left: support email */}
      <div className="flex-none">
        <a href="mailto:support@property-hall.com" className="text-xs underline">
          support@property-hall.com
        </a>
      </div>

      {/* Center: navigation links */}
      <div className="flex-1 flex justify-center">
        <ul className="list-none flex items-center gap-6 text-base tracking-wide">
          <li>
            <Link href="/" className="relative pb-1 hover:text-blue-500 hover:drop-shadow-md transition-all">
              Home
            </Link>
          </li>
          <li>
            <Link href="/listings" className="relative pb-1 hover:text-blue-500 hover:drop-shadow-md transition-all">
              Listings
            </Link>
          </li>
          <li>
            <Link href="/contact" className="relative pb-1 hover:text-blue-500 hover:drop-shadow-md transition-all">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Right: user info */}
      <div className="flex-none">
        {loading ? (
          <span>Loading...</span>
        ) : user ? (
          <div className="flex flex-col items-center">
            <Image
              src={user.photoURL ?? defaultAvatar}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="mt-1 text-xs text-gray-600">{user.email}</span>
            <button onClick={handleLogout} className="mt-1 text-xs text-blue-500 hover:underline">
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-base hover:text-blue-500 hover:drop-shadow-md transition-all">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
