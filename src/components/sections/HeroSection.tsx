'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './hero-flow.css';

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
  const heroCtasRef = useRef<HTMLDivElement>(null);

  // Chat message refs
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

  const [isPlaying, setIsPlaying] = useState(false);

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

    // 1. INTRO ENTRANCE SEQUENCE (00:00 -> 00:05)
    const t0 = setTimeout(() => {
      heroLogoRef.current?.classList.add('visible');
    }, 280);

    // Floating cursor badges
    const tBadge1 = setTimeout(() => badgeKulinerRef.current?.classList.add('visible'), 1200);
    const tBadge2 = setTimeout(() => badgeFesyenRef.current?.classList.add('visible'), 1350);
    const tBadge3 = setTimeout(() => badgeKemasanRef.current?.classList.add('visible'), 1500);
    const tBadge4 = setTimeout(() => badgeVideoRef.current?.classList.add('visible'), 1650);

    // Subtitle & CTAs
    const tSub = setTimeout(() => heroSubtitleRef.current?.classList.add('visible'), 1800);
    const tCtas = setTimeout(() => heroCtasRef.current?.classList.add('visible'), 2000);

    // Browser Mockup rises into bottom of viewport (peeking bar)
    const tBrowser = setTimeout(() => {
      browserStageRef.current?.classList.add('intro-ready');
      updateTimeline(getScrollProgress());
    }, 2400);

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
    function updateTimeline(p: number) {
      let heroY = 0;
      let heroOpacity = 1;
      let browserY = 0;
      let browserX = 0;
      let browserScale = 1;

      if (p <= 0.18) {
        // Rising from bottom peek to center stage
        const t = easeInOutCubic(mapRange(p, 0, 0.18, 0, 1));
        heroY = -340 * t;
        heroOpacity = 1 - 0.95 * t;
        browserY = -580 * t;
        browserScale = 1;
      } else if (p <= 0.30) {
        // Zooming into active helpdesk & details
        const t = easeInOutCubic(mapRange(p, 0.18, 0.30, 0, 1));
        heroY = -340 - 80 * t;
        heroOpacity = 0;
        browserY = -580 + 28 * t;
        browserX = -65 * t;
        browserScale = 1 + 0.24 * t;
      } else if (p <= 0.76) {
        // Holding zoomed-in focus while interaction sequence plays
        const drift = mapRange(p, 0.30, 0.76, 0, 1);
        heroY = -420;
        heroOpacity = 0;
        browserY = -552 - 18 * drift;
        browserX = -65;
        browserScale = 1.24;
      } else if (p <= 0.88) {
        // Zooming out to full dashboard overview
        const t = easeInOutCubic(mapRange(p, 0.76, 0.88, 0, 1));
        heroY = -420 + 80 * t;
        heroOpacity = 0.05 * t;
        browserY = -570 - 10 * t;
        browserX = -65 * (1 - t);
        browserScale = 1.24 - 0.24 * t;
      } else {
        // Settling gracefully
        const t = easeInOutCubic(mapRange(p, 0.88, 1.0, 0, 1));
        heroY = -340 * (1 - t);
        heroOpacity = 0.05 + 0.95 * t;
        browserY = -580 * (1 - t);
        browserX = 0;
        browserScale = 1;
      }

      if (heroSectionRef.current) {
        heroSectionRef.current.style.transform = `translate3d(0, ${heroY}px, 0)`;
        heroSectionRef.current.style.opacity = String(heroOpacity);
      }

      if (browserStageRef.current) {
        browserStageRef.current.style.transform = `translate3d(${browserX}px, ${browserY}px, 0) scale(${browserScale})`;
      }

      // Populate Sidebar & Cards
      const sidebarSections = document.querySelectorAll('.sidebar-section');
      sidebarSections.forEach((sec, idx) => {
        sec.classList.toggle('populated', p >= 0.07 + idx * 0.02);
      });

      const inboxCards = document.querySelectorAll('.inbox-card');
      inboxCards.forEach((card, idx) => {
        card.classList.toggle('populated', p >= 0.08 + idx * 0.02);
      });

      const detailsBody = document.getElementById('detailsBody');
      if (detailsBody) {
        detailsBody.classList.toggle('populated', p >= 0.08);
      }

      // Chat Sequence Thresholds
      msg1Ref.current?.classList.toggle('shown', p >= 0.24);
      msg2Ref.current?.classList.toggle('shown', p >= 0.33);
      msg3Ref.current?.classList.toggle('shown', p >= 0.41);
      msg4Ref.current?.classList.toggle('shown', p >= 0.47);

      // Simulated cursor hover & click on "Buka Formulir Pendaftaran"
      const showCursor = p >= 0.51 && p <= 0.58;
      const isPressing = p >= 0.54 && p <= 0.57;
      simCursorRef.current?.classList.toggle('active', showCursor);
      simCursorRef.current?.classList.toggle('pressing', isPressing);
      btnRepRef.current?.classList.toggle('clicked', isPressing);

      // Handover & Panitia Message
      msg5Ref.current?.classList.toggle('shown', p >= 0.57);
      msg6Ref.current?.classList.toggle('shown', p >= 0.63);
      msg7Ref.current?.classList.toggle('shown', p >= 0.69);
      chatComposerRef.current?.classList.toggle('shown', p >= 0.74);
    }

    // Scroll listener
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateTimeline(getScrollProgress());
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(t0);
      clearTimeout(tBadge1);
      clearTimeout(tBadge2);
      clearTimeout(tBadge3);
      clearTimeout(tBadge4);
      clearTimeout(tSub);
      clearTimeout(tCtas);
      clearTimeout(tBrowser);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 3. AUTO-PLAY SEQUENCE HANDLER
  const toggleAutoPlay = () => {
    const stage = scrollStageRef.current;
    if (!stage) return;

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const rect = stage.getBoundingClientRect();
    const stageTop = window.scrollY + rect.top;
    const scrollDistance = stage.offsetHeight - window.innerHeight;
    const duration = 19500; // 19.5s sequence
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, stageTop + progress * scrollDistance);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    }

    requestAnimationFrame(step);
  };

  const handleSeeHow = () => {
    const stage = scrollStageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const stageTop = window.scrollY + rect.top;
    const scrollDistance = stage.offsetHeight - window.innerHeight;
    window.scrollTo({ top: stageTop + scrollDistance * 0.25, behavior: 'smooth' });
  };

  return (
    <div className="scroll-stage" id="scrollStage" ref={scrollStageRef}>
      <div className="flow-viewport">
        {/* Full Braga Scenic Background (Unzoomed & Crisp) */}
        <div className="scenic-bg" />
        <div className="scenic-foreground" />

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

            {/* Floating Cursor Tag: Fesyen Binaan (Top-Left) */}
            <div className="cursor-badge badge-fesyen" ref={badgeFesyenRef}>
              <span>👔</span> Fesyen Binaan
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Kuliner Lokal (Top-Right) */}
            <div className="cursor-badge badge-kuliner" ref={badgeKulinerRef}>
              <span>🍲</span> Kuliner Lokal
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Video 1 Menit (Bottom-Left) */}
            <div className="cursor-badge badge-video" ref={badgeVideoRef}>
              <span>🎬</span> Lomba Video 1 Menit
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>

            {/* Floating Cursor Tag: Desain Kemasan (Bottom-Right) */}
            <div className="cursor-badge badge-kemasan" ref={badgeKemasanRef}>
              <span>📦</span> Lomba Desain Kemasan
              <svg viewBox="0 0 24 24"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
            </div>
          </div>

          {/* Clean, Elegant Headline Title with Proper Spaces */}
          <div className="headline-block">
            <h1 className="hero-title-clean">
              Pagelaran Ragam Inovasi <span className="text-amber-300">&amp;</span> Eksistensi
            </h1>
            <p className="hero-subtitle-clean" ref={heroSubtitleRef}>
              Merayakan kebangkitan industri kreatif Kota Bandung: pameran produk fesyen &amp; kuliner binaan, panggung apresiasi seni, dan kompetisi bergengsi di Jalan Braga &amp; Hotel Papandayan.
            </p>
          </div>

          {/* Hero Action Buttons */}
          <div className="hero-ctas-clean" ref={heroCtasRef}>
            <Link href="#competitions" className="btn-hero-primary">
              <span>Daftar Kompetisi</span>
              <span>🚀</span>
            </Link>

            <button onClick={handleSeeHow} className="btn-hero-secondary">
              <span>Simulasi Interaktif Acara</span>
              <span>↓</span>
            </button>

            <Link href="/check-in" className="btn-hero-secondary" style={{ background: 'rgba(15, 23, 42, 0.7)' }}>
              <span className="text-emerald-400">📷</span>
              <span>Check-In QR</span>
            </Link>
          </div>

          {/* Subtle Peek Cue above bottom browser */}
          <div className="peek-cue animate-bounce">
            <span>↓ Gulir ke bawah untuk simulasi interaktif</span>
          </div>
        </section>

        {/* macOS Browser Window Showcase: PEEKS AT BOTTOM, NEVER COVERS PAGE AWAL */}
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </div>

                <div className="safari-address">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <div className="safari-address-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span>prideindustri.bandung.go.id/agenda</span>
                  </div>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </div>

                <div className="safari-icons">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </div>
              </div>

              {/* 5-Column Festival Application Interface */}
              <div className="app-workspace">
                
                {/* Col 1: Narrow Icon Rail */}
                <aside className="icon-rail">
                  <div className="rail-group">
                    <div className="rail-logo">✨</div>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
                    <svg className="rail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </div>
                  <div className="rail-group">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                      BDG
                    </div>
                  </div>
                </aside>

                {/* Col 2: Navigation Filters */}
                <aside className="nav-sidebar">
                  <div className="search-box">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <span>Cari agenda festival...</span>
                  </div>

                  <div className="sidebar-section" data-pop="1">
                    <div className="section-label">Panggung &amp; Jalur</div>
                    <div className="nav-row active">
                      <span className="nav-row-left">Semua Agenda</span>
                      <span className="nav-count">18</span>
                    </div>
                    <div className="nav-row">
                      <span className="nav-row-left">👔 Fesyen Binaan</span>
                      <span className="nav-count">6</span>
                    </div>
                    <div className="nav-row">
                      <span className="nav-row-left">🍲 Kuliner Lokal</span>
                      <span className="nav-count">8</span>
                    </div>
                    <div className="nav-row">
                      <span className="nav-row-left">🎨 Pameran Kriya</span>
                      <span className="nav-count">4</span>
                    </div>
                  </div>

                  <div className="sidebar-section" data-pop="2">
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

                  <div className="sidebar-section" data-pop="3">
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

                  <div className="sidebar-section" data-pop="4">
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
                    <span>← &nbsp;Agenda 27–28 Nov</span>
                    <span style={{ color: '#9ca3af' }}>+</span>
                  </div>
                  <div className="inbox-filters">
                    <span className="filter-pill">▽</span>
                    <span className="filter-pill">Semua ▾</span>
                    <span className="filter-pill">Terbaru ▾</span>
                  </div>
                  <div className="inbox-list">
                    <div className="inbox-card" data-pop="1">
                      <div className="inbox-card-left">
                        <div className="inbox-avatar blue">FS</div>
                        <div className="inbox-text">
                          <div className="inbox-name">Opening &amp; Runway Show</div>
                          <div className="inbox-preview">Jalan Braga · 09:00 WIB</div>
                        </div>
                      </div>
                      <span className="unread-badge">Live</span>
                    </div>

                    <div className="inbox-card" data-pop="2">
                      <div className="inbox-card-left">
                        <div className="inbox-avatar orange">DK</div>
                        <div className="inbox-text">
                          <div className="inbox-name">Penjurian Desain Kemasan</div>
                          <div className="inbox-preview">Atrium Braga · 13:00 WIB</div>
                        </div>
                      </div>
                      <span className="unread-badge">50 IKM</span>
                    </div>

                    <div className="inbox-card" data-pop="3">
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
                      <button className="btn-chat-top">⏸ Info</button>
                      <button className="btn-chat-top dark">✓ Buka</button>
                    </div>
                  </div>

                  {/* Animated Chat Messages */}
                  <div className="chat-messages">
                    
                    {/* Msg 1: Bot Initial Prompt */}
                    <div className="msg-item msg-right" ref={msg1Ref}>
                      <div className="bubble-dark">
                        Sampurasun! Selamat datang di Portal PRIDE Industri 2026. Ada yang bisa kami bantu seputar pendaftaran lomba atau jadwal pameran?
                        <span className="bubble-time">10:00</span>
                      </div>
                      <div className="bot-badge">✨</div>
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
                        Pendaftaran 100% GRATIS dengan total hadiah Rp 30.000.000. Silakan pilih opsi langkah selanjutnya:
                        <span className="bubble-time">10:01</span>
                      </div>
                      <div className="bot-badge">✨</div>
                    </div>

                    {/* Msg 4: Bot Interactive Option Buttons */}
                    <div className="msg-item bot-quick-actions" ref={msg4Ref}>
                      <a href="/syarat-desain-kemasan.pdf" download className="btn-quick-action" style={{ textDecoration: 'none' }}>
                        Unduh Panduan PDF
                      </a>
                      <button className="btn-quick-action" ref={btnRepRef}>
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
                      <span className="system-pill">Formulir registrasi online siap diisi · Tersedia QR Check-in</span>
                    </div>

                    {/* Msg 7: Panitia Response */}
                    <div className="msg-item msg-right" ref={msg7Ref}>
                      <div className="bubble-dark">
                        Halo! Tim Disdagin siap memverifikasi berkas Anda. Batas submit karya tanggal 20 November 2026. Sampai jumpa di Braga!
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
                        <span>📎</span>
                        <span>😊</span>
                        <span>📍 Braga</span>
                      </div>
                      <div className="composer-right">
                        <Link href="/competition/desain-kemasan" className="btn-assign" style={{ textDecoration: 'none' }}>
                          Daftar Sekarang
                        </Link>
                        <button className="btn-send">Kirim ➤</button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Col 5: Right Event Details Panel */}
                <aside className="details-column">
                  <div className="col-header">
                    <span>Informasi Festival</span>
                    <span style={{ color: '#2563eb', fontSize: '10.5px' }}>Disdagin</span>
                  </div>

                  <div className="details-body" id="detailsBody">
                    <div className="attr-grid">
                      <div className="attr-row">
                        <span className="attr-label">📅 Tanggal</span>
                        <span className="attr-val">27–28 Nov 2026</span>
                      </div>
                      <div className="attr-row">
                        <span className="attr-label">📍 Lokasi</span>
                        <span className="attr-val">Braga &amp; Papandayan</span>
                      </div>
                      <div className="attr-row">
                        <span className="attr-label">🏛 Lembaga</span>
                        <span className="attr-val">Disdagin Bandung</span>
                      </div>
                      <div className="attr-row">
                        <span className="attr-label">🏆 Total Hadiah</span>
                        <span className="attr-val">Rp 30.000.000</span>
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

        {/* Floating Controls HUD (Auto-play sequence pill) */}
        <div className="timeline-hud">
          <button className="hud-btn" onClick={toggleAutoPlay}>
            {isPlaying ? '⏸ Jeda Simulasi' : '▶ Auto-Play Simulasi'}
          </button>
          <span className="hud-hint">atau gulir untuk scrub timeline</span>
        </div>
      </div>
    </div>
  );
}
