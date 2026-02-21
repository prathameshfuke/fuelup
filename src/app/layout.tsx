import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Providers } from '@/components/layout/Providers';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'FuelUp | Precision Vehicle Management',
  description: 'Track fuel, maintenance, and telemetry with data-forward precision.',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0a', // neutral-950
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased selection:bg-primary/30 selection:text-white",
        inter.variable,
        jetbrainsMono.variable,
        spaceGrotesk.variable
      )}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
