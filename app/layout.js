"use client"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { usePathname } from 'next/navigation'; // <-- Important

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {!isAdminRoute && <Navbar />}
        
        {children}
        
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}
