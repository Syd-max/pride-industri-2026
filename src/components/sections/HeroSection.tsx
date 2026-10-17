'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

function SparkleIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function BotIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

function FilePdfIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <polyline points="9 15 12 18 15 15" />
    </svg>
  );
}

export default function HeroSection() {
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const browserStageRef = useRef<HTMLDivElement>(null);
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const badgeKulinerRef = useRef<HTMLDivElement>(null);
  const badgeFesyenRef = useRef<HTMLDivElement>(null);
  const badgeKemasanRef = useRef<HTMLDivElement>(null);
  const badgeVideoRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const headlineBlockRef = useRef<HTMLDivElement>(null);
  const heroLogosRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // Chat message refs
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const msg1Ref = useRef<HTMLDivElement>(null);
  const msg2Ref = useRef<HTMLDivElement>(null);
  const msg3Ref = useRef<HTMLDivElement>(null);
  const msg4Ref = useRef<HTMLDivElement>(null);
  const btnRepRef = useRef<HTMLButtonElement>(null);
  const simCursorRef = useRef<SVGSVGElement>(null);
  const msg5Ref = useRef<HTMLDivElement>(null);
  const msg6Ref = useRef<HTMLDivElement>(null);
  const msg7Ref = useRef<HTMLDivElement>(null);
  const chatComposerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Helper math utilities
    function clamp(val: number, min: number, max: number) {
      return Math.max(min, Math.min(max, val));
    }

    function mapRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
      const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
      return outMin + t * (outMax - outMin);
    }

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // 1. INTRO ENTRANCE SEQUENCE (Fast, smooth & crisp)
    const t0 = setTimeout(() => {
      heroLogoRef.current?.classList.add('visible');
    }, 60);

    // Floating cursor badges
    const tBadge1 = setTimeout(() => badgeKulinerRef.current?.classList.add('visible'), 160);
    const tBadge2 = setTimeout(() => badgeFesyenRef.current?.classList.add('visible'), 240);
    const tBadge3 = setTimeout(() => badgeKemasanRef.current?.classList.add('visible'), 320);
    const tBadge4 = setTimeout(() => badgeVideoRef.current?.classList.add('visible'), 400);

    // Headline Card, Subtitle & Organizer Logos
    const tHeadline = setTimeout(() => headlineBlockRef.current?.classList.add('visible'), 480);
    const tSub = setTimeout(() => heroSubtitleRef.current?.classList.add('visible'), 580);
    const tLogos = setTimeout(() => heroLogosRef.current?.classList.add('visible'), 680);

    // Browser Mockup rises into bottom of viewport (peeking bar)
    const tBrowser = setTimeout(() => {
      browserStageRef.current?.classList.add('intro-ready');
      updateTimeline(getScrollProgress());
    }, 800);

    // Calculate scroll progress within scrollStage
    function getScrollProgress(): number {
      const stage = scrollStageRef.current;
      if (!stage) return 0;
      const rect = stage.getBoundingClientRect();
      const scrollDistance = stage.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) return 0;
      const currentScroll = -rect.top;
      return clamp(currentScroll / scrollDistance, 0, 1);
    }

    // 2. MASTER TIMELINE CHOREOGRAPHY (p = 0.0 to 1.0)
    // Smooth 5-phase camera choreography (Rise -> Zoom In -> Chat Play -> Zoom Out -> Settle)
    // 100% GPU transform & opacity composition, zero forced layout reflow
    function updateTimeline(p: number) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      let heroY = 0;
      let heroOpacity = 1;
      let browserY = 0;
      let browserScale = 1;
      let browserOpacity = 1;

      if (isMobile) {
        // Mobile 5-Phase Camera Dynamics
        const mobileTargetRise = (window.innerHeight || 700) * 0.84;
        if (p <= 0.18) {
          // Phase 1: Hero lifts out, Browser rises into center screen
          const t = easeInOutCubic(mapRange(p, 0, 0.18, 0, 1));
          heroY = -280 * t;
          heroOpacity = Math.max(0, 1 - 1.25 * t);
          browserY = -mobileTargetRise * t;
          browserScale = 1;
          browserOpacity = mapRange(p, 0.01, 0.06, 0, 1);
        } else if (p <= 0.30) {
          // Phase 2: Camera zooms in on Helpdesk (scale 1.0 -> 1.06)
          const t = easeInOutCubic(mapRange(p, 0.18, 0.30, 0, 1));
          heroY = -340;
          heroOpacity = 0;
          browserY = -mobileTargetRise + 10 * t;
          browserScale = 1.0 + 0.06 * t;
          browserOpacity = 1;
        } else if (p <= 0.78) {
          // Phase 3: Holding zoomed chat focus with subtle conversation follow drift
          const drift = mapRange(p, 0.30, 0.78, 0, 1);
          heroY = -340;
          heroOpacity = 0;
          browserY = -mobileTargetRise + 10 - 22 * drift;
          browserScale = 1.06;
          browserOpacity = 1;
        } else if (p <= 0.90) {
          // Phase 4: Camera zooms back out to full overview (scale 1.06 -> 1.0)
          const t = easeInOutCubic(mapRange(p, 0.78, 0.90, 0, 1));
          heroY = -340;
          heroOpacity = 0;
          browserY = -mobileTargetRise - 12 + 12 * t;
          browserScale = 1.06 - 0.06 * t;
          browserOpacity = 1;
        } else {
          // Phase 5: Settle cleanly for handover to next section
          heroY = -340;
          heroOpacity = 0;
          browserY = -mobileTargetRise;
          browserScale = 1.0;
          browserOpacity = 1;
        }

        // Fade out mobile scroll cue as user scrolls
        if (scrollCueRef.current) {
          scrollCueRef.current.style.opacity = String(Math.max(0, 1 - p * 12));
        }
      } else {
        // Desktop 5-Phase Camera Dynamics (Exact Adaptation from Reference)
        if (p <= 0.18) {
          // Phase 1: Hero ascends, Browser rises into center stage
          const t = easeInOutCubic(mapRange(p, 0, 0.18, 0, 1));
          heroY = -360 * t;
          heroOpacity = Math.max(0, 1 - 1.15 * t);
          browserY = -560 * t;
          browserScale = 1;
          browserOpacity = 1;
        } else if (p <= 0.30) {
          // Phase 2: Camera zooms in on Helpdesk chat (scale 1.0 -> 1.14)
          const t = easeInOutCubic(mapRange(p, 0.18, 0.30, 0, 1));
          heroY = -360 - 60 * t;
          heroOpacity = 0;
          browserY = -560 + 20 * t;
          browserScale = 1.0 + 0.14 * t;
          browserOpacity = 1;
        } else if (p <= 0.78) {
          // Phase 3: Holding zoomed chat focus with subtle tracking drift
          const drift = mapRange(p, 0.30, 0.78, 0, 1);
          heroY = -420;
          heroOpacity = 0;
          browserY = -540 - 24 * drift;
          browserScale = 1.14;
          browserOpacity = 1;
        } else if (p <= 0.90) {
          // Phase 4: Camera zooms back out to full overview (scale 1.14 -> 1.0)
          const t = easeInOutCubic(mapRange(p, 0.78, 0.90, 0, 1));
          heroY = -420;
          heroOpacity = 0;
          browserY = -564 + 14 * t;
          browserScale = 1.14 - 0.14 * t;
          browserOpacity = 1;
        } else {
          // Phase 5: Settle cleanly
          heroY = -420;
          heroOpacity = 0;
          browserY = -550;
          browserScale = 1.0;
          browserOpacity = 1;
        }
      }

      if (heroSectionRef.current) {
        heroSectionRef.current.style.transform = `translate3d(0, ${heroY.toFixed(2)}px, 0)`;
        heroSectionRef.current.style.opacity = String(heroOpacity.toFixed(3));
      }

      if (browserStageRef.current) {
        browserStageRef.current.style.transform = `translate3d(0, ${browserY.toFixed(2)}px, 0) scale(${browserScale.toFixed(4)})`;
        browserStageRef.current.style.opacity = String(browserOpacity);
      }

      // Step-by-Step Interactive Chat Sequence (Matching Reference Cadence)
      msg1Ref.current?.classList.toggle('shown', p >= 0.22);
      msg2Ref.current?.classList.toggle('shown', p >= 0.30);
      msg3Ref.current?.classList.toggle('shown', p >= 0.38);
      msg4Ref.current?.classList.toggle('shown', p >= 0.46);

      // Simulated cursor hover & click on "Buka Formulir Pendaftaran"
      const showCursor = p >= 0.50 && p <= 0.57;
      const isPressing = p >= 0.53 && p <= 0.56;
      simCursorRef.current?.classList.toggle('active', showCursor);
      simCursorRef.current?.classList.toggle('pressing', isPressing);
      btnRepRef.current?.classList.toggle('clicked', isPressing);

      // Immediate follow-up after click: Confirmation & Handover
      msg5Ref.current?.classList.toggle('shown', p >= 0.57);
      msg6Ref.current?.classList.toggle('shown', p >= 0.63);
      msg7Ref.current?.classList.toggle('shown', p >= 0.69);
      chatComposerRef.current?.classList.toggle('shown', p >= 0.75);

      // Smooth proportional chat scroll without forced synchronous layout reflow
      if (chatMessagesRef.current) {
        const el = chatMessagesRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;
        if (maxScroll > 0) {
          const scrollFactor = clamp((p - 0.48) / 0.28, 0, 1);
          el.scrollTop = scrollFactor * maxScroll;
        }
      }
    }

    // High-performance RAF scheduler: zero duplicate ticks, clean cleanup
    let rafId: number | null = null;
    let isHeroInView = true;

    const heroObserver = new IntersectionObserver(
      (entries) => {
        isHeroInView = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );

    if (scrollStageRef.current) {
      heroObserver.observe(scrollStageRef.current);
    }

    const handleScroll = () => {
      if (!isHeroInView) return;
      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          updateTimeline(getScrollProgress());
          rafId = null;
        });
      }
    };

    const handleResize = () => {
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial render call on mount
    updateTimeline(getScrollProgress());
    window.requestAnimationFrame(() => {
      updateTimeline(getScrollProgress());
    });

    return () => {
      clearTimeout(t0);
      clearTimeout(tBadge1);
      clearTimeout(tBadge2);
      clearTimeout(tBadge3);
      clearTimeout(tBadge4);
      clearTimeout(tHeadline);
      clearTimeout(tSub);
      clearTimeout(tLogos);
      clearTimeout(tBrowser);
      if (rafId !== null) cancelAnimationFrame(rafId);
      heroObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="scroll-stage" id="scrollStage" ref={scrollStageRef}>
      <div className="flow-viewport">
        {/* Full Braga Scenic Background (Unzoomed & Uncompressed) */}
        <div className="scenic-bg-wrap">
          <div className="scenic-bg-ambient" />
          <div className="scenic-bg-photo" />
          <div className="scenic-foreground" />
        </div>

        {/* Hero Section — TIDY, SPACIOUS & ELEGANT */}
        <section className="flow-hero-section" id="heroSection" ref={heroSectionRef}>
          {/* Official Logo Placed Full In Front with 4 Corner Badges */}
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

            {/* Floating Cursor Tag: Video 1 Menit (Bottom-Left) — Desktop Only (md and up) */}
            <div className="cursor-badge badge-video hidden md:inline-flex" ref={badgeVideoRef}>
              <VideoIcon className="w-3.5 h-3.5 text-purple-200" />
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
            <span className="mob-chip mob-chip-video">
              <VideoIcon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
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
              Merayakan kebangkitan industri kreatif Kota Bandung: pameran produk fesyen &amp; kuliner binaan, panggung apresiasi seni, dan kompetisi bergengsi di Jalan Braga &amp; Hotel Papandayan.
            </p>
          </div>

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

          {/* Clean Mobile Scroll Indicator (Replaces sliced cut-off browser bar with clean iOS-style cue) */}
          <div className="mobile-scroll-cue sm:hidden" ref={scrollCueRef}>
            <div className="scroll-cue-pill">
              <span>Scroll untuk eksplorasi</span>
              <svg className="w-3.5 h-3.5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </section>

        {/* macOS Browser Window Showcase: PEEKS AT BOTTOM, NEVER COVERS PAGE AWAL */}
        <div className="browser-stage" ref={browserStageRef}>
          <div className="browser-frame">
            <div className="browser-inner">
              
              {/* iOS Sheet Grab Handle Bar (Mobile Only - Apple Native Sheet feel) */}
              <div className="ios-sheet-handle-bar sm:hidden">
                <div className="ios-sheet-handle" />
              </div>

              {/* Safari Top Bar (Desktop & Tablet Only) */}
              <div className="safari-bar hidden sm:flex">
                <div className="safari-left">
                  <div className="traffic-lights">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <div className="safari-icons">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>

                <div className="safari-address">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <div className="safari-address-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span className="hidden sm:inline">prideindustri.bandung.go.id/agenda</span>
                    <span className="sm:hidden">prideindustri.bandung.go.id</span>
                  </div>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </div>

                <div className="safari-icons">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </div>
              </div>

              {/* Clean, Focused Interactive Chat Experience */}
              <div className="app-workspace">
                
                {/* Live Interactive Helpdesk Stream */}
                <section className="chat-column">
                  <div className="chat-header">
                    <div className="chat-contact">
                      <div className="chat-contact-avatar">PR</div>
                      <div className="chat-contact-meta">
                        <div className="chat-contact-name">Helpdesk Resmi PRIDE 2026</div>
                        <div className="chat-contact-status">
                          <span className="status-dot online" />
                          <span>Disdagin Kota Bandung</span>
                        </div>
                      </div>
                    </div>
                    <div className="chat-actions">
                      <span className="btn-chat-top hidden sm:flex">
                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>27–28 Nov</span>
                      </span>
                      <span className="btn-chat-top dark">
                        <span className="status-dot online" />
                        <span>Live Helpdesk</span>
                      </span>
                    </div>
                  </div>

                  {/* Animated Chat Messages (Automated scroll-driven stream) */}
                  <div className="chat-messages" ref={chatMessagesRef}>
                    
                    {/* Msg 1: Bot Initial Prompt (Always visible, never blank) */}
                    <div className="msg-item msg-right shown" ref={msg1Ref}>
                      <div className="bubble-dark">
                        <span>Sampurasun! Selamat datang di Portal PRIDE Industri 2026. Ada yang bisa kami bantu seputar pendaftaran lomba atau jadwal pameran?</span>
                        <span className="bubble-time">10:00</span>
                      </div>
                      <div className="bot-badge">
                        <BotIcon className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                    </div>

                    {/* Msg 2: Customer Reply */}
                    <div className="msg-item msg-left" ref={msg2Ref}>
                      <div className="bubble-light">
                        <span>Halo, saya ingin mendaftar Lomba Desain Kemasan IKM &amp; Video Braga.</span>
                        <span className="bubble-time-light">10:01</span>
                      </div>
                    </div>

                    {/* Msg 3: Bot Delay Notice */}
                    <div className="msg-item msg-right" ref={msg3Ref}>
                      <div className="bubble-dark">
                        <span>Pendaftaran 100% GRATIS dengan total hadiah Rp 30.000.000. Silakan pilih opsi langkah selanjutnya:</span>
                        <span className="bubble-time">10:01</span>
                      </div>
                      <div className="bot-badge">
                        <BotIcon className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                    </div>

                    {/* Msg 4: Bot Interactive Option Buttons */}
                    <div className="msg-item bot-quick-actions" ref={msg4Ref}>
                      <a href="/syarat-desain-kemasan.pdf" download className="btn-quick-action flex items-center gap-1.5" style={{ textDecoration: 'none' }}>
                        <FilePdfIcon className="w-3.5 h-3.5 text-rose-400" />
                        <span>Unduh Panduan PDF</span>
                      </a>
                      <button
                        className="btn-quick-action cursor-pointer"
                        ref={btnRepRef}
                        onClick={() => {
                          window.location.href = '/competition/desain-kemasan';
                        }}
                      >
                        Buka Formulir Pendaftaran
                      </button>
                      
                      {/* Simulated Cursor Hand */}
                      <svg
                        className="simulated-cursor"
                        ref={simCursorRef}
                        viewBox="0 0 24 24"
                        fill="#ffffff"
                        stroke="#111827"
                        strokeWidth="1.8"
                      >
                        <path d="M9 11V4a2 2 0 0 1 4 0v5h2a2 2 0 0 1 2 2v5a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4v-3a2 2 0 0 1 4 0z" />
                      </svg>
                    </div>

                    {/* Msg 5: Selected Option */}
                    <div className="msg-item msg-left" ref={msg5Ref}>
                      <div className="bubble-light">
                        <span>Membuka formulir pendaftaran Lomba Desain Kemasan...</span>
                        <span className="bubble-time-light">10:02</span>
                      </div>
                    </div>

                    {/* Msg 6: System Handover Notice */}
                    <div className="msg-item system-pill-wrap" ref={msg6Ref}>
                      <span className="system-pill inline-flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Formulir registrasi online siap diisi · Tersedia QR Check-in</span>
                      </span>
                    </div>

                    {/* Msg 7: Panitia Response */}
                    <div className="msg-item msg-right" ref={msg7Ref}>
                      <div className="bubble-dark">
                        <span>Halo! Tim Disdagin siap memverifikasi berkas Anda. Batas submit karya tanggal 20 November 2026. Sampai jumpa di Braga!</span>
                        <span className="bubble-time">10:02</span>
                      </div>
                      <div className="agent-chat-avatar">DG</div>
                    </div>
                  </div>

                  {/* Bottom Input Composer */}
                  <div className="chat-composer" ref={chatComposerRef}>
                    <div className="composer-placeholder">Tulis pertanyaan seputar festival PRIDE 2026...</div>
                    <div className="composer-toolbar">
                      <div className="composer-tools">
                        <span title="Lampirkan Dokumen" className="cursor-pointer hover:text-slate-600">
                          <svg className="w-4 h-4 text-slate-400 hover:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <svg className="w-3 h-3 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                          Braga City Walk
                        </span>
                      </div>
                      <div className="composer-right">
                        <Link href="/competition/desain-kemasan" className="btn-assign" style={{ textDecoration: 'none' }}>
                          Daftar Sekarang
                        </Link>
                        <button
                          type="button"
                          className="btn-send flex items-center gap-1 cursor-pointer"
                          onClick={() => {
                            window.location.href = '/competition/desain-kemasan';
                          }}
                        >
                          <span>Kirim</span>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 14-7-7 14-2-5-5-2z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
