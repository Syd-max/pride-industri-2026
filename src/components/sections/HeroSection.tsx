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

function SparkleIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

export default function HeroSection() {
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const badgeKulinerRef = useRef<HTMLDivElement>(null);
  const badgeFesyenRef = useRef<HTMLDivElement>(null);
  const badgeKriyaRef = useRef<HTMLDivElement>(null);
  const badgeKemasanRef = useRef<HTMLDivElement>(null);
  const badgeVideoRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const headlineBlockRef = useRef<HTMLDivElement>(null);
  const heroLogosRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. INTRO ENTRANCE SEQUENCE (Fast, smooth & crisp)
    const t0 = setTimeout(() => {
      heroLogoRef.current?.classList.add('visible');
    }, 60);

    // Floating cursor badges
    const tBadge1 = setTimeout(() => badgeKulinerRef.current?.classList.add('visible'), 160);
    const tBadge2 = setTimeout(() => badgeFesyenRef.current?.classList.add('visible'), 240);
    const tBadge3 = setTimeout(() => badgeKriyaRef.current?.classList.add('visible'), 320);
    const tBadge4 = setTimeout(() => badgeKemasanRef.current?.classList.add('visible'), 400);
    const tBadge5 = setTimeout(() => badgeVideoRef.current?.classList.add('visible'), 480);

    // Headline Card, Subtitle & Organizer Logos
    const tHeadline = setTimeout(() => headlineBlockRef.current?.classList.add('visible'), 540);
    const tSub = setTimeout(() => heroSubtitleRef.current?.classList.add('visible'), 620);
    const tLogos = setTimeout(() => heroLogosRef.current?.classList.add('visible'), 700);

    return () => {
      clearTimeout(t0);
      clearTimeout(tBadge1);
      clearTimeout(tBadge2);
      clearTimeout(tBadge3);
      clearTimeout(tBadge4);
      clearTimeout(tBadge5);
      clearTimeout(tHeadline);
      clearTimeout(tSub);
      clearTimeout(tLogos);
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

        {/* Hero Section — TIDY, SPACIOUS & ELEGANT */}
        <section className="flow-hero-section" id="heroSection" ref={heroSectionRef}>
          {/* Official Logo Placed Full In Front with Corner Badges */}
          <div className="hero-logo-wrap" ref={heroLogoRef}>
            {/* Ambient Warm Backlight */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,184,0,0.3)_0%,_rgba(229,25,55,0.15)_50%,_transparent_70%)] blur-2xl pointer-events-none" />

            <Image
              src="/LOGO_PRIDE_INDUSTRI.png"
              alt="Logo Resmi PRIDE Industri 2026"
              fill
              priority
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 580px, 620px"
              className="object-contain"
            />

            {/* Floating Cursor Tag: Fesyen Binaan (Top-Left) — Desktop Only (md and up) */}
            <div className="cursor-badge badge-fesyen hidden md:inline-flex" ref={badgeFesyenRef}>
              <FesyenIcon className="w-3.5 h-3.5 text-blue-200" />
              <span>Fesyen Binaan</span>
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Kuliner Lokal (Top-Right) — Desktop Only (md and up) */}
            <div className="cursor-badge badge-kuliner hidden md:inline-flex" ref={badgeKulinerRef}>
              <KulinerIcon className="w-3.5 h-3.5 text-orange-200" />
              <span>Kuliner Lokal</span>
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Kriya & Kerajinan (Mid-Left) — Desktop Only (md and up) */}
            <div className="cursor-badge badge-kriya hidden md:inline-flex" ref={badgeKriyaRef}>
              <KriyaIcon className="w-3.5 h-3.5 text-purple-200" />
              <span>Kriya &amp; Kerajinan</span>
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Video 1 Menit (Bottom-Left) — Desktop Only (md and up) */}
            <div className="cursor-badge badge-video hidden md:inline-flex" ref={badgeVideoRef}>
              <VideoIcon className="w-3.5 h-3.5 text-rose-200" />
              <span>Lomba Video 1 Menit</span>
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Desain Kemasan (Bottom-Right) — Desktop Only (md and up) */}
            <div className="cursor-badge badge-kemasan hidden md:inline-flex" ref={badgeKemasanRef}>
              <KemasanIcon className="w-3.5 h-3.5 text-emerald-200" />
              <span>Lomba Desain Kemasan</span>
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>
          </div>

          {/* Clean Dedicated Mobile Category Chips Row (md:hidden) */}
          <div className="hero-mobile-categories-row md:hidden">
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

          {/* Clean, Elegant Headline Title with Enhanced Visual Styling & Smooth Entrance */}
          <div className="headline-block" ref={headlineBlockRef}>
            {/* Top Specular Shimmer Line */}
            <div className="headline-glow-ambient" />

            {/* Event Category Tag Pill — Sleek, Responsive, Single-Line Capsule */}
            <div className="headline-tag-pill">
              <SparkleIcon className="tag-sparkle-icon" />
              <span className="tag-text">
                <span className="hidden sm:inline">Festival Industri Kreatif &amp; Seni Kota Bandung</span>
                <span className="sm:hidden">Festival Industri Kreatif</span>
              </span>
              <span className="tag-dot">•</span>
              <span className="tag-location">27–28 Nov 2026</span>
            </div>

            <h1 className="hero-title-clean">
              Pagelaran Ragam Inovasi <span className="title-amp">&amp;</span> Eksistensi
            </h1>

            <p className="hero-subtitle-clean" ref={heroSubtitleRef}>
              Merayakan kebangkitan industri kreatif Kota Bandung: pameran produk fesyen, kuliner, dan kriya binaan, panggung apresiasi seni, serta kompetisi bergengsi di Braga City Walk.
            </p>
          </div>

          {/* Real-Time Live Dot-Matrix Countdown (Compact & Integrated into Page Awal) */}
          <CompactHeroCountdown />

          {/* Official Organizers & Partners Logo Bar */}
          <div className="hero-organizer-card" ref={heroLogosRef}>
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

          {/* Clean Scroll Cue Indicator (Inviting exploration to About section) */}
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
