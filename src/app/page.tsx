import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ActivitiesDeckSection from '@/components/sections/ActivitiesDeckSection';
import ProgramSection from '@/components/sections/ProgramSection';
import CompetitionSection from '@/components/sections/CompetitionSection';
import LocationSection from '@/components/sections/LocationSection';
import FaqSection from '@/components/sections/FaqSection';
import Footer from '@/components/sections/Footer';
import CompetitionWelcomeBanner from '@/components/ui/CompetitionWelcomeBanner';

const title = 'PRIDE Industri 2026 — Festival IKM Kota Bandung';
const description =
  'Informasi PRIDE Industri 2026, festival industri kecil dan menengah Kota Bandung di Braga City Walk, termasuk agenda acara dan kompetisi kreatif.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'PRIDE Industri 2026',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/LANDING_BG.jpg',
        width: 1024,
        height: 682,
        alt: 'PRIDE Industri 2026 di Braga City Walk Bandung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/LANDING_BG.jpg'],
  },
};

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://prideindustri.web.id/#website',
  url: 'https://prideindustri.web.id',
  name: 'PRIDE Industri 2026',
  description,
  inLanguage: 'id-ID',
  creator: {
    '@type': 'Person',
    name: 'Muhammad Irsyad Andika',
    url: 'https://www.linkedin.com/in/irsyad-andika/',
    sameAs: ['https://www.linkedin.com/in/irsyad-andika/'],
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <CompetitionWelcomeBanner />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <div className="pride-content-flow">
          <AboutSection />
          <ActivitiesDeckSection />
          <ProgramSection />
          <CompetitionSection />
          <LocationSection />
          <FaqSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
