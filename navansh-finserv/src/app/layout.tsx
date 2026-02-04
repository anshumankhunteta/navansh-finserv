import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Navansh Finserv | Trusted Insurance & Wealth Expert in India",
  description:
    "Comprehensive Insurance, Wealth, and Loan Solutions tailored for families and businesses. 15+ years of trusted expertise in financial services.",
  keywords: [
    "insurance",
    "financial services",
    "wealth management",
    "mutual funds",
    "health insurance",
    "life insurance",
    "corporate loans",
    "India",
  ],
  authors: [{ name: "Navansh Finserv" }],
  openGraph: {
    title: "Navansh Finserv | Trusted Insurance & Wealth Expert in India",
    description:
      "Comprehensive Insurance, Wealth, and Loan Solutions tailored for families and businesses.",
    type: "website",
    locale: "en_IN",
    siteName: "Navansh Finserv",
  },
  twitter: {
    card: "summary_large_image",
    title: "Navansh Finserv | Trusted Insurance & Wealth Expert",
    description:
      "Comprehensive Insurance, Wealth, and Loan Solutions tailored for you.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: "Navansh Finserv",
  description:
    "Comprehensive Insurance, Wealth, and Loan Solutions tailored for families and businesses.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  priceRange: "$$",
  areaServed: "India",
  serviceType: [
    "Insurance Services",
    "Wealth Management",
    "Corporate Loans",
    "Mutual Funds",
    "Health Insurance",
    "Life Insurance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
