'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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

function FormIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function PaperclipIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function PinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CalendarIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function BuildingIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16" />
      <path d="M2 11h20" />
      <path d="M12 2 2 7h20z" />
      <path d="M6 11v7" />
      <path d="M10 11v7" />
      <path d="M14 11v7" />
      <path d="M18 11v7" />
    </svg>
  );
}

function TrophyIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}

export default function HeroSection() {
  const heroLogoRef = useRef<HTMLDivElement>(null);
  const badgeKulinerRef = useRef<HTMLDivElement>(null);
  const badgeFesyenRef = useRef<HTMLDivElement>(null);
  const badgeKemasanRef = useRef<HTMLDivElement>(null);
  const badgeVideoRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const headlineBlockRef = useRef<HTMLDivElement>(null);
  const heroLogosRef = useRef<HTMLDivElement>(null);
  const browserStageRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Automated Sequential Simulation State (Original 5-Column Dashboard Animation)
  const [activeStep, setActiveStep] = useState(0);
  const [cursorActive, setCursorActive] = useState(false);
  const [cursorPressing, setCursorPressing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 1. Smooth entrance of hero elements on initial load
  useEffect(() => {
    const t0 = setTimeout(() => heroLogoRef.current?.classList.add('visible'), 200);
    const tBadge1 = setTimeout(() => badgeKulinerRef.current?.classList.add('visible'), 450);
    const tBadge2 = setTimeout(() => badgeFesyenRef.current?.classList.add('visible'), 600);
    const tBadge3 = setTimeout(() => badgeKemasanRef.current?.classList.add('visible'), 750);
    const tBadge4 = setTimeout(() => badgeVideoRef.current?.classList.add('visible'), 900);
    const tHeadline = setTimeout(() => headlineBlockRef.current?.classList.add('visible'), 1050);
    const tSub = setTimeout(() => heroSubtitleRef.current?.classList.add('visible'), 1200);
    const tLogos = setTimeout(() => heroLogosRef.current?.classList.add('visible'), 1350);
    const tBrowser = setTimeout(() => browserStageRef.current?.classList.add('intro-ready'), 1500);

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
    };
  }, []);

  // 2. Continuous Automatic Simulation Loop (Populates sidebar, agenda, chat, and event details)
  const restartSimulation = useCallback(() => {
    setActiveStep(0);
    setCursorActive(false);
    setCursorPressing(false);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timeoutIds: NodeJS.Timeout[] = [];

    const scheduleLoop = () => {
      // Step 1: Nav Sidebar Section 1 pops
      timeoutIds.push(setTimeout(() => setActiveStep(1), 600));

      // Step 2: Nav Sidebar Sections 2, 3, 4 pop
      timeoutIds.push(setTimeout(() => setActiveStep(2), 1200));

      // Step 3: Agenda Highlights Cards 1, 2, 3 pop
      timeoutIds.push(setTimeout(() => setActiveStep(3), 2000));

      // Step 4: Chat Msg 1 appears
      timeoutIds.push(setTimeout(() => setActiveStep(4), 3000));

      // Step 5: Chat Msg 2 appears
      timeoutIds.push(setTimeout(() => setActiveStep(5), 4400));

      // Step 6: Chat Msg 3 appears
      timeoutIds.push(setTimeout(() => setActiveStep(6), 5600));

      // Step 7: Chat Msg 4 (Quick Actions) appears
      timeoutIds.push(setTimeout(() => setActiveStep(7), 6800));

      // Step 8: Apple cursor glides onto "Buka Formulir Pendaftaran"
      timeoutIds.push(setTimeout(() => setCursorActive(true), 7800));

      // Step 9: Cursor clicks button (press effect)
      timeoutIds.push(setTimeout(() => setCursorPressing(true), 8600));

      // Step 10: Cursor releases, Msg 5 (opening form notice) & Msg 6 (system verified pill)
      timeoutIds.push(setTimeout(() => {
        setCursorPressing(false);
        setCursorActive(false);
        setActiveStep(8);
      }, 9200));

      // Step 11: Right Event Details Panel Populates (Tanggal, Lokasi, Hadiah, Catatan)
      timeoutIds.push(setTimeout(() => setActiveStep(9), 10200));

      // Step 12: Chat Msg 7 (Disdagin closing response) appears
      timeoutIds.push(setTimeout(() => setActiveStep(10), 11400));

      // Step 13: Chat Composer slides up
      timeoutIds.push(setTimeout(() => setActiveStep(11), 12600));

      // Loop restart after 6.5s of comfortable readability
      timeoutIds.push(setTimeout(() => {
        restartSimulation();
        scheduleLoop();
      }, 19000));
    };

    // Initial sequence kickoff
    const initialStart = setTimeout(() => {
      scheduleLoop();
    }, 1800);
    timeoutIds.push(initialStart);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [isPaused, restartSimulation]);

  // Auto-scroll chat body smoothly to keep newest messages in view
  useEffect(() => {
    if (chatMessagesRef.current && activeStep >= 4) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [activeStep]);

  return (
    <div className="hero-flow-stage" id="heroStage">
      {/* Scenic Background (Blends seamlessly at bottom into #070a13 Countdown Runway) */}
      <div className="scenic-bg" />
      <div className="scenic-foreground" />

      <div className="flow-viewport">
        {/* Hero Section — TIDY, SPACIOUS & ELEGANT */}
        <section className="flow-hero-section" id="heroSection">
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

            {/* Floating Cursor Tag: Fesyen Binaan (Top-Left) */}
            <div className="cursor-badge badge-fesyen" ref={badgeFesyenRef}>
              <FesyenIcon className="w-3.5 h-3.5 text-blue-300" />
              <span>Fesyen Binaan</span>
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Kuliner Lokal (Top-Right) */}
            <div className="cursor-badge badge-kuliner" ref={badgeKulinerRef}>
              <KulinerIcon className="w-3.5 h-3.5 text-orange-300" />
              <span>Kuliner Lokal</span>
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Video 1 Menit (Bottom-Left) */}
            <div className="cursor-badge badge-video" ref={badgeVideoRef}>
              <VideoIcon className="w-3.5 h-3.5 text-purple-300" />
              <span>Lomba Video 1 Menit</span>
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Desain Kemasan (Bottom-Right) */}
            <div className="cursor-badge badge-kemasan" ref={badgeKemasanRef}>
              <KemasanIcon className="w-3.5 h-3.5 text-emerald-300" />
              <span>Lomba Desain Kemasan</span>
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>
          </div>

          {/* Clean, Elegant Headline Title with Enhanced Visual Styling */}
          <div className="headline-block" ref={headlineBlockRef}>
            <div className="headline-glow-ambient" />

            {/* Event Category Tag Pill */}
            <div className="headline-tag-pill">
              <SparkleIcon className="w-3.5 h-3.5 text-amber-500" />
              <span className="tag-text">Festival Industri Kreatif &amp; Seni Kota Bandung</span>
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
        </section>

        {/* macOS Browser Window Showcase: 5-COLUMN DASHBOARD WORKSPACE (AUTOMATIC SIMULATION, NO SLIDER) */}
        <div className="browser-stage" ref={browserStageRef}>
          <div className="browser-frame">
            <div className="browser-inner">
              
              {/* Safari Top Bar */}
              <div className="safari-bar">
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
                    <span>prideindustri.bandung.go.id/agenda</span>
                  </div>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </div>

                <div className="safari-icons">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </div>
              </div>

              {/* 5-Column Festival Application Workspace (Original Tab Layout) */}
              <div className="app-workspace">
                
                {/* Col 1: Narrow Icon Rail */}
                <aside className="icon-rail">
                  <div className="rail-group">
                    <div className="rail-logo">PI</div>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  </div>
                  <div className="rail-group">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                      BDG
                    </div>
                  </div>
                </aside>

                {/* Col 2: Navigation Filters Sidebar */}
                <aside className="nav-sidebar">
                  <div className="search-box">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <span>Cari agenda festival...</span>
                  </div>

                  <div className={`sidebar-section ${activeStep >= 1 ? 'populated' : ''}`}>
                    <div className="section-label">Panggung &amp; Jalur</div>
                    <div className="nav-row active">
                      <span className="nav-row-left">Semua Agenda</span>
                      <span className="nav-count">18</span>
                    </div>
                    <div className="nav-row">
                      <span className="nav-row-left">
                        <FesyenIcon className="w-3 h-3 text-blue-500" />
                        <span>Fesyen Binaan</span>
                      </span>
                      <span className="nav-count">6</span>
                    </div>
                    <div className="nav-row">
                      <span className="nav-row-left">
                        <KulinerIcon className="w-3 h-3 text-orange-500" />
                        <span>Kuliner Lokal</span>
                      </span>
                      <span className="nav-count">8</span>
                    </div>
                    <div className="nav-row">
                      <span className="nav-row-left">
                        <KemasanIcon className="w-3 h-3 text-emerald-500" />
                        <span>Pameran Kriya</span>
                      </span>
                      <span className="nav-count">4</span>
                    </div>
                  </div>

                  <div className={`sidebar-section ${activeStep >= 2 ? 'populated' : ''}`}>
                    <div className="section-label">Kompetisi 2026</div>
                    <div className="nav-row">
                      <span className="nav-row-left">● Desain Kemasan</span>
                      <span className="nav-count text-blue-600 font-bold">Rp 15Jt</span>
                    </div>
                    <div className="nav-row">
                      <span className="nav-row-left">● Video 1 Menit</span>
                      <span className="nav-count text-rose-600 font-bold">Rp 15Jt</span>
                    </div>
                  </div>

                  <div className={`sidebar-section ${activeStep >= 2 ? 'populated' : ''}`}>
                    <div className="section-label">Lokasi Resmi</div>
                    <div className="nav-row">
                      <span className="nav-row-left">Braga City Walk</span>
                      <span className="nav-count">Outdoor</span>
                    </div>
                    <div className="nav-row">
                      <span className="nav-row-left">Hotel Papandayan</span>
                      <span className="nav-count">Ballroom</span>
                    </div>
                  </div>

                  <div className={`sidebar-section ${activeStep >= 2 ? 'populated' : ''}`}>
                    <div className="section-label">Layanan Panitia</div>
                    <div className="agent-item">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                        DS
                      </div>
                      <div className="agent-meta">
                        <span className="agent-name">Helpdesk Disdagin</span>
                        <span className="agent-status"><span className="status-dot online" /> Online</span>
                      </div>
                    </div>
                    <div className="agent-item">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                        JR
                      </div>
                      <div className="agent-meta">
                        <span className="agent-name">Dewan Juri Desain</span>
                        <span className="agent-status"><span className="status-dot online" /> Online</span>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Col 3: Agenda Highlights Stream */}
                <section className="inbox-column">
                  <div className="col-header">
                    <span>Agenda 27–28 Nov</span>
                    <span style={{ color: '#9ca3af' }}>+</span>
                  </div>
                  <div className="inbox-filters">
                    <span className="filter-pill">Filter ▾</span>
                    <span className="filter-pill">Semua</span>
                    <span className="filter-pill">Terbaru</span>
                  </div>
                  <div className="inbox-list">
                    <div className={`inbox-card ${activeStep >= 3 ? 'populated' : ''}`}>
                      <div className="inbox-card-left">
                        <div className="inbox-avatar blue">FS</div>
                        <div className="inbox-text">
                          <div className="inbox-name">Opening &amp; Runway Show</div>
                          <div className="inbox-preview">Jalan Braga · 09:00 WIB</div>
                        </div>
                      </div>
                      <span className="unread-badge">Live</span>
                    </div>

                    <div className={`inbox-card ${activeStep >= 3 ? 'populated' : ''}`}>
                      <div className="inbox-card-left">
                        <div className="inbox-avatar orange">DK</div>
                        <div className="inbox-text">
                          <div className="inbox-name">Penjurian Desain Kemasan</div>
                          <div className="inbox-preview">Atrium Braga · 13:00 WIB</div>
                        </div>
                      </div>
                      <span className="unread-badge">50 IKM</span>
                    </div>

                    <div className={`inbox-card ${activeStep >= 3 ? 'populated' : ''}`}>
                      <div className="inbox-card-left">
                        <div className="inbox-avatar green">AW</div>
                        <div className="inbox-text">
                          <div className="inbox-name">Awarding &amp; Music Night</div>
                          <div className="inbox-preview">Ballroom Papandayan · 19:00</div>
                        </div>
                      </div>
                      <span className="unread-badge">Malam</span>
                    </div>
                  </div>
                </section>

                {/* Col 4: Live Interactive Helpdesk Stream */}
                <section className="chat-column">
                  <div className="chat-header">
                    <div className="chat-contact">
                      <div className="chat-contact-avatar">PR</div>
                      <div>
                        <div className="chat-contact-name">Helpdesk Resmi PRIDE 2026</div>
                        <div className="chat-contact-status">
                          <span className="status-dot online" /> Disdagin Kota Bandung
                        </div>
                      </div>
                    </div>
                    <div className="chat-actions">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-semibold">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        <span>Auto-Play</span>
                      </div>
                      <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="btn-chat-top cursor-pointer"
                        title={isPaused ? "Lanjutkan Simulasi" : "Jeda Simulasi"}
                      >
                        {isPaused ? (
                          <>
                            <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            <span>Lanjut</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" rx="1" />
                              <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                            <span>Jeda</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Animated Chat Messages */}
                  <div className="chat-messages" ref={chatMessagesRef}>
                    
                    {/* Msg 1: Bot Initial Prompt */}
                    <div className={`msg-item msg-right ${activeStep >= 4 ? 'shown' : ''}`}>
                      <div className="bubble-dark">
                        Sampurasun! Selamat datang di Portal PRIDE Industri 2026. Ada yang bisa kami bantu seputar pendaftaran lomba atau jadwal pameran?
                        <span className="bubble-time">10:00</span>
                      </div>
                      <div className="bot-badge">
                        <BotIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Msg 2: Customer Reply */}
                    <div className={`msg-item msg-left ${activeStep >= 5 ? 'shown' : ''}`}>
                      <div className="bubble-light">
                        <span className="font-semibold text-[10px] text-blue-600 mb-0.5">Peserta IKM Kota Bandung</span>
                        <span>Halo, saya ingin mendaftar Lomba Desain Kemasan IKM &amp; Video Braga.</span>
                        <span className="bubble-time-light">10:01</span>
                      </div>
                    </div>

                    {/* Msg 3: Bot Delay Notice */}
                    <div className={`msg-item msg-right ${activeStep >= 6 ? 'shown' : ''}`}>
                      <div className="bubble-dark">
                        Pendaftaran 100% GRATIS dengan total hadiah Rp 30.000.000. Silakan pilih opsi langkah selanjutnya:
                        <span className="bubble-time">10:01</span>
                      </div>
                      <div className="bot-badge">
                        <BotIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Msg 4: Bot Interactive Option Buttons */}
                    <div className={`msg-item bot-quick-actions ${activeStep >= 7 ? 'shown' : ''}`}>
                      <a href="/syarat-desain-kemasan.pdf" download className="btn-quick-action flex items-center gap-1.5" style={{ textDecoration: 'none' }}>
                        <FilePdfIcon className="w-3 h-3" />
                        <span>Unduh Panduan PDF</span>
                      </a>
                      <button className={`btn-quick-action flex items-center gap-1.5 ${cursorPressing ? 'clicked' : ''}`}>
                        <FormIcon className="w-3 h-3" />
                        <span>Buka Formulir Pendaftaran</span>
                      </button>
                      
                      {/* Simulated Cursor Hand */}
                      <svg
                        className={`simulated-cursor ${cursorActive ? 'active' : ''} ${cursorPressing ? 'pressing' : ''}`}
                        viewBox="0 0 24 24"
                        fill="#ffffff"
                        stroke="#111827"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 11V4a2 2 0 0 1 4 0v5h2a2 2 0 0 1 2 2v5a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4v-3a2 2 0 0 1 4 0z" />
                      </svg>
                    </div>

                    {/* Msg 5: Selected Option */}
                    <div className={`msg-item msg-left ${activeStep >= 8 ? 'shown' : ''}`}>
                      <div className="bubble-light">
                        <span className="font-semibold text-[10px] text-blue-600 mb-0.5">Sistem Pendaftaran</span>
                        <span>Membuka formulir pendaftaran Lomba Desain Kemasan IKM...</span>
                        <span className="bubble-time-light">10:02</span>
                      </div>
                    </div>

                    {/* Msg 6: System Handover Notice */}
                    <div className={`msg-item system-pill-wrap ${activeStep >= 8 ? 'shown' : ''}`}>
                      <span className="system-pill flex items-center gap-1">
                        <CheckCircleIcon className="w-3 h-3 text-blue-600" />
                        <span>Formulir registrasi online terverifikasi Disdagin</span>
                      </span>
                    </div>

                    {/* Msg 7: Panitia Response */}
                    <div className={`msg-item msg-right ${activeStep >= 10 ? 'shown' : ''}`}>
                      <div className="bubble-dark">
                        Halo! Tim Disdagin siap memverifikasi berkas Anda. Batas submit karya tanggal 20 November 2026. Sampai jumpa di Braga!
                        <span className="bubble-time">10:02</span>
                      </div>
                      <div className="agent-chat-avatar">DG</div>
                    </div>
                  </div>

                  {/* Bottom Input Composer */}
                  <div className={`chat-composer ${activeStep >= 11 ? 'shown' : ''}`}>
                    <div className="composer-placeholder">Tulis pertanyaan seputar festival PRIDE 2026...</div>
                    <div className="composer-toolbar">
                      <div className="composer-tools">
                        <span title="Lampiran Berkas" className="hover:text-slate-700 cursor-pointer">
                          <PaperclipIcon className="w-3.5 h-3.5" />
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                          <PinIcon className="w-3 h-3 text-rose-500" />
                          <span>Braga City Walk</span>
                        </span>
                      </div>
                      <div className="composer-right">
                        <Link href="/competition/desain-kemasan" className="btn-assign flex items-center gap-1" style={{ textDecoration: 'none' }}>
                          <span>Daftar</span>
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17l9.2-9.2M17 17V8H8"/></svg>
                        </Link>
                        <button className="btn-send flex items-center gap-1">
                          <span>Kirim</span>
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Col 5: Right Event Details Panel */}
                <aside className="details-column">
                  <div className="col-header">
                    <span>Informasi Festival</span>
                    <span style={{ color: '#2563eb', fontSize: '10px', fontWeight: 'bold' }}>Disdagin</span>
                  </div>

                  <div className={`details-body ${activeStep >= 9 ? 'populated' : ''}`} id="detailsBody">
                    <div className="attr-grid">
                      <div className="attr-row">
                        <span className="attr-label">
                          <CalendarIcon className="w-3 h-3 text-blue-500" />
                          <span>Tanggal</span>
                        </span>
                        <span className="attr-val">27–28 Nov 2026</span>
                      </div>
                      <div className="attr-row">
                        <span className="attr-label">
                          <PinIcon className="w-3 h-3 text-rose-500" />
                          <span>Lokasi</span>
                        </span>
                        <span className="attr-val">Braga &amp; Papandayan</span>
                      </div>
                      <div className="attr-row">
                        <span className="attr-label">
                          <BuildingIcon className="w-3 h-3 text-amber-500" />
                          <span>Lembaga</span>
                        </span>
                        <span className="attr-val">Disdagin Bandung</span>
                      </div>
                      <div className="attr-row">
                        <span className="attr-label">
                          <TrophyIcon className="w-3 h-3 text-emerald-500" />
                          <span>Hadiah</span>
                        </span>
                        <span className="attr-val text-rose-600 font-bold">Rp 30.000.000</span>
                      </div>
                      <Link href="#competitions" className="add-attr" style={{ textDecoration: 'none' }}>
                        + Lihat Syarat Kompetisi
                      </Link>
                    </div>

                    <div className="notes-heading">Catatan Penting</div>
                    <div className="note-card">
                      <div className="note-card-header">
                        <div className="note-author">
                          <div className="note-author-badge">TM</div>
                          <div>
                            <div className="note-author-name">Batas Submit</div>
                            <div className="note-date">20 Nov 2026</div>
                          </div>
                        </div>
                        <span style={{ color: '#9ca3af' }}>⋯</span>
                      </div>
                      <div className="note-text">
                        Karya desain kemasan &amp; video diunggah sebelum 20 November 2026 pukul 23:59 WIB.
                      </div>
                    </div>

                    <div className="note-card">
                      <div className="note-card-header">
                        <div className="note-author">
                          <div className="note-author-badge">HM</div>
                          <div>
                            <div className="note-author-name">Technical Meeting</div>
                            <div className="note-date">26 Nov 2026</div>
                          </div>
                        </div>
                        <span style={{ color: '#9ca3af' }}>⋯</span>
                      </div>
                      <div className="note-text">
                        Finalis akan diundang ke Ballroom Hotel The Papandayan untuk presentasi dan kurasi.
                      </div>
                    </div>
                  </div>
                </aside>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
