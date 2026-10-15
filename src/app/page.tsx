'use client';

import { useState } from 'react';
import CinematicIntro from '@/components/ui/CinematicIntro';
import Navbar from '@/components/ui/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import CountdownSection from '@/components/sections/CountdownSection';
import AboutSection from '@/components/sections/AboutSection';
import ProgramSection from '@/components/sections/ProgramSection';
import CompetitionSection from '@/components/sections/CompetitionSection';
import LocationSection from '@/components/sections/LocationSection';
import FaqSection from '@/components/sections/FaqSection';
import Footer from '@/components/sections/Footer';

export default function HomePage() {
  const [introCompleted, setIntroCompleted] = useState(false);

  return (
    <>
      {/* Cinematic Camera Intro — runs once per session, handles reduced-motion */}
      <CinematicIntro onComplete={() => setIntroCompleted(true)} />

      {/* Main Website Experience */}
      <div
        className={`min-h-screen bg-[#0A0A0A] text-[#F5F0E8] transition-opacity duration-700 ${
          introCompleted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <CountdownSection />
          <AboutSection />
          <ProgramSection />
          <CompetitionSection />
          <LocationSection />
          <FaqSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
