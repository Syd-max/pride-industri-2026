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

    if (!stickerTopRef.current || !peelFlapRef.current || !cornerCurlRef.current) return;

    // Clip top gold sticker from left to right as it peels open
    const cutPercent = progress * 104;
    const topCut = clamp(cutPercent + 6, 0, 100);
    const bottomCut = clamp(cutPercent - 6, 0, 100);

    stickerTopRef.current.style.clipPath = `polygon(${topCut}% 0%, 100% 0%, 100% 100%, ${bottomCut}% 100%)`;

    // Show 3D curling backside flap while mid-peel (between 0.02 and 0.96)
    if (progress > 0.02 && progress < 0.96) {
      const stageWidth = stickerStageRef.current?.offsetWidth || 280;
      const flapX = progress * stageWidth - 26;
      const flapWidth = 32 + Math.sin(progress * Math.PI) * 26;

      peelFlapRef.current.style.opacity = '1';
      peelFlapRef.current.style.width = `${flapWidth}px`;
      peelFlapRef.current.style.left = `${flapX}px`;
      peelFlapRef.current.style.transform = `rotateZ(${6 - progress * 12}deg) scaleY(1.02)`;
      cornerCurlRef.current.style.opacity = '0';
    } else {
      peelFlapRef.current.style.opacity = '0';
      cornerCurlRef.current.style.opacity = '1';

      if (progress >= 0.96) {
        cornerCurlRef.current.style.background =
          'linear-gradient(135deg, #1e40af 48%, #ffffff 50%, #bfdbfe 100%)';
      } else {
        cornerCurlRef.current.style.background =
          'linear-gradient(135deg, #1e40af 48%, #fef08a 50%, #eab308 100%)';
      }
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
              Dua Ajang Kreasi &amp; Inovasi Industri
            </h2>
            <p className="ticket-main-desc">
              Terbuka untuk umum WNI. Tunjukkan karya desain kemasan ramah lingkungan
              terbaik atau video sinematik 60 detik untuk mengangkat produk IKM Kota Bandung.
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
                Hadiah Tunai
              </button>
              <button
                ref={btnBenefitRef}
                type="button"
                onClick={() => handleToggle('benefit')}
                className={`toggle-btn ${viewMode === 'benefit' ? 'active' : ''}`}
              >
                Benefit Juara
              </button>
            </div>
          </div>
        </header>

        {/* ─── 3 Ticket Cards Grid ─── */}
        <div className="tickets-grid">
          {/* CARD 1: LOMBA DESAIN KEMASAN */}
          <article className="ticket-card">
            <div className="ticket-top">
              <div className="ticket-title-row">
                <h3 className="ticket-plan-name">Desain Kemasan</h3>
                <span className="badge-category">Kuliner Lokal</span>
              </div>
              <p className="ticket-plan-desc">
                Inovasi kemasan ramah lingkungan produk kuliner berbahan dasar lokal khas Bandung.
              </p>

              <div className="price-block">
                <div className="price-amount-wrap">
                  <div className="price-roller">
                    <span>Rp 2,25 Jt</span>
                    <span>Sertifikat</span>
                  </div>
                </div>
                <div className="price-meta">
                  <strong>
                    {viewMode === 'benefit' ? '+ Binaan IKM' : 'Total Hadiah'}
                  </strong>
                  <span>
                    {viewMode === 'benefit' ? 'Disdagin Kota Bandung' : 'Juara 1 s.d 3'}
                  </span>
                </div>
              </div>

              <p className="ticket-schedule-note">
                {viewMode === 'benefit'
                  ? 'Fasilitasi HKI & promosi kurasi ekspor'
                  : 'Pendaftaran 21 Okt – 21 Nov 2026 · Gratis'}
              </p>

              <Link
                href="/competition/desain-kemasan"
                className="btn-register-ticket"
              >
                <span>Daftar Desain Kemasan</span>
                <span>→</span>
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
                  <span>Juara I: Rp 1.000.000 · Juara II: Rp 750.000 · Juara III: Rp 500.000</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Eksplorasi material ramah lingkungan pangan olahan lokal</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Format 1 PDF Maks. 10 MB (Konsep, Pola &amp; Mockup 3D)</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>100% Gratis / Tanpa Biaya Pendaftaran</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Grand Final &amp; Display Karya di Braga City Walk (28 Nov)</span>
                </li>
              </ul>

              <a
                href="/syarat-desain-kemasan.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pdf-link"
              >
                <svg className="w-3.5 h-3.5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span>Unduh Syarat &amp; Ketentuan PDF</span>
              </a>

              <div className="ticket-footer">
                <span>PRIDE-DK / KEMASAN-2026</span>
                <div className="barcode" />
              </div>
            </div>
          </article>

          {/* CARD 2: LOMBA VIDEO 1 MENIT (FEATURED BLUE TICKET WITH PEELABLE STICKER) */}
          <article className="ticket-card featured">
            <div className="ticket-top">
              <div className="ticket-title-row">
                <h3 className="ticket-plan-name">Video 60 Detik</h3>
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
                title="Tarik atau klik untuk mengelupas antara Hadiah Tunai & Benefit"
              >
                {/* Corner Curl Invite */}
                <div ref={cornerCurlRef} className="corner-curl" />

                {/* Underneath Layer: BENEFIT (Silver/Ice Blue Foil) */}
                <div className="sticker-face sticker-benefit-base">
                  <div className="sticker-top-row">
                    <span>FASILITAS JUARA</span>
                    <span className="save-badge">GOLDEN PASS</span>
                  </div>
                  <div className="sticker-main-row">
                    <span className="sticker-price">Piala</span>
                    <div className="sticker-unit">
                      <strong>Walikota Bandung</strong>
                      <span>+ Promosi Resmi Pemkot</span>
                    </div>
                  </div>
                </div>

                {/* Top Peelable Layer: HADIAH TUNAI (Gold Metallic Foil) */}
                <div
                  ref={stickerTopRef}
                  className="sticker-face sticker-hadiah-top"
                >
                  <div className="sticker-top-row">
                    <span>TOTAL HADIAH</span>
                    <span className="save-badge">KLIK / KELUPAS BENEFIT ↗</span>
                  </div>
                  <div className="sticker-main-row">
                    <span className="sticker-price">Rp 2,25 Jt</span>
                    <div className="sticker-unit">
                      <strong>Uang Tunai</strong>
                      <span>Juara I, II &amp; III</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic 3D Fold Flap */}
                <div ref={peelFlapRef} className="peel-flap" />
              </div>

              <p className="ticket-schedule-note">
                {viewMode === 'benefit'
                  ? 'Showcase video di panggung utama festival'
                  : 'Shooting 27–28 Nov 2026 di Braga City Walk'}
              </p>

              <Link
                href="/competition/video-lokal"
                className="btn-register-ticket"
              >
                <span>Daftar Lomba Video</span>
                <span>→</span>
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
                  <span>Juara I: Rp 1.000.000 · Juara II: Rp 750.000 · Juara III: Rp 500.000</span>
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
                  <span>Durasi Maksimal 60 Detik (Format Reels / TikTok Vertikal 9:16)</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Pengambilan video langsung di venue Braga City Walk</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Penjurian langsung praktisi sinematografi &amp; Disdagin</span>
                </li>
              </ul>

              <a
                href="/syarat-video-lokal.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pdf-link"
              >
                <svg className="w-3.5 h-3.5 text-blue-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

          {/* CARD 3: ALL-ACCESS PESERTA & INKUBASI IKM */}
          <article className="ticket-card">
            <div className="ticket-top">
              <div className="ticket-title-row">
                <h3 className="ticket-plan-name">All-Access Peserta</h3>
                <span className="badge-category">Inkubasi IKM</span>
              </div>
              <p className="ticket-plan-desc">
                Seluruh peserta otomatis terdaftar dalam jejaring talenta &amp; pembinaan industri.
              </p>

              <div className="price-block">
                <div className="price-amount-wrap">
                  <div className="price-roller">
                    <span>Rp 4,5 Jt</span>
                    <span>GRATIS</span>
                  </div>
                </div>
                <div className="price-meta">
                  <strong>
                    {viewMode === 'benefit' ? 'Akses Ekosistem' : 'Akumulasi Hadiah'}
                  </strong>
                  <span>
                    {viewMode === 'benefit' ? 'Seluruh Peserta Terdaftar' : 'Kedua Cabang Lomba'}
                  </span>
                </div>
              </div>

              <p className="ticket-schedule-note">
                {viewMode === 'benefit'
                  ? 'Akses temu bisnis & seminar ekspor gratis'
                  : 'Penganugerahan Resmi di Main Stage Braga'}
              </p>

              <a
                href="#agenda"
                className="btn-register-ticket"
              >
                <span>Lihat Rundown Festival</span>
                <span>↓</span>
              </a>
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
                  <span>E-Sertifikat Kepesertaan Resmi Dinas Perdagangan &amp; Perindustrian</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Akses VIP ke Sesi Gelar Wicara &amp; Temu Bisnis Ekspor</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Peluang kurasi &amp; pendampingan merek / HKI IKM binaan</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Showcase karya terpilih di galeri seni Braga City Walk</span>
                </li>
                <li>
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Jejaring kolaborasi dengan 100+ pelaku usaha kreatif Bandung</span>
                </li>
              </ul>

              <div className="btn-pdf-link cursor-default opacity-85">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Otomatis Aktif untuk Seluruh Pendaftar</span>
              </div>

              <div className="ticket-footer">
                <span>PRIDE-ALL / FESTIVAL-2026</span>
                <div className="barcode" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
