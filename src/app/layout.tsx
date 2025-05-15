// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/app/lib/NavBar";
import { montserratFont } from "@/app/lib/fonts";

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
    <html lang="en" className={montserratFont.className}>
      <head>
       
        
      </head>
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
