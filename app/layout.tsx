import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-headline" });

export const metadata: Metadata = {
  title: "Obsidian Flux | Financial Intelligence Engine",
  description: "Harness the power of Obsidian Flux to synthesize complex market data into executable personal strategies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} dark`}>
      <body className="bg-background text-on-background font-body selection:bg-primary selection:text-black antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
