// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/app/lib/NavBar';
import { montserratFont } from '@/app/lib/fonts';
import { Cormorant_Garamond } from 'next/font/google';

// Import Cormorant Garamond
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Property Hall',
  description: 'Property Hall - Your Gateway to Real Estate Excellence',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserratFont.className} ${cormorant.variable}`}>
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
