// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/app/lib/NavBar';
import { montserratFont } from '@/app/lib/fonts';
import { Cormorant_Garamond } from 'next/font/google';
import { Fira_Code } from 'next/font/google';
import { Roboto } from 'next/font/google';
import { Playfair_Display } from 'next/font/google';
import { AppCheckProvider } from '@/app/lib/AppCheckProvider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
});
const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fira-code',
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Property Hall',
  description: 'Property Hall - Your Gateway to Real Estate Excellence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
        ${montserratFont.className}
        ${cormorant.variable}
        ${firaCode.variable}
        ${roboto.variable}
        ${playfair.variable}
      `}
    >
      <body>
        <AppCheckProvider>
          <NavBar />
          <main>{children}</main>
        </AppCheckProvider>
      </body>
    </html>
  );
}
