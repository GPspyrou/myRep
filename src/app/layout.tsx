// app/layout.tsx
import type { Metadata } from "next";
import { Montserrat } from "next/font/google"; // 👈 use Montserrat now
import "./globals.css";
import NavBar from "@/app/lib/NavBar"; // import your NavBar

const montserrat = Montserrat({ 
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
    <html lang="en">
      <body className={`${montserrat.variable} font-sans`}> 
        <NavBar /> {/* Render NavBar */}
        <main className="mt-[100px]">
          {children}
        </main>
      </body>
    </html>
  );
}