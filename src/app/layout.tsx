import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'FuelUp — Smart Vehicle Management & Mileage Tracker',
  description:
    'Track fuel expenses, monitor vehicle efficiency, manage maintenance schedules, and save money with FuelUp — the ultimate vehicle management PWA.',
  keywords: ['fuel tracker', 'mileage tracker', 'vehicle management', 'car maintenance', 'fuel efficiency'],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
