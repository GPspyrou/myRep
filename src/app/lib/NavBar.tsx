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
const transparentRoutes = ['/', '/houses/*'];

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparentRoute = transparentRoutes.some((r) =>
    r.endsWith('/*') ? pathname.startsWith(r.slice(0, -1)) : pathname === r
  );
  const showSolid = !(isTransparentRoute && !scrolled);

  const bgClass = showSolid
  ? 'bg-white shadow-md'
  : 'bg-transparent ';

  const transitionClasses = 'transition-colors duration-500 ease-in-out';

  const commonLinkStyles = `
    relative
    text-[black]
    transition
    after:absolute after:-bottom-0.5 after:left-0
    after:h-0.5 after:w-0 after:bg-[black]
    after:transition-all after:duration-300 after:ease-in-out
    hover:after:w-full
  `;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await fetch('/api/session', { method: 'DELETE' });
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav
      className={`
        ${poppins.className}
        fixed inset-x-0 top-0 z-50 
        ${bgClass}
        ${transitionClasses}
      `}
    >
      <a
        href="mailto:support@property-hall.com"
        className="absolute top-0 right-0 mt-1 mr-4 text-xs underline text-[black]"
      >
        support@property-hall.com
      </a>

      <div className="max-w-7xl mx-auto flex items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="mr-10 flex items-center">
          <Image
            src="/LOGOTEST.png" // <-- Replace with your logo path
            alt="Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>

        {/* Left Nav Links */}
        <ul className="hidden sm:flex space-x-12">
          {['Home', 'Listings', 'Sell with Us'].map((item) => {
            let href = '/';
            if (item === 'Home') {
              href = '/';
            } else if (item === 'Sell with Us') {
              href = '/sell-with-us';
            } else {
              href = `/${item.toLowerCase()}`;
            }
            return (
              <li key={item}>
                <Link href={href} className={`text-lg font-medium ${commonLinkStyles}`}>
                  {item}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Side */}
      <div className="absolute inset-y-0 pt-3 right-4 pr-6 flex items-center space-x-4">
        <Link href="/contact" className={`text-sm pr-4 font-medium ${commonLinkStyles}`}>
          Contact
        </Link>
        {loading ? (
          <span className="text-base text-gray-600">Loading...</span>
        ) : user ? (
          <>
            <Image
              src={user.photoURL ?? defaultAvatar}
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-black">{user.email}</span>
              <button onClick={handleLogout} className="text-xs text-black">
                Logout
              </button>
            </div>
            <Link
              href="/login"
              className="sm:hidden ml-6 text-sm sm:text-black font-medium"
            >
              Login
            </Link>
          </>
        ) : (
          <Link href="/login" className={`text-sm text-black sm:text-black font-medium ${commonLinkStyles}`}>
            Login
          </Link>
        )}
          
      </div>
    </nav>
  );
}
