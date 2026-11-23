import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'BizBoost Pro - Boost Your Google Business Profile',
  description: 'AI-powered Google Business Profile optimization tool. Get more reviews, improve your rating, and grow your business with smart QR codes and AI assistance.',
  keywords: 'Google Business Profile, reviews, QR code, AI reviews, business optimization, local SEO',
  authors: [{ name: 'BizBoost Pro' }],
  creator: 'BizBoost Pro',
  publisher: 'BizBoost Pro',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bizboost.pro',
    siteName: 'BizBoost Pro',
    title: 'BizBoost Pro - Boost Your Google Business Profile',
    description: 'AI-powered Google Business Profile optimization tool',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BizBoost Pro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizBoost Pro - Boost Your Google Business Profile',
    description: 'AI-powered Google Business Profile optimization tool',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
