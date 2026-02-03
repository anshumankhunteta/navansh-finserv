import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Navansh Finserv | Trusted Insurance & Wealth Expert in India",
  description: "Comprehensive Insurance, Wealth, and Loan Solutions tailored for you. 15 Years of Trust.",
  openGraph: {
    title: "Navansh Finserv | Trusted Insurance & Wealth Expert in India",
    description: "Comprehensive Insurance, Wealth, and Loan Solutions tailored for you.",
    type: "website",
    locale: "en_IN",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "Navansh Finserv",
  "image": "", // Add logo URL if available
  "description": "Comprehensive Insurance, Wealth, and Loan Solutions tailored for you.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "priceRange": "$$"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} antialiased font-sans flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
