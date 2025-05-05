// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from 'next/font/google';
import "./globals.css";
import NavBar from "@/app/lib/NavBar"; // import your NavBar

const montserratFont = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
  weight: ["400", "700"], // specify the font weights you need
  display: "swap", // optional but good for performance
});

export const metadata: Metadata = {
  title: "Property Hall",
  description: "Property Hall - Your Gateway to Real Estate Excellence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserratFont.variable}>
      <body > 
        <NavBar /> {/* Render NavBar */}
        <main className="mt-[100px]">
          {children}
        </main>
      </body>
    </html>
  );
}