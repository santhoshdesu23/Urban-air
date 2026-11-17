import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/app-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'BreatheWise — Urban Air Quality Assistant',
  description:
    'Know your air. Change your routine. Protect your surroundings. Production-ready atmospheric intelligence, personalized low-emission daily routines, and indoor air protection.',
  keywords: [
    'AQI',
    'Air Quality',
    'CPCB',
    'PM2.5',
    'Urban Smog',
    'Clean Air',
    'Air Purifier',
    'Pollution Assistant',
  ],
  authors: [{ name: 'BreatheWise Engineering Team' }],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#047857',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        {/* Accessible Skip Link for Keyboard / Screen Readers */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <AppProvider>
          <Header />
          <main
            id="main-content"
            className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
          >
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
