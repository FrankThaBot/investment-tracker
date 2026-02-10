import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Investment Tracker - Portfolio Management Made Simple',
  description: 'Track your investments, analyze performance, and prepare for different market scenarios. A modern portfolio tracker built with Next.js.',
  keywords: 'investment, portfolio, tracker, stocks, crypto, finance, market analysis',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}