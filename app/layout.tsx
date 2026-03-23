import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Obsidian Flux | Financial Intelligence Engine',
  description: 'Harness the power of Obsidian Flux to synthesize complex market data into executable personal strategies.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-on-background font-body selection:bg-primary selection:text-black antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
