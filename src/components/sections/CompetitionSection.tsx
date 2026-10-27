'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import './competition-tickets.css';

export default function CompetitionSection() {
  const [viewMode, setViewMode] = useState<'hadiah' | 'benefit'>('hadiah');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const stickerStageRef = useRef<HTMLDivElement | null>(null);
  const stickerTopRef = useRef<HTMLDivElement | null>(null);
  const peelFlapRef = useRef<HTMLDivElement | null>(null);
  const cornerCurlRef = useRef<HTMLDivElement | null>(null);
  const btnHadiahRef = useRef<HTMLButtonElement | null>(null);
  const btnBenefitRef = useRef<HTMLButtonElement | null>(null);

  // References for drag & animation state without triggering unnecessary re-renders
  const peelProgressRef = useRef<number>(0);
  const isBenefitRef = useRef<boolean>(false);
  const animRafRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartPeelRef = useRef<number>(0);

  const clamp = (val: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, val));
  };

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  /* ─── 1. RENDER 3D STICKER PEEL GEOMETRY ─── */
  const renderPeel = useCallback((p: number) => {
    const progress = clamp(p, 0, 1);
    peelProgressRef.current = progress;

    if (!stickerTopRef.current || !peelFlapRef.current) return;

    if (progress <= 0.001) {
      stickerTopRef.current.style.clipPath = 'none';
      peelFlapRef.current.style.opacity = '0';
      if (cornerCurlRef.current) cornerCurlRef.current.style.opacity = '0';
      return;
    }

    if (progress >= 0.999) {
      stickerTopRef.current.style.clipPath = 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)';
      peelFlapRef.current.style.opacity = '0';
      if (cornerCurlRef.current) cornerCurlRef.current.style.opacity = '0';
      return;
    }

    // Clip top gold sticker from left to right as it peels open
    const cutPercent = progress * 104;
    const topCut = clamp(cutPercent + 2, 0, 100);
    const bottomCut = clamp(cutPercent - 2, 0, 100);

    stickerTopRef.current.style.clipPath = `polygon(${topCut}% 0%, 100% 0%, 100% 100%, ${bottomCut}% 100%)`;

    // Show 3D curling backside flap while mid-peel (between 0.03 and 0.96)
    if (progress > 0.03 && progress < 0.96) {
      const stageWidth = stickerStageRef.current?.offsetWidth || 280;
      const flapX = progress * stageWidth - 26;
      const flapWidth = 32 + Math.sin(progress * Math.PI) * 26;

      peelFlapRef.current.style.opacity = '1';
      peelFlapRef.current.style.width = `${flapWidth}px`;
      peelFlapRef.current.style.left = `${flapX}px`;
      peelFlapRef.current.style.transform = `rotateZ(${6 - progress * 12}deg) scaleY(1.02)`;
    } else {
      peelFlapRef.current.style.opacity = '0';
    }
  }, []);

  /* ─── 2. APPLY VIEW STATE ─── */
  const applyViewMode = useCallback((benefitMode: boolean) => {
    isBenefitRef.current = benefitMode;
    setViewMode(benefitMode ? 'benefit' : 'hadiah');
  }, []);

  /* ─── 3. SMOOTH PHYSICS ANIMATION ─── */
  const animatePeelTo = useCallback(
    (target: number, duration = 480, onComplete?: () => void) => {
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
      const startVal = peelProgressRef.current;
      const delta = target - startVal;
      const startTime = performance.now();

      const step = (now: number) => {
        const t = clamp((now - startTime) / duration, 0, 1);
        const eased = easeInOutCubic(t);
        renderPeel(startVal + delta * eased);

        if (t >= 0.72) {
          applyViewMode(target >= 0.5);
        }

        if (t < 1) {
          animRafRef.current = requestAnimationFrame(step);
        } else {
          renderPeel(target);
          applyViewMode(target >= 0.5);
          if (onComplete) onComplete();
        }
      };

      animRafRef.current = requestAnimationFrame(step);
    },
    [applyViewMode, renderPeel]
  );

  /* ─── 4. INTERACTIVE DRAG & CLICK EVENTS ─── */
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartPeelRef.current = peelProgressRef.current;
    if (stickerStageRef.current) {
      stickerStageRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !stickerStageRef.current) return;
    const rect = stickerStageRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStartXRef.current;
    const nextPeel = clamp(dragStartPeelRef.current + dx / (rect.width * 0.82), 0, 1);
    renderPeel(nextPeel);
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const movedDistance = Math.abs(e.clientX - dragStartXRef.current);

    if (movedDistance < 8) {
      // Click toggles peel
      animatePeelTo(isBenefitRef.current ? 0 : 1, 520);
    } else {
      // Snap to Benefit if peeled past 38%, or back to Hadiah
      const threshold = isBenefitRef.current ? 0.62 : 0.38;
      animatePeelTo(peelProgressRef.current >= threshold ? 1 : 0, 360);
    }
  };

  const handleToggle = (mode: 'hadiah' | 'benefit') => {
    if (mode === 'hadiah') {
      animatePeelTo(0, 480);
    } else {
      animatePeelTo(1, 480);
    }
  };

  useEffect(() => {
    renderPeel(0);
    return () => {
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
    };
  }, [renderPeel]);

  return (
    <section
      id="competitions"
      className="competition-section-wrapper"
      aria-label="Kompetisi Resmi PRIDE Industri 2026"
    >
      <div
        ref={containerRef}
        className={`ticket-container ${viewMode === 'benefit' ? 'view-benefit-mode' : ''}`}
      >
        {/* ─── Top Section Header & Toggle ─── */}
        <header className="ticket-header">
          <div className="ticket-header-copy">
            <div className="ticket-header-badge">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Kompetisi Resmi PRIDE 2026</span>
            </div>
            <h2 className="ticket-main-title">
              Lomba Desain Kemasan <span className="title-amp">&amp;</span> Video
            </h2>
            <p className="ticket-main-desc">
              Kompetisi yang mendorong inovasi dan kualitas produk IKM/UMKM. Terbuka untuk Mahasiswa/i, Siswa/i &amp; Umum.
            </p>
          </div>

          <div className="toggle-wrapper">
            <div className="handwritten-note note-top-right">
              <span>100% Gratis!</span>
              <svg viewBox="0 0 32 28" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2 C14 10, 18 16, 17 24" />
                <path d="M11 20 L17 25 L22 19" />
              </svg>
            </div>

            <div className={`benefit-toggle ${viewMode === 'benefit' ? 'benefit-mode' : ''}`}>
              <div className="toggle-pill-bg" />
              <button
                ref={btnHadiahRef}
                type="button"
                onClick={() => handleToggle('hadiah')}
                className={`toggle-btn ${viewMode === 'hadiah' ? 'active' : ''}`}
              >
                Hadiah
              </button>
              <button
                ref={btnBenefitRef}
                type="button"
                onClick={() => handleToggle('benefit')}
                className={`toggle-btn ${viewMode === 'benefit' ? 'active' : ''}`}
              >
                Juara
              </button>
            </div>
          </div>
        </header>

        {/* ─── 2 Ticket Cards Grid: Lomba Video & Kreasi Kemasan ─── */}
        <div className="tickets-grid">
          {/* CARD 1: LOMBA VIDEO 60 DETIK (FEATURED BLUE TICKET WITH PEELABLE STICKER) */}
          <article className="ticket-card featured">
            <div className="ticket-top">
              <div className="ticket-title-row">
                <h3 className="ticket-plan-name">Lomba Video</h3>
                <span className="badge-popular">Favorit Kreator</span>
              </div>
              <p className="ticket-plan-desc">
                Abadikan keunikan dan denyut produk IKM Kota Bandung langsung di venue Braga.
              </p>

              {/* Interactive 3D Peel Sticker Stage */}
              <div
                ref={stickerStageRef}
                className="sticker-stage"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
                title="Tarik atau klik untuk mengelupas stiker"
              >
                {/* Underneath Layer: JUARA (Silver/Ice Blue Foil) */}
                <div className="sticker-face sticker-benefit-base">
                  <div className="sticker-top-row">
                    <span>APRESIASI LOMBA</span>
                    <span className="save-badge">PROGRAM RESMI</span>
                  </div>
                  <div className="sticker-main-row">
                    <span className="sticker-price">Juara</span>
                  </div>
                </div>

                {/* Top Peelable Layer: HADIAH (Gold Metallic Foil) */}
                <div
                  ref={stickerTopRef}
                  className="sticker-face sticker-hadiah-top"
                >
                  <div className="sticker-top-row">
                    <span>APRESIASI LOMBA</span>
                    <span className="save-badge">KLIK / KELUPAS</span>
                  </div>
                  <div className="sticker-main-row">
                    <span className="sticker-price">Hadiah</span>
                  </div>
                </div>

                {/* Dynamic 3D Fold Flap */}
                <div ref={peelFlapRef} className="peel-flap" />
              </div>

              <Link
                href="/competition/video-lokal"
                className="btn-register-ticket"
              >
                <span>Daftar Lomba Video</span>
              </Link>
            </div>

            <div className="ticket-divider">
              <span className="notch left" />
              <div className="perforation-line" />
              <span className="notch right" />
            </div>

            <div className="ticket-bottom">
              <ul className="feature-list">
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Peserta: Terbuka untuk Mahasiswa/i, Siswa/i &amp; Umum</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>4 Kategori: Fesyen, Kuliner, Kriya, atau Pesona PRIDE 2026</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Durasi Maksimal 60 Detik</span>
                </li>
              </ul>

              <a
                href="/syarat-video-lokal.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pdf-link btn-pdf-featured"
              >
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span>Unduh Syarat &amp; Ketentuan PDF</span>
              </a>

              <div className="ticket-footer">
                <span>PRIDE-VL / VIDEO-2026</span>
                <div className="barcode" />
              </div>
            </div>
          </article>

          {/* CARD 2: KREASI KEMASAN */}
          <article className="ticket-card">
            <div className="ticket-top">
              <div className="ticket-title-row">
                <h3 className="ticket-plan-name">Kreasi Kemasan</h3>
                <span className="badge-category">Kuliner Lokal</span>
              </div>
              <p className="ticket-plan-desc">
                Inovasi kemasan ramah lingkungan produk kuliner berbahan dasar lokal khas Bandung.
              </p>

              <div className="price-block">
                <div className="price-amount-wrap">
                  <div className="price-roller">
                    <span>Hadiah</span>
                    <span>Juara</span>
                  </div>
                </div>
              </div>

              <Link
                href="/competition/desain-kemasan"
                className="btn-register-ticket"
              >
                <span>Daftar Kreasi Kemasan</span>
              </Link>
            </div>

            <div className="ticket-divider">
              <span className="notch left" />
              <div className="perforation-line" />
              <span className="notch right" />
            </div>

            <div className="ticket-bottom">
              <ul className="feature-list">
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Peserta: Terbuka untuk Mahasiswa/i, Siswa/i &amp; Umum</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Eksplorasi material ramah lingkungan pangan olahan lokal</span>
                </li>
              </ul>

              <div className="flex flex-col gap-2.5">
                <a
                  href="/template-desain-kemasan.pdf"
                  download
                  className="btn-pdf-link btn-download-template"
                >
                  <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Unduh Format Template Desain (PDF)</span>
                </a>

                <a
                  href="/syarat-desain-kemasan.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pdf-link btn-download-syarat"
                >
                  <svg className="w-4 h-4 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span>Unduh Syarat &amp; Ketentuan PDF</span>
                </a>
              </div>

              <div className="ticket-footer">
                <span>PRIDE-DK / KEMASAN-2026</span>
                <div className="barcode" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
