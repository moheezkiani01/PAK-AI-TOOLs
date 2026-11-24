import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TabBar } from '@/components/TabBar';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { CurrencyProvider } from '@/components/CurrencyContext';
import { SITE } from '@/lib/site.config';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a6b5b',
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'AI Tools & Digital Subscriptions in Pakistan | PakAITools',
    template: '%s | PakAITools',
  },
  description:
    'Buy AI tools, design apps, VPNs and streaming plans in Pakistan with PKR pricing. Pay by JazzCash, EasyPaisa, SadaPay, NayaPay, UBL (bank transfer) and Binance (international). Fast delivery.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: SITE.domain,
    siteName: SITE.name,
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'PakAITools: AI tools and subscriptions in Pakistan, priced in PKR' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="antialiased flex flex-col min-h-screen">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <CurrencyProvider>
          <Header />
          <main id="main" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            {children}
          </main>
          <Footer />
          <TabBar />
          <WhatsAppFab />
        </CurrencyProvider>
      </body>
    </html>
  );
}
