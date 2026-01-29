import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import MUIThemeProvider from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Navansh Financial Services - Protecting Futures with 15 Years of Experience",
  description: "Expert insurance and financial services for life, health, mutual funds, and asset protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MUIThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </MUIThemeProvider>
      </body>
    </html>
  );
}
