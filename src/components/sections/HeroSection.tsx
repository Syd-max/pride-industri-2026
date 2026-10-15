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

function SendIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" />
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

  // Automated Sequential Simulation State
  const [activeStep, setActiveStep] = useState(0);
  const [cursorActive, setCursorActive] = useState(false);
  const [cursorPressing, setCursorPressing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 1. Smooth entrance of hero elements on initial load
  useEffect(() => {
    const t0 = setTimeout(() => heroLogoRef.current?.classList.add('visible'), 250);
    const tBadge1 = setTimeout(() => badgeKulinerRef.current?.classList.add('visible'), 500);
    const tBadge2 = setTimeout(() => badgeFesyenRef.current?.classList.add('visible'), 650);
    const tBadge3 = setTimeout(() => badgeKemasanRef.current?.classList.add('visible'), 800);
    const tBadge4 = setTimeout(() => badgeVideoRef.current?.classList.add('visible'), 950);
    const tHeadline = setTimeout(() => headlineBlockRef.current?.classList.add('visible'), 1100);
    const tSub = setTimeout(() => heroSubtitleRef.current?.classList.add('visible'), 1250);
    const tLogos = setTimeout(() => heroLogosRef.current?.classList.add('visible'), 1400);
    const tBrowser = setTimeout(() => browserStageRef.current?.classList.add('intro-ready'), 1550);

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

  // 2. Continuous Automatic Chat Playback (No slider, no scrollbar scrubbing required)
  const restartSimulation = useCallback(() => {
    setActiveStep(0);
    setCursorActive(false);
    setCursorPressing(false);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timeoutIds: NodeJS.Timeout[] = [];

    const scheduleLoop = () => {
      // Step 1: Msg 1 appears
      timeoutIds.push(setTimeout(() => setActiveStep(1), 800));

      // Step 2: Msg 2 appears
      timeoutIds.push(setTimeout(() => setActiveStep(2), 2200));

      // Step 3: Msg 3 appears
      timeoutIds.push(setTimeout(() => setActiveStep(3), 3600));

      // Step 4: Quick Action buttons appear
      timeoutIds.push(setTimeout(() => setActiveStep(4), 5000));

      // Step 5: Apple hand cursor glides onto "Buka Formulir Pendaftaran"
      timeoutIds.push(setTimeout(() => setCursorActive(true), 6000));

      // Step 6: Cursor presses down & button clicks
      timeoutIds.push(setTimeout(() => setCursorPressing(true), 6900));

      // Step 7: Cursor releases and Msg 5 (opening form notice) appears
      timeoutIds.push(setTimeout(() => {
        setCursorPressing(false);
        setCursorActive(false);
        setActiveStep(5);
      }, 7500));

      // Step 8: Msg 6 (system verified pill) appears
      timeoutIds.push(setTimeout(() => setActiveStep(6), 8600));

      // Step 9: Msg 7 (Disdagin closing response) appears
      timeoutIds.push(setTimeout(() => setActiveStep(7), 9900));

      // Step 10: Chat Composer slides up
      timeoutIds.push(setTimeout(() => setActiveStep(8), 11200));

      // Loop restart after 6 seconds of comfortable readability
      timeoutIds.push(setTimeout(() => {
        restartSimulation();
        scheduleLoop();
      }, 17500));
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
    if (chatMessagesRef.current && activeStep > 0) {
      chatMessagesRef.current.scrollTo({
        top: chatMessagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [activeStep]);

  return (
    <div className="hero-flow-stage" id="heroStage">
      {/* Scenic Background (Fades smoothly to clean white at bottom) */}
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

        {/* macOS Browser Window Showcase: AUTOMATIC INTERACTIVE DEMO (NO SLIDER) */}
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
                    <span>prideindustri.bandung.go.id/helpdesk</span>
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
                      <div>
                        <div className="chat-contact-name">Helpdesk Resmi PRIDE 2026</div>
                        <div className="chat-contact-status">
                          <span className="status-dot online" /> Disdagin Kota Bandung
                        </div>
                      </div>
                    </div>
                    <div className="chat-actions">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[11px] font-semibold">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Simulasi Otomatis</span>
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
                    <div className={`msg-item msg-right ${activeStep >= 1 ? 'shown' : ''}`}>
                      <div className="bubble-dark">
                        Sampurasun! Selamat datang di Portal PRIDE Industri 2026. Ada yang bisa kami bantu seputar pendaftaran lomba atau jadwal pameran?
                        <span className="bubble-time">10:00</span>
                      </div>
                      <div className="bot-badge">
                        <BotIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Msg 2: Customer Reply */}
                    <div className={`msg-item msg-left ${activeStep >= 2 ? 'shown' : ''}`}>
                      <div className="bubble-light">
                        <span className="font-semibold text-[11px] text-blue-600 mb-0.5">Peserta IKM Kota Bandung</span>
                        <span>Halo, saya ingin mendaftar Lomba Desain Kemasan IKM &amp; Video Braga.</span>
                        <span className="bubble-time-light">10:01</span>
                      </div>
                    </div>

                    {/* Msg 3: Bot Delay Notice */}
                    <div className={`msg-item msg-right ${activeStep >= 3 ? 'shown' : ''}`}>
                      <div className="bubble-dark">
                        Pendaftaran 100% GRATIS dengan total hadiah Rp 30.000.000. Silakan pilih opsi langkah selanjutnya:
                        <span className="bubble-time">10:01</span>
                      </div>
                      <div className="bot-badge">
                        <BotIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Msg 4: Bot Interactive Option Buttons */}
                    <div className={`msg-item bot-quick-actions ${activeStep >= 4 ? 'shown' : ''}`}>
                      <a href="/syarat-desain-kemasan.pdf" download className="btn-quick-action flex items-center gap-1.5" style={{ textDecoration: 'none' }}>
                        <FilePdfIcon className="w-3.5 h-3.5" />
                        <span>Unduh Panduan PDF</span>
                      </a>
                      <button className={`btn-quick-action flex items-center gap-1.5 ${cursorPressing ? 'clicked' : ''}`}>
                        <FormIcon className="w-3.5 h-3.5" />
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
                    <div className={`msg-item msg-left ${activeStep >= 5 ? 'shown' : ''}`}>
                      <div className="bubble-light">
                        <span className="font-semibold text-[11px] text-blue-600 mb-0.5">Sistem Pendaftaran</span>
                        <span>Membuka formulir pendaftaran Lomba Desain Kemasan IKM...</span>
                        <span className="bubble-time-light">10:02</span>
                      </div>
                    </div>

                    {/* Msg 6: System Handover Notice */}
                    <div className={`msg-item system-pill-wrap ${activeStep >= 6 ? 'shown' : ''}`}>
                      <span className="system-pill flex items-center gap-1.5">
                        <CheckCircleIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Formulir registrasi online diverifikasi Disdagin · QR Check-in aktif</span>
                      </span>
                    </div>

                    {/* Msg 7: Panitia Response */}
                    <div className={`msg-item msg-right ${activeStep >= 7 ? 'shown' : ''}`}>
                      <div className="bubble-dark">
                        Halo! Tim Disdagin siap memverifikasi berkas Anda. Batas submit karya tanggal 20 November 2026. Sampai jumpa di Braga!
                        <span className="bubble-time">10:02</span>
                      </div>
                      <div className="agent-chat-avatar">DG</div>
                    </div>
                  </div>

                  {/* Bottom Input Composer */}
                  <div className={`chat-composer ${activeStep >= 8 ? 'shown' : ''}`}>
                    <div className="composer-placeholder">Tulis pertanyaan seputar festival PRIDE 2026...</div>
                    <div className="composer-toolbar">
                      <div className="composer-tools">
                        <span title="Lampiran Berkas" className="hover:text-slate-700 cursor-pointer">
                          <PaperclipIcon className="w-3.5 h-3.5" />
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <PinIcon className="w-3.5 h-3.5 text-rose-500" />
                          <span>Braga City Walk</span>
                        </span>
                      </div>
                      <div className="composer-right">
                        <Link href="/competition/desain-kemasan" className="btn-assign flex items-center gap-1" style={{ textDecoration: 'none' }}>
                          <span>Daftar Sekarang</span>
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17l9.2-9.2M17 17V8H8"/></svg>
                        </Link>
                        <button className="btn-send flex items-center gap-1.5">
                          <span>Kirim</span>
                          <SendIcon className="w-3 h-3" />
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
