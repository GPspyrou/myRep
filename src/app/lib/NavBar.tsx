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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
  
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!isMounted) return;
  
      setUser(u);
      setLoading(false);
  
      if (!u) {
        try {
          const res = await fetch('/api/session/check', {
            credentials: 'include'
          });
  
          if (res.status === 401) {
            await fetch('/api/session', { method: 'DELETE' });
            
          }
        } catch (err) {
          console.error('Session check failed:', err);
        }
      }
    });
  
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router]);
  
  
  

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isTransparentRoute = transparentRoutes.some((r) =>
    r.endsWith('/*') ? pathname.startsWith(r.slice(0, -1)) : pathname === r
  );
  const showSolid = mobileMenuOpen || !(isTransparentRoute && !scrolled);

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
  className="
    hidden sm:block      /* ← hide on mobile, show from sm+ up */
    absolute top-2 right-4
    text-xs underline text-black
    z-50 cursor-pointer
  "
>
  support@property-hall.com
</a>


      {/* Hamburger for mobile only */}
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="sm:hidden absolute top-6 left-4 z-50 focus:outline-none"
  >
    <svg
      className="w-6 h-6 text-black"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {mobileMenuOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>

  <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start h-24 px-4 sm:px-6 lg:px-8">
    {/* Logo */}
    <Link href="/" className="mr-10 flex flex-col items-center justify-center">
      <Image
        src="/LOGOTEST.png"
        alt="Logo"
        width={70}
        height={70}
        className="object-contain"
      />
      <h1 className="text-sm text-black font-normal mt-1 text-center">
        Property Hall
      </h1>
    </Link>

    {/* Desktop Nav Links */}
    <ul className="hidden sm:flex space-x-12">
      {['Home', 'Listings', 'Sell with Us'].map((item) => {
        let href = '/';
        if (item === 'Sell with Us') href = '/sell-with-us';
        else if (item !== 'Home') href = `/${item.toLowerCase()}`;
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

  {/* Mobile Dropdown Menu */}
<div
  className={`
    sm:hidden absolute top-24 left-0 w-full bg-white shadow-md z-40
    box-border overflow-hidden
    transition-all ease-in-out
    ${mobileMenuOpen 
      ? 'duration-[1000ms]'     // 1s open
      : 'duration-[300ms]'      // 0.3s close
    }
    ${mobileMenuOpen ? 'max-h-[500px]' : 'max-h-0'}
  `}
>
  <div
    className={`
      px-6 py-4
      transition-opacity ease-in-out
      ${mobileMenuOpen 
        ? 'opacity-100 duration-[1000ms] delay-[100ms]'  // fade-in 1s, slight 100ms delay
        : 'opacity-0 duration-[300ms]'                    // fade-out 0.2s, no delay
      }
    `}
  >
    <ul className="space-y-4">
      {['Home', 'Listings', 'Sell with Us', 'Contact'].map((item) => {
        let href = '/';
        if (item === 'Sell with Us')   href = '/sell-with-us';
        else if (item === 'Contact')    href = '/contact';
        else if (item !== 'Home')       href = `/${item.toLowerCase()}`;

        return (
          <li key={item}>
            <Link
              href={href}
              className="block text-base text-black font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </Link>
          </li>
        );
      })}
      {!loading && (
        <li>
          {user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="block text-base text-black font-medium"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="block text-base text-black font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </li>
      )}
    </ul>
  </div>
</div>


  {/* Desktop Right Side */}
  <div className="hidden sm:flex absolute inset-y-0 pt-6 right-4 pr-6 items-center space-x-4">
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
        <div className="flex flex-col text-right">
          <span className="text-xs text-black">{user.email}</span>
          <button onClick={handleLogout} className="text-xs text-black">
            Logout
          </button>
        </div>
      </>
    ) : (
      <Link href="/login" className={`text-sm text-black font-medium ${commonLinkStyles}`}>
        Login
      </Link>
    )}
  </div>
</nav>
  );
}
