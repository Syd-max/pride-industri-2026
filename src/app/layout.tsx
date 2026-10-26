import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, Caveat, Plus_Jakarta_Sans, Poppins } from 'next/font/google';
import './globals.css';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
  weight: ['600', '700'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://prideindustri.web.id'),
  authors: [
    {
      name: 'Muhammad Irsyad Andika',
      url: 'https://www.linkedin.com/in/irsyad-andika/',
    },
  ],
  creator: 'Muhammad Irsyad Andika',
  title: {
    default: 'PRIDE Industri 2026 — Pagelaran Ragam Inovasi dan Eksistensi',
    template: '%s | PRIDE Industri 2026',
  },
  description:
    'PRIDE Industri 2026 — Pagelaran Ragam Inovasi dan Eksistensi. Festival Industri Kecil dan Menengah Kota Bandung. 27-29 November 2026 di Braga City Walk, Bandung.',
  keywords: [
    'PRIDE Industri 2026',
    'Braga City Walk',
    'IKM Bandung',
    'Festival Industri',
    'Lomba Desain Kemasan',
    'Lomba Video',
    'Bandung',
    'Disdagin Bandung',
  ],
  openGraph: {
    title: 'PRIDE Industri 2026',
    description:
      'Pagelaran Ragam Inovasi dan Eksistensi — 27-29 November 2026, Braga City Walk, Bandung',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/LANDING_BG.jpg',
        width: 1440,
        height: 810,
        alt: 'PRIDE Industri 2026 — Braga City Walk Bandung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRIDE Industri 2026',
    description: 'Pagelaran Ragam Inovasi dan Eksistensi, Braga City Walk, 27-29 Nov 2026',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'lNG_zbyCguYORE93FBNVR40iEat2Hmo_qVg8HFaroAw',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#1652F0',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${playfair.variable} ${inter.variable} ${caveat.variable} ${plusJakarta.variable} ${poppins.variable}`}>
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
