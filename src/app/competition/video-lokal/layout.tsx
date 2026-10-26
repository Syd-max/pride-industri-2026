import type { Metadata } from 'next';

const title = 'Lomba Video 1 Menit | PRIDE Industri 2026';
const description =
  'Daftar Lomba Video 1 Menit PRIDE Industri 2026 dan abadikan karya lokal di Braga City Walk Bandung dalam video vertikal berdurasi maksimal 60 detik.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/competition/video-lokal' },
  openGraph: {
    title,
    description,
    url: '/competition/video-lokal',
    siteName: 'PRIDE Industri 2026',
    locale: 'id_ID',
    type: 'website',
    images: ['/LANDING_BG.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/LANDING_BG.jpg'],
  },
};

export default function VideoLokalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
