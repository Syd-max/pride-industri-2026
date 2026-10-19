import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ActivitiesDeckSection from '@/components/sections/ActivitiesDeckSection';
import ProgramSection from '@/components/sections/ProgramSection';
import CompetitionSection from '@/components/sections/CompetitionSection';
import LocationSection from '@/components/sections/LocationSection';
import FaqSection from '@/components/sections/FaqSection';
import Footer from '@/components/sections/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070a13] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <ActivitiesDeckSection />
        <ProgramSection />
        <CompetitionSection />
        <LocationSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
