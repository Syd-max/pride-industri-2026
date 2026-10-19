'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import CompactHeroCountdown from './CompactHeroCountdown';
import './hero-flow.css';

/* ============================================================
   APPLE CODE DESIGN VECTOR ICONS (SF SYMBOLS STYLE - NO EMOJIS, NO AI SLOP)
   ============================================================ */
function FesyenIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}

function KulinerIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
      <path d="M15 2v19" />
      <path d="M6 2v7a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V2" />
      <path d="M9 12v9" />
    </svg>
  );
}

function VideoIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="3" />
    </svg>
  );
}

function KemasanIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function KriyaIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

export default function HeroSection() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const headlineBlockRef = useRef<HTMLDivElement>(null);
  const heroLogosRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance sequence
    const t0 = setTimeout(() => {
      heroLogoRef.current?.classList.add('visible');
    }, 60);

    // Organizer Logos right below PRIDE Logo
    const tLogos = setTimeout(() => heroLogosRef.current?.classList.add('visible'), 220);

    // Clean Editorial Headline & Subtitle
    const tHeadline = setTimeout(() => headlineBlockRef.current?.classList.add('visible'), 380);
    const tSub = setTimeout(() => heroSubtitleRef.current?.classList.add('visible'), 480);

    return () => {
      clearTimeout(t0);
      clearTimeout(tLogos);
      clearTimeout(tHeadline);
      clearTimeout(tSub);
    };
  }, []);

  return (
    <div className="scroll-stage" id="scrollStage">
      <div className="flow-viewport">
        {/* Full Braga Scenic Background (Unzoomed & Uncompressed) */}
        <div className="scenic-bg-wrap">
          <div className="scenic-bg-ambient" />
          <div className="scenic-bg-photo" />
          <div className="scenic-foreground" />
        </div>

        {/* Hero Section */}
        <section className="flow-hero-section pride-hero" id="heroSection" ref={heroSectionRef}>
          {/* 1. Logo PRIDE: elemen terbesar & fokus utama */}
          <div className="pride-logo hero-logo-wrap hero-logo event-logo" ref={heroLogoRef}>
            {/* Ambient Warm Backlight */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,184,0,0.3)_0%,_rgba(229,25,55,0.15)_50%,_transparent_70%)] blur-2xl pointer-events-none" />

            <Image
              src="/LOGO_PRIDE_INDUSTRI.png"
              alt="PRIDE Industri 2026"
              fill
              priority
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 580px, 680px"
              className="object-contain"
            />
          </div>

          {/* 2. Highlights: mobile only (di bawah logo PRIDE) */}
          <div className="pride-highlights hero-mobile-categories-row md:hidden">
            <span className="mob-chip mob-chip-fesyen">
              <FesyenIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Fesyen Binaan</span>
            </span>
            <span className="mob-chip mob-chip-kuliner">
              <KulinerIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Kuliner Lokal</span>
            </span>
            <span className="mob-chip mob-chip-kriya">
              <KriyaIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Kriya &amp; Seni</span>
            </span>
            <span className="mob-chip mob-chip-video">
              <VideoIcon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Video 1 Menit</span>
            </span>
            <span className="mob-chip mob-chip-kemasan">
              <KemasanIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Desain Kemasan</span>
            </span>
          </div>

          {/* 3. Logo instansi: tepat di bawah logo PRIDE / highlights, ukuran lebih kecil */}
          <div className="pride-institution-logo hero-organizer-card organization-logo partner-logo" ref={heroLogosRef}>
            <div className="hero-organizer-inner">
              <div className="organizer-gov-wrap">
                <Image
                  src="/LOGOS_GOV_DISDAGIN_KEMILAU_CROPPED.png"
                  alt="Pemerintah Kota Bandung, DISDAGIN Kota Bandung, KEMILAU"
                  width={745}
                  height={97}
                  priority
                  className="organizer-gov-img"
                />
              </div>

              <div className="organizer-divider" />

              <div className="organizer-tactlink-wrap">
                <Image
                  src="/LOGO_TACTLINK_CROPPED.png"
                  alt="TACTLINK - Smart Directory With One Touch"
                  width={492}
                  height={454}
                  priority
                  className="organizer-tactlink-img"
                />
              </div>
            </div>
          </div>

          {/* 4. Judul dan tanggal */}
          <div className="pride-event-heading headline-block hero-title event-title" ref={headlineBlockRef}>
            <h1 className="pride-event-title hero-title-clean">
              Pagelaran Ragam Inovasi <span className="title-amp">&amp;</span> Eksistensi
            </h1>

            <p className="pride-event-date hero-subtitle-clean" ref={heroSubtitleRef}>
              27–28 November 2026
            </p>
          </div>

          {/* 5. Countdown: paling bawah, ukuran compact dan tidak mendominasi */}
          <div className="pride-countdown">
            <CompactHeroCountdown />
          </div>

          {/* Scroll Cue Indicator */}
          <div className="mobile-scroll-cue" ref={scrollCueRef}>
            <a href="#about" className="scroll-cue-pill">
              <span>Scroll untuk eksplorasi</span>
              <svg className="w-3.5 h-3.5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
