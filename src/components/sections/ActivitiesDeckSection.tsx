'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './activities-deck.css';

export default function ActivitiesDeckSection() {
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const deckContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const stepperTextRef = useRef<HTMLSpanElement>(null);
  const activeCardIndexRef = useRef(0);
  const lastActiveIndexRef = useRef(-1);
  const scrollProgressRef = useRef(0);
  const isPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const autoPlayFrameRef = useRef<number | null>(null);
  const updateFrameRef = useRef<number | null>(null);
  const navigationIdleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigationTargetRef = useRef<number | null>(null);
  const driverTopRef = useRef(0);
  const driverScrollRangeRef = useRef(0);
  const totalCardsRef = useRef(0);

  const clamp = useCallback((val: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, val));
  }, []);

  const renderDeck = useCallback((progress: number) => {
    const cards = cardsRef.current;
    if (cards.length === 0) return;

    const stageProgress = clamp(progress, 0, cards.length - 1);
    const activeIndex = Math.min(cards.length - 1, Math.floor(stageProgress + 0.01));
    const isMobile = window.innerWidth <= 768;
    const peekStep = isMobile ? 14 : 20;
    const scaleStep = isMobile ? 0.022 : 0.026;

    scrollProgressRef.current = stageProgress;
    activeCardIndexRef.current = activeIndex;

    if (lastActiveIndexRef.current !== activeIndex) {
      lastActiveIndexRef.current = activeIndex;
      if (stepperTextRef.current) {
        stepperTextRef.current.textContent = activeIndex === 0 ? 'Cover' : `0${activeIndex} / 06`;
      }
      cards.forEach((card, index) => {
        const isActive = index === activeIndex;
        card.classList.toggle('is-active', isActive);
        card.classList.toggle('is-peeled', index < activeIndex);
        card.classList.toggle('is-stacked', index > activeIndex);
        card.setAttribute('aria-hidden', String(index < activeIndex));
      });
    }
    const isHudVisible = stageProgress > 0.015;
    if (hudRef.current?.classList.contains('is-visible') !== isHudVisible) {
      hudRef.current?.classList.toggle('is-visible', isHudVisible);
    }

    cards.forEach((card, index) => {
      const phase = stageProgress - index;
      let transform: string;

      if (index < stageProgress) {
        const peel = clamp(phase, 0, 1);
        const easedPeel = peel * peel * (3 - 2 * peel);
        transform = `translate3d(0, ${(easedPeel * -115).toFixed(2)}%, 0) scale(1)`;
      } else {
        const depth = Math.max(0, index - stageProgress);
        const visibleDepth = Math.min(depth, 6);
        const yOffset = -visibleDepth * peekStep;
        const scale = 1 - visibleDepth * scaleStep;
        transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      }

      card.style.transform = transform;

    });
  }, [clamp]);

  const stopAutoPlay = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (autoPlayFrameRef.current !== null) {
      cancelAnimationFrame(autoPlayFrameRef.current);
      autoPlayFrameRef.current = null;
    }
  }, []);

  const goToCard = useCallback((targetIndex: number) => {
    if (isPlayingRef.current) stopAutoPlay();

    const driver = scrollDriverRef.current;
    const totalScroll = driverScrollRangeRef.current;
    if (!driver || totalScroll <= 0) return;

    const lastIndex = Math.max(0, totalCardsRef.current - 1);
    const target = clamp(targetIndex, 0, lastIndex);
    navigationTargetRef.current = target;
    if (navigationIdleTimerRef.current) clearTimeout(navigationIdleTimerRef.current);
    window.scrollTo({
      top: driverTopRef.current + (target / lastIndex) * totalScroll,
      behavior: 'smooth',
    });
    navigationIdleTimerRef.current = setTimeout(() => {
      navigationTargetRef.current = null;
      navigationIdleTimerRef.current = null;
    }, 1800);
  }, [clamp, stopAutoPlay]);

  const toggleAutoPlay = useCallback(() => {
    if (isPlayingRef.current) {
      stopAutoPlay();
      return;
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    const startedAt = performance.now();
    const totalDuration = 18000;
    const lastIndex = Math.max(0, totalCardsRef.current - 1);
    const initialProgress = scrollProgressRef.current;
    if (updateFrameRef.current !== null) {
      cancelAnimationFrame(updateFrameRef.current);
      updateFrameRef.current = null;
    }

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const t = clamp(elapsed / totalDuration, 0, 1);
      let progress: number;
      if (t < 0.42) {
        const forward = t / 0.42;
        const eased = forward < 0.5
          ? 4 * forward * forward * forward
          : 1 - Math.pow(-2 * forward + 2, 3) / 2;
        progress = initialProgress + (lastIndex - initialProgress) * eased;
      } else if (t < 0.52) {
        progress = 6;
      } else if (t < 0.94) {
        const reverse = (t - 0.52) / 0.42;
        const eased = reverse < 0.5
          ? 4 * reverse * reverse * reverse
          : 1 - Math.pow(-2 * reverse + 2, 3) / 2;
        progress = lastIndex * (1 - eased);
      } else {
        progress = 0;
      }

      const totalScroll = driverScrollRangeRef.current;
      if (totalScroll > 0) {
        window.scrollTo(0, driverTopRef.current + (progress / lastIndex) * totalScroll);
      }
      renderDeck(progress);

      if (t < 1) {
        autoPlayFrameRef.current = requestAnimationFrame(tick);
      } else {
        autoPlayFrameRef.current = null;
        isPlayingRef.current = false;
        setIsPlaying(false);
      }
    };

    autoPlayFrameRef.current = requestAnimationFrame(tick);
  }, [clamp, renderDeck, stopAutoPlay]);

  useEffect(() => {
    const driver = scrollDriverRef.current;
    const deck = deckContainerRef.current;
    const stage = stageRef.current;
    if (!driver || !deck || !stage) return;

    cardsRef.current = Array.from(deck.querySelectorAll<HTMLElement>('.activities-card'))
      .sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
    totalCardsRef.current = cardsRef.current.length;

    const measureScrollRange = () => {
      driverTopRef.current = driver.getBoundingClientRect().top + window.scrollY;
      driverScrollRangeRef.current = Math.max(0, driver.offsetHeight - stage.getBoundingClientRect().height);
    };
    measureScrollRange();
    const resizeObserver = new ResizeObserver(measureScrollRange);
    resizeObserver.observe(driver);
    resizeObserver.observe(stage);
    if (driver.parentElement) resizeObserver.observe(driver.parentElement);

    const updateFromScroll = () => {
      updateFrameRef.current = null;
      if (isPlayingRef.current) return;
      const range = driverScrollRangeRef.current;
      if (range <= 0) return;
      const rawProgress = (window.scrollY - driverTopRef.current) / range;
      renderDeck(clamp(rawProgress, 0, 1) * (totalCardsRef.current - 1));

      if (navigationTargetRef.current !== null && Math.abs(scrollProgressRef.current - navigationTargetRef.current) < 0.025) {
        navigationTargetRef.current = null;
        if (navigationIdleTimerRef.current) {
          clearTimeout(navigationIdleTimerRef.current);
          navigationIdleTimerRef.current = null;
        }
      }
    };

    function scheduleUpdate() {
      if (updateFrameRef.current === null && !isPlayingRef.current) {
        updateFrameRef.current = requestAnimationFrame(updateFromScroll);
      }
    }

    const stopAutoPlayOnUserInput = () => {
      if (!isPlayingRef.current) return;
      stopAutoPlay();
    };
    const onResize = () => {
      measureScrollRange();
      scheduleUpdate();
    };
    const onScrollEnd = () => {
      navigationTargetRef.current = null;
      if (navigationIdleTimerRef.current) {
        clearTimeout(navigationIdleTimerRef.current);
        navigationIdleTimerRef.current = null;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowDown' && event.key !== 'ArrowLeft' && event.key !== 'ArrowUp') return;
      const rect = driver.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      event.preventDefault();
      stopAutoPlayOnUserInput();
      const base = navigationTargetRef.current ?? (event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? Math.floor(scrollProgressRef.current)
        : Math.ceil(scrollProgressRef.current));
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
      goToCard(base + direction);
    };
    const onWheel = () => {
      stopAutoPlayOnUserInput();
      navigationTargetRef.current = null;
    };
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      stopAutoPlayOnUserInput();
      navigationTargetRef.current = null;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const dx = event.changedTouches[0].clientX - touchStartX;
      const dy = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) <= 40 || Math.abs(dx) <= Math.abs(dy)) return;

      const base = navigationTargetRef.current ?? (dx < 0
        ? Math.floor(scrollProgressRef.current)
        : Math.ceil(scrollProgressRef.current));
      goToCard(base + (dx < 0 ? 1 : -1));
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    driver.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scrollend', onScrollEnd);
    const initialProgress = driverScrollRangeRef.current > 0
      ? ((window.scrollY - driverTopRef.current) / driverScrollRangeRef.current) * (totalCardsRef.current - 1)
      : 0;
    renderDeck(clamp(initialProgress, 0, 1) * 6);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      driver.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scrollend', onScrollEnd);
      if (updateFrameRef.current !== null) cancelAnimationFrame(updateFrameRef.current);
      if (autoPlayFrameRef.current !== null) cancelAnimationFrame(autoPlayFrameRef.current);
      if (navigationIdleTimerRef.current) clearTimeout(navigationIdleTimerRef.current);
    };
  }, [clamp, goToCard, renderDeck, stopAutoPlay]);

  return (
    <div className="activities-scroll-driver" id="programUnggulan" ref={scrollDriverRef}>
      <section className="activities-stage" ref={stageRef} aria-label="6 Program Unggulan PRIDE 2026">

        {/* 7-Card Stack Deck Container: Cover (0) + 6 Programs (1..6) */}
        <div className="activities-deck-container" ref={deckContainerRef}>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 0 (Frontmost): ELEGANT & AESTHETIC COVER CARD
              Simple, clean centerpiece: "6 PROGRAM UNGGULAN"
              ════════════════════════════════════════════════════════════════ */}
          <section className="activities-card deck-cover-card" data-index="0">
            <h2 className="deck-cover-title">
              <span>6</span> Program <strong>Unggulan</strong>
            </h2>
          </section>
          <article className="activities-card deck-festival-card theme-red" data-index="1">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">01 / 06</span>
                  <span className="deck-header-pill">FESYEN &amp; WASTRA NUSANTARA</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>27 Nov · Main Runway Braga</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Panggung 20+ Desainer Binaan</span>
                    <h3 className="deck-card-title">Peragaan Busana Wastra Kontemporer</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ Ready-to-Wear Wastra</span>
                  <span className="deck-tag-chip">✦ Motif Kain Khas Bandung</span>
                  <span className="deck-tag-chip">✦ 20+ Desainer Muda</span>
                  <span className="deck-tag-chip">✦ Business Matching Kurator</span>
                </div>

                <p className="deck-card-desc">
                  Peragaan busana siap pakai (ready-to-wear) karya 20+ desainer fesyen binaan Disdagin Kota Bandung. Menampilkan eksplorasi motif khas dan kain nusantara berstandar internasional, dilengkapi sesi temu bisnis langsung bersama kurator dan pembeli potensial.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>15:30 — 17:30 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Main Runway Stage Braga</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToCard(0)}
                    className="deck-nav-btn"
                    title="Kembali ke Cover"
                  >
                    ← Cover
                  </button>
                  <button
                    type="button"
                    onClick={() => goToCard(2)}
                    className="deck-nav-btn deck-nav-primary"
                    title="Lanjut ke Program 02"
                  >
                    02 Kemasan →
                  </button>
                </div>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 2 (Card 2): LOMBA DESAIN KEMASAN IKM
              Theme: Emerald Green (#009E49)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-green" data-index="2">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">02 / 06</span>
                  <span className="deck-header-pill">INOVASI ECO-PACKAGING IKM</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>28 Nov · Expo Braga</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m7.5 4.27 9 5.15"/>
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                      <path d="m3.3 7 8.7 5 8.7-5"/>
                      <path d="M12 22V12"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Standarisasi Kemasan Siap Ritel</span>
                    <h3 className="deck-card-title">Showcase &amp; Penjurian Terbuka Desain Kemasan</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ Kemasan Ramah Lingkungan</span>
                  <span className="deck-tag-chip">✦ Olahan Pangan Lokal Bandung</span>
                  <span className="deck-tag-chip">✦ Kurasi Rumah Kemasan</span>
                  <span className="deck-tag-chip">✦ Standar Ritel &amp; Ekspor</span>
                </div>

                <p className="deck-card-desc">
                  Pameran fisik dan presentasi langsung karya mockup 3D kemasan ramah lingkungan produk kuliner olahan pangan lokal binaan Bandung. Finalis memaparkan konsep di hadapan dewan juri ahli serta kurator Rumah Kemasan untuk kesiapan pasar ritel modern dan ekspor.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>10:00 — 16:30 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Area Pameran Braga City Walk</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToCard(1)}
                    className="deck-nav-btn"
                    title="Kembali ke 01 Fesyen"
                  >
                    ← 01 Fesyen
                  </button>
                  <button
                    type="button"
                    onClick={() => goToCard(3)}
                    className="deck-nav-btn deck-nav-primary"
                    title="Lanjut ke Program 03"
                  >
                    03 Video →
                  </button>
                </div>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 3 (Card 3): LOMBA VIDEO 1 MENIT BRAGA
              Theme: Warm Orange (#F69321)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-orange" data-index="3">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">03 / 06</span>
                  <span className="deck-header-pill">KREATIVITAS VISUAL VERTIKAL</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>27–28 Nov · Braga City Walk</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                      <rect x="2" y="6" width="14" height="12" rx="2"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Kompetisi Kreator Reels &amp; TikTok</span>
                    <h3 className="deck-card-title">Hunting Konten &amp; Screening Video 1 Menit</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ Video Vertikal 60 Detik</span>
                  <span className="deck-tag-chip">✦ Eksplorasi Koridor Braga</span>
                  <span className="deck-tag-chip">✦ Angkat Produk IKM Lokal</span>
                  <span className="deck-tag-chip">✦ Tayang di Videotron Utama</span>
                </div>

                <p className="deck-card-desc">
                  Ratusan kreator visual mengabadikan dinamika produk IKM, kearifan lokal, dan atmosfer festival di koridor bersejarah Jalan Braga dalam format video vertikal 60 detik. Karya-karya kurasi terbaik ditayangkan langsung di videotron panggung utama festival.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>Screening 28 Nov · 16:00 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Videotron Braga City Walk</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToCard(2)}
                    className="deck-nav-btn"
                    title="Kembali ke 02 Kemasan"
                  >
                    ← 02 Kemasan
                  </button>
                  <button
                    type="button"
                    onClick={() => goToCard(4)}
                    className="deck-nav-btn deck-nav-primary"
                    title="Lanjut ke Program 04"
                  >
                    04 SIINAS →
                  </button>
                </div>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 4 (Card 4): MALAM GALA APRESIASI INDUSTRI SIINAS
              Theme: Golden Yellow (#FFB800)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-yellow" data-index="4">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">04 / 06</span>
                  <span className="deck-header-pill">MALAM PENGANUGERAHAN</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>28 Nov · The Papandayan</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                      <path d="M4 22h16"/>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Apresiasi Kepatuhan Industri Nasional</span>
                    <h3 className="deck-card-title">Malam Anugerah &amp; Temu Kemitraan SIINAS</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ 200 IKM Tertib SIINAS</span>
                  <span className="deck-tag-chip">✦ Dihadiri Walikota Bandung</span>
                  <span className="deck-tag-chip">✦ Gala Dinner Formal</span>
                  <span className="deck-tag-chip">✦ Temu Kemitraan Usaha</span>
                </div>

                <p className="deck-card-desc">
                  Malam gala kehormatan penganugerahan penghargaan bagi 200 pelaku industri dan IKM binaan Kota Bandung yang tertib dan berdedikasi dalam pelaporan Sistem Informasi Industri Nasional (SIINAS), dirangkai makan malam formal bersama jajaran pimpinan daerah dan asosiasi usaha.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>19:00 — 21:00 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Grand Ballroom Hotel Papandayan</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToCard(3)}
                    className="deck-nav-btn"
                    title="Kembali ke 03 Video"
                  >
                    ← 03 Video
                  </button>
                  <button
                    type="button"
                    onClick={() => goToCard(5)}
                    className="deck-nav-btn deck-nav-primary"
                    title="Lanjut ke Program 05"
                  >
                    05 Halal →
                  </button>
                </div>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 5 (Card 5): PENYERAHAN 100 SERTIFIKAT HALAL & SNI
              Theme: Royal Bandung Blue (#1652F0)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-blue" data-index="5">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">05 / 06</span>
                  <span className="deck-header-pill">STANDARISASI &amp; LEGALITAS</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>28 Nov · Main Stage Braga</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                      <path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Fasilitasi Legalitas &amp; Jaminan Mutu Usaha</span>
                    <h3 className="deck-card-title">Penyerahan 100 Sertifikat Halal &amp; 3 Standar Mutu SNI</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ 100 Sertifikat Halal Gratis</span>
                  <span className="deck-tag-chip">✦ 3 Standar SNI IKM</span>
                  <span className="deck-tag-chip">✦ 100 Uji Laboratorium Mutu</span>
                  <span className="deck-tag-chip">✦ Konsultasi Legalitas Usaha</span>
                </div>

                <p className="deck-card-desc">
                  Seremonial penyerahan simbolis 100 Sertifikat Halal gratis, 3 SNI, dan fasilitasi uji laboratorium mutu IKM dari Disdagin Kota Bandung. Peserta dan pengunjung juga dapat berkonsultasi langsung mengenai pengurusan NIB, izin edar BPOM, dan legalitas industri di booth pelayanan terpadu.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>14:00 — 17:30 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Main Stage Braga City Walk</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToCard(4)}
                    className="deck-nav-btn"
                    title="Kembali ke 04 SIINAS"
                  >
                    ← 04 SIINAS
                  </button>
                  <button
                    type="button"
                    onClick={() => goToCard(6)}
                    className="deck-nav-btn deck-nav-primary"
                    title="Lanjut ke Program 06"
                  >
                    06 Seni →
                  </button>
                </div>
              </footer>
            </div>
          </article>

          {/* ════════════════════════════════════════════════════════════════
              LAYER 6 (Card 6): PANGGUNG SENI BUDAYA & MUSIK ETNIK
              Theme: Creative Purple (#8B5CF6)
              ════════════════════════════════════════════════════════════════ */}
          <article className="activities-card deck-festival-card theme-purple" data-index="6">
            <div className="deck-card-decorations" aria-hidden="true">
              <div className="decor-blob decor-blob-1" />
              <div className="decor-blob decor-blob-2" />
              <div className="decor-ring" />
            </div>

            <div className="deck-card-inner">
              <header className="deck-card-header">
                <div className="deck-header-left">
                  <span className="deck-card-number">06 / 06</span>
                  <span className="deck-header-pill">SENI BUDAYA &amp; MUSIK ETNIK</span>
                </div>
                <div className="deck-header-venue">
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>27–28 Nov · Main Stage Braga</span>
                </div>
              </header>

              <div className="deck-card-body">
                <div className="deck-hero-content">
                  <div className="deck-icon-badge">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13"/>
                      <circle cx="6" cy="18" r="3"/>
                      <circle cx="18" cy="16" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <span className="deck-kicker-tag">Pesta Seni Budaya &amp; Harmoni Tradisi</span>
                    <h3 className="deck-card-title">Panggung Seni Budaya &amp; Pertunjukan Musik Etnik</h3>
                  </div>
                </div>

                <div className="deck-feature-tags">
                  <span className="deck-tag-chip">✦ Rampak Kendang Sunda</span>
                  <span className="deck-tag-chip">✦ Perkusi Etnik Interaktif</span>
                  <span className="deck-tag-chip">✦ Musik Tradisi Kontemporer</span>
                  <span className="deck-tag-chip">✦ Apresiasi Talenta Bandung</span>
                </div>

                <p className="deck-card-desc">
                  Perayaan puncak kebudayaan khas Sunda yang menyatukan harmoni musik tradisi perkusi etnik Jawa Barat, atraksi rampak kendang, serta kolaborasi talenta seni muda Kota Bandung. Mengiringi kemeriahan eksibisi industri kreatif dan belanja sepanjang koridor heritage Jalan Braga.
                </p>
              </div>

              <footer className="deck-card-footer">
                <div className="deck-footer-meta">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>18:30 — 21:00 WIB</span>
                  </span>
                  <span className="footer-meta-sep">•</span>
                  <span>Main Stage Braga City Walk</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => goToCard(5)}
                    className="deck-nav-btn"
                    title="Kembali ke 05 Halal"
                  >
                    ← 05 Halal
                  </button>
                  <button
                    type="button"
                    onClick={() => goToCard(0)}
                    className="deck-nav-btn deck-nav-primary"
                    title="Kembali ke Awal (Cover)"
                  >
                    ↺ Ulang ke Cover
                  </button>
                </div>
              </footer>
            </div>
          </article>

        </div>

      </section>

      {/* Floating Interactive Controls (Bottom Right - Matching Ilia Delin reference) */}
      <div className="demo-hud" ref={hudRef} role="region" aria-label="Kontrol Animasi Rangkaian">
        <button
          type="button"
          onClick={() => goToCard(Math.max(0, (navigationTargetRef.current ?? activeCardIndexRef.current) - 1))}
          className="demo-hud-arrow"
          aria-label="Kartu program sebelumnya"
          title="Program sebelumnya"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={toggleAutoPlay}
          className="demo-hud-btn"
          aria-label={isPlaying ? 'Jeda sequence animasi' : 'Putar sequence animasi kartu'}
        >
          {isPlaying ? '⏸ Jeda Animasi' : '▶ Putar Animasi Kartu'}
        </button>
        <div className="demo-hud-stepper">
          <span ref={stepperTextRef}>Cover</span>
        </div>
        <button
          type="button"
          onClick={() => goToCard(Math.min(totalCardsRef.current - 1, (navigationTargetRef.current ?? activeCardIndexRef.current) + 1))}
          className="demo-hud-arrow"
          aria-label="Kartu program berikutnya"
          title="Program berikutnya"
        >
          ›
        </button>
      </div>
    </div>
  );
}
