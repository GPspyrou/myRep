// Updated NavBar.tsx with responsive tweaks
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/app/firebase/firebaseClient';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

const defaultAvatar = '/icons/default-avatar.svg';

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const transparentRoutes = ['/', '/houses/*'];

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparentRoute = transparentRoutes.some((route) => {
    if (route.endsWith('/*')) {
      const prefix = route.slice(0, -1);
      return pathname.startsWith(prefix);
    }
    return pathname === route;
  });

  const bgClass =
    isTransparentRoute && !scrolled
      ? 'bg-transparent shadow-none'
      : 'bg-white bg-gradient-to-b from-white/95 to-white/90 shadow-md';

  const handleLogout = async (): Promise<void> => {
    try {
      await auth.signOut();
      const res = await fetch('/api/session', { method: 'DELETE' });
      if (res.ok) router.push('/login');
      else console.error('Logout failed', await res.text());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav
      className={
        `${poppins.className}
        fixed inset-x-0 top-0
        h-16 sm:h-20 md:h-24
        flex items-center justify-between
        px-4 sm:px-6 md:px-8 lg:px-12
        text-gray-800
        z-[9999]
        ${bgClass}`
      }
    >
      {/* Left: support email, hide on xs */}
      <div className="flex-none hidden sm:block">
        <a href="mailto:support@property-hall.com" className="text-xs underline">
          support@property-hall.com
        </a>
      </div>

      {/* Center: navigation links */}
      <div className="flex-1 flex justify-center">
        <ul className="list-none flex items-center gap-4 sm:gap-6 lg:gap-8">
          {['Home','Listings','Contact'].map((item, idx) => {
            const href = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
            return (
              <li key={idx}>
                <Link
                  href={href}
                  className="
                    relative pb-1
                    text-sm sm:text-base md:text-lg
                    font-medium
                    hover:text-blue-500 hover:drop-shadow-md
                    transition-all
                  "
                >
                  {item}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right: user info */}
      <div className="flex-none">
        {loading ? (
          <span className="text-sm sm:text-base">Loading...</span>
        ) : user ? (
          <div className="flex items-center space-x-2">
            <Image
              src={user.photoURL ?? defaultAvatar}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="hidden sm:flex sm:flex-col sm:items-start">
              <span className="text-xs sm:text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-xs sm:text-sm text-blue-500 hover:underline"
              >
                Logout
              </button>
            </div>
            <Link
              href="/login"
              className="block sm:hidden text-sm hover:text-blue-500 hover:drop-shadow-md transition-all"
            >
              Login
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm sm:text-base hover:text-blue-500 hover:drop-shadow-md transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;