import type { Metadata } from 'next';

const title = 'Lomba Desain Kemasan | PRIDE Industri 2026';
const description =
  'Daftar Lomba Desain Kemasan PRIDE Industri 2026 untuk menghadirkan inovasi kemasan ramah lingkungan bagi produk kuliner berbahan dasar lokal.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/competition/desain-kemasan' },
  openGraph: {
    title,
    description,
    url: '/competition/desain-kemasan',
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

export default function DesainKemasanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
