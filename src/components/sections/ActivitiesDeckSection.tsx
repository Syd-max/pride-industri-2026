'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import './activities-deck.css';

interface ProgramPreview {
  id: number;
  title: string;
  category: string;
  venue: string;
  iconType: 'fashion' | 'packaging' | 'video' | 'gala' | 'cert' | 'music';
  accent: string;
}

const PROGRAMS: ProgramPreview[] = [
  {
    id: 1,
    title: 'Fashion Show Runway',
    category: 'Fesyen & Wastra',
    venue: '27 Nov · Main Stage Braga',
    iconType: 'fashion',
    accent: '#ec4899',
  },
  {
    id: 2,
    title: 'Lomba Desain Kemasan',
    category: 'Eco-Packaging IKM',
    venue: '28 Nov · Expo Braga City Walk',
    iconType: 'packaging',
    accent: '#10b981',
  },
  {
    id: 3,
    title: 'Lomba Video 1 Menit',
    category: 'Kreativitas Visual',
    venue: '27–28 Nov · Braga City Walk',
    iconType: 'video',
    accent: '#f59e0b',
  },
  {
    id: 4,
    title: 'Malam Gala SIINAS',
    category: 'Apresiasi Industri',
    venue: '28 Nov · Hotel Papandayan',
    iconType: 'gala',
    accent: '#eab308',
  },
  {
    id: 5,
    title: 'Sertifikasi Halal & SNI',
    category: 'Standarisasi Mutu',
    venue: '27–28 Nov · Main Stage Braga',
    iconType: 'cert',
    accent: '#06b6d4',
  },
  {
    id: 6,
    title: 'Panggung Seni Budaya',
    category: 'Perkusi & Musik Etnik',
    venue: '27–28 Nov · Area Braga',
    iconType: 'music',
    accent: '#8b5cf6',
  },
];

export default function ActivitiesDeckSection() {
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const deckContainerRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Jump smoothly to a specific card index (0 to 5)
  const scrollToCard = useCallback((cardIdx: number) => {
    if (!scrollDriverRef.current) return;
    const driver = scrollDriverRef.current;
    const rect = driver.getBoundingClientRect();
    const driverTop = window.scrollY + rect.top;
    const totalScroll = driver.offsetHeight - window.innerHeight;
    if (totalScroll <= 0) return;

    // Progress mapping matching updateDeck calibration:
    // t = clamp((scrollProgress - 0.05) / 0.90, 0, 1) * 5
    // For cardIdx (0..5), scrollProgress = 0.05 + (cardIdx / 5) * 0.90
    let targetProgress = 0;
    if (cardIdx <= 0) {
      targetProgress = 0.02;
    } else if (cardIdx >= 5) {
      targetProgress = 0.96;
    } else {
      targetProgress = 0.05 + (cardIdx / 5) * 0.90;
    }

    const targetY = driverTop + targetProgress * totalScroll;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    /* ==========================================================
       1. PROCEDURAL 3D CANVAS ARTWORK RENDERERS
       ========================================================== */
    function drawUnifiedCanvasBase(ctx: CanvasRenderingContext2D, w: number, h: number) {
      const baseGrad = ctx.createLinearGradient(0, 0, w, h);
      baseGrad.addColorStop(0, '#070b14');
      baseGrad.addColorStop(0.5, '#0c1220');
      baseGrad.addColorStop(1, '#05070f');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 64;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let x = 0; x < w; x += step * 2) {
        for (let y = 0; y < h; y += step * 2) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // Canvas 1: Fashion Show Runway
    function drawFashionArt() {
      const canvas = document.getElementById('canvasFashion') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      const wavePositions = [
        { x: 920, y: 460, r: 420, c1: 'rgba(124, 58, 237, 0.45)', c2: 'rgba(99, 102, 241, 0.25)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 740, y: 220, r: 300, c1: 'rgba(236, 72, 153, 0.35)', c2: 'rgba(129, 140, 248, 0.18)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 1120, y: 660, r: 360, c1: 'rgba(56, 189, 248, 0.35)', c2: 'rgba(37, 99, 235, 0.2)', c3: 'rgba(7, 11, 20, 0)' }
      ];
      wavePositions.forEach((wp) => {
        const g = ctx.createRadialGradient(wp.x - 60, wp.y - 60, 20, wp.x, wp.y, wp.r);
        g.addColorStop(0, wp.c1);
        g.addColorStop(0.5, wp.c2);
        g.addColorStop(1, wp.c3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, wp.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(236, 72, 153, 0.18)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 24; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.15 + i * 28, 0);
        ctx.bezierCurveTo(w * 0.45, h * 0.35, w * 0.35 + i * 16, h * 0.7, w * 0.85, h);
        ctx.stroke();
      }

      const spheres = [
        { x: 420, y: 240, r: 85, color: '#ec4899' },
        { x: 540, y: 380, r: 110, color: '#8b5cf6' },
        { x: 480, y: 560, r: 95, color: '#3b82f6' },
        { x: 380, y: 700, r: 75, color: '#06b6d4' }
      ];
      spheres.forEach((s) => {
        const sg = ctx.createRadialGradient(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.05, s.x, s.y, s.r);
        sg.addColorStop(0, '#ffffff');
        sg.addColorStop(0.4, s.color);
        sg.addColorStop(1, '#070b14');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Canvas 2: Lomba Desain Kemasan
    function drawPackagingArt() {
      const canvas = document.getElementById('canvasPackaging') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      const ecoGlows = [
        { x: 920, y: 380, r: 380, c1: 'rgba(16, 185, 129, 0.35)', c2: 'rgba(5, 150, 105, 0.18)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 400, y: 540, r: 320, c1: 'rgba(52, 211, 153, 0.25)', c2: 'rgba(4, 120, 87, 0.12)', c3: 'rgba(7, 11, 20, 0)' }
      ];
      ecoGlows.forEach((eg) => {
        const g = ctx.createRadialGradient(eg.x, eg.y, 10, eg.x, eg.y, eg.r);
        g.addColorStop(0, eg.c1);
        g.addColorStop(0.5, eg.c2);
        g.addColorStop(1, eg.c3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(eg.x, eg.y, eg.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.save();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.32)';
      ctx.lineWidth = 1.6;
      const boxes = [
        { cx: 940, cy: 360, size: 130 },
        { cx: 780, cy: 520, size: 95 }
      ];
      boxes.forEach((b) => {
        const s = b.size;
        ctx.beginPath();
        ctx.moveTo(b.cx, b.cy - s * 0.6);
        ctx.lineTo(b.cx + s * 0.9, b.cy - s * 0.1);
        ctx.lineTo(b.cx, b.cy + s * 0.4);
        ctx.lineTo(b.cx - s * 0.9, b.cy - s * 0.1);
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(b.cx - s * 0.9, b.cy - s * 0.1); ctx.lineTo(b.cx - s * 0.9, b.cy + s * 0.6);
        ctx.moveTo(b.cx, b.cy + s * 0.4); ctx.lineTo(b.cx, b.cy + s * 1.1);
        ctx.moveTo(b.cx + s * 0.9, b.cy - s * 0.1); ctx.lineTo(b.cx + s * 0.9, b.cy + s * 0.6);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(b.cx - s * 0.9, b.cy + s * 0.6);
        ctx.lineTo(b.cx, b.cy + s * 1.1);
        ctx.lineTo(b.cx + s * 0.9, b.cy + s * 0.6);
        ctx.stroke();
      });
      ctx.restore();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('ECO-BOX · 300g · BIODEGRADABLE', 820, 240);
      ctx.fillText('STANDAR EKSPOR IKM · 100%', 820, 520);
    }

    // Canvas 3: Lomba Video 1 Menit
    function drawVideoArt() {
      const canvas = document.getElementById('canvasVideo') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      const videoGlows = [
        { x: 880, y: 440, r: 400, c1: 'rgba(245, 158, 11, 0.35)', c2: 'rgba(234, 88, 12, 0.2)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 420, y: 260, r: 280, c1: 'rgba(239, 68, 68, 0.25)', c2: 'rgba(180, 83, 9, 0.15)', c3: 'rgba(7, 11, 20, 0)' }
      ];
      videoGlows.forEach((vg) => {
        const g = ctx.createRadialGradient(vg.x, vg.y, 10, vg.x, vg.y, vg.r);
        g.addColorStop(0, vg.c1);
        g.addColorStop(0.5, vg.c2);
        g.addColorStop(1, vg.c3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(vg.x, vg.y, vg.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const palette = ['rgba(245, 158, 11, 0.32)', 'rgba(234, 88, 12, 0.28)', 'rgba(220, 38, 38, 0.22)', 'rgba(251, 191, 36, 0.3)'];
      for (let i = 0; i < 42; i++) {
        ctx.strokeStyle = palette[i % palette.length];
        ctx.lineWidth = 1.6 + (i % 3) * 1.2;
        const startX = (i * 30) % (w + 100);
        ctx.beginPath();
        ctx.moveTo(startX, h + 30);
        ctx.bezierCurveTo(startX - 120, h * 0.55, startX + 140, h * 0.3, startX + 60, -40);
        ctx.stroke();
      }

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.lineWidth = 1.8;
      const vx = 860, vy = 280, vw = 200, vh = 280;
      ctx.beginPath(); ctx.moveTo(vx, vy + 24); ctx.lineTo(vx, vy); ctx.lineTo(vx + 24, vy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(vx + vw - 24, vy); ctx.lineTo(vx + vw, vy); ctx.lineTo(vx + vw, vy + 24); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(vx, vy + vh - 24); ctx.lineTo(vx, vy + vh); ctx.lineTo(vx + 24, vy + vh); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(vx + vw - 24, vy + vh); ctx.lineTo(vx + vw, vy + vh); ctx.lineTo(vx + vw, vy + vh - 24); ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(vx + 18, vy + 20, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('REC [●] 00:01:00 · 9:16 REELS', vx + 28, vy + 24);
      ctx.restore();
    }

    // Canvas 4: Apresiasi Industri SIINAS
    function drawAwardsArt() {
      const canvas = document.getElementById('canvasAwards') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      const tg = ctx.createRadialGradient(960, 420, 10, 960, 420, 380);
      tg.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      tg.addColorStop(0.4, 'rgba(217, 119, 6, 0.18)');
      tg.addColorStop(1, 'rgba(7, 11, 20, 0)');
      ctx.fillStyle = tg;
      ctx.beginPath(); ctx.arc(960, 420, 380, 0, Math.PI * 2); ctx.fill();

      const colCount = 18;
      for (let i = 0; i < colCount; i++) {
        const x = 520 + i * 44;
        const g = ctx.createLinearGradient(x, 0, x + 30, h);
        g.addColorStop(0, 'rgba(212, 175, 55, 0.2)');
        g.addColorStop(0.5, 'rgba(180, 83, 9, 0.1)');
        g.addColorStop(1, 'rgba(7, 11, 20, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x + 36, 0);
        ctx.lineTo(x - 80, h); ctx.lineTo(x - 116, h);
        ctx.closePath();
        ctx.fill();
      }

      for (let r = 40; r <= 200; r += 40) {
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(960, 420, r, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('MALAM GALA ANUGERAH SIINAS · 200 IKM BINAAN', 780, 210);
    }

    // Canvas 5: Sertifikasi & Live Art
    function drawMusicArt() {
      const canvas = document.getElementById('canvasMusic') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      const acousticGlows = [
        { x: 380, y: 440, r: 380, c1: 'rgba(6, 182, 212, 0.32)', c2: 'rgba(13, 148, 136, 0.18)', c3: 'rgba(7, 11, 20, 0)' },
        { x: 960, y: 360, r: 360, c1: 'rgba(56, 189, 248, 0.3)', c2: 'rgba(59, 130, 246, 0.15)', c3: 'rgba(7, 11, 20, 0)' }
      ];
      acousticGlows.forEach((ag) => {
        const g = ctx.createRadialGradient(ag.x, ag.y, 10, ag.x, ag.y, ag.r);
        g.addColorStop(0, ag.c1);
        g.addColorStop(0.5, ag.c2);
        g.addColorStop(1, ag.c3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ag.x, ag.y, ag.r, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let r = 30; r < 360; r += 32) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(380, 440, r, 0, Math.PI * 2); ctx.stroke();
      }

      const barCount = 42;
      const startX = w * 0.18;
      const barWidth = (w * 0.64) / barCount;
      for (let i = 0; i < barCount; i++) {
        const barH = 35 + Math.sin(i * 0.4) * 110 + Math.cos(i * 0.7) * 45;
        const x = startX + i * barWidth;
        const y = h * 0.52 - barH / 2;
        const g = ctx.createLinearGradient(x, y, x, y + barH);
        g.addColorStop(0, '#06b6d4');
        g.addColorStop(0.5, '#3b82f6');
        g.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = g;
        ctx.fillRect(x + 2, y, barWidth - 4, barH);
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('100 HALAL · 3 SNI · LIVE PERCUSSION BEAT', 820, 230);
    }

    drawFashionArt();
    drawPackagingArt();
    drawVideoArt();
    drawAwardsArt();
    drawMusicArt();

    /* ==========================================================
       2. REFINED STACKED DECK SCROLL CHOREOGRAPHY (UPWARD PEEL)
       ========================================================== */
    const container = deckContainerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll<HTMLElement>('.activities-card'));
    cards.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

    const totalCards = cards.length; // 6 cards (0..5)

    function clamp(val: number, min: number, max: number) {
      return Math.max(min, Math.min(max, val));
    }

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function updateDeck(scrollProgress: number) {
      const isMobile = window.innerWidth <= 768;
      const PEEK_STEP_Y = isMobile ? 10 : 16;
      const SCALE_STEP = isMobile ? 0.024 : 0.032;

      // Calibration with entry dwell (0.0 to 0.05) & exit dwell (0.95 to 1.0)
      const peelableCount = totalCards - 1; // 5 transitions
      const t = clamp((scrollProgress - 0.05) / 0.90, 0, 1) * peelableCount;

      const currentIdx = clamp(Math.round(t), 0, totalCards - 1);
      setActiveCardIndex(currentIdx);

      cards.forEach((card, i) => {
        // Z-Index order: Card 0 is 60, Card 1 is 50, ..., Card 5 is 10
        card.style.zIndex = String((totalCards - i) * 10);

        const isFinalCard = i === totalCards - 1;
        const depth = isFinalCard ? Math.max(0, i - t) : (i - t);

        if (depth < 0) {
          // Card has peeled off: slide UPWARD cleanly out of the stack
          const peelAmount = clamp(-depth, 0, 1);
          // Natural responsive easing: moves immediately as user scrolls
          const easedPeel = peelAmount * (1.6 - 0.6 * peelAmount);
          const translateYPercent = -easedPeel * 112; // Slide fully up and off screen
          const scale = 1 - easedPeel * 0.04;
          // Card remains 100% solid & opaque while peeling!
          // Only fade in the very final 12% as it exits the top boundary.
          const opacity = peelAmount >= 0.88 ? Math.max(0, 1 - (peelAmount - 0.88) / 0.12) : 1;

          card.style.transform = `translate3d(0, ${translateYPercent.toFixed(2)}%, 0) scale(${scale.toFixed(4)})`;
          card.style.opacity = opacity.toFixed(3);
          card.style.pointerEvents = peelAmount > 0.1 ? 'none' : 'auto';
          card.style.visibility = peelAmount >= 0.99 ? 'hidden' : 'visible';
        } else {
          // Card is active or waiting behind in the stack
          const effectiveDepth = Math.min(depth, 3.5);
          const yOffset = effectiveDepth * PEEK_STEP_Y;
          const scale = 1 - effectiveDepth * SCALE_STEP;

          card.style.transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
          card.style.opacity = '1';
          card.style.visibility = 'visible';
          card.style.pointerEvents = depth < 0.3 ? 'auto' : 'none';
        }
      });
    }

    function getScrollProgress(): number {
      const driver = scrollDriverRef.current;
      if (!driver) return 0;
      const rect = driver.getBoundingClientRect();
      const totalScroll = driver.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return 0;
      const current = -rect.top;
      return clamp(current / totalScroll, 0, 1);
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateDeck(getScrollProgress());
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      drawFashionArt();
      drawPackagingArt();
      drawVideoArt();
      drawAwardsArt();
      drawMusicArt();
      handleScroll();
    }, { passive: true });

    // Initial render call
    updateDeck(getScrollProgress());

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="activities-scroll-driver" id="programUnggulan" ref={scrollDriverRef}>
      <section className="activities-stage" aria-label="6 Program Unggulan PRIDE 2026">

        {/* 6-Card Stack Deck Container */}
        <div className="activities-deck-container" ref={deckContainerRef}>

          {/* LAYER 5: SERTIFIKASI & LIVE ART (Card 5) */}
          <article className="activities-card deck-project-card" data-index="5">
            <canvas className="deck-project-canvas" id="canvasMusic" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">SERTIFIKASI &amp; LIVE ART</span>
                  <span className="deck-project-subtitle">27–28 NOV 2026 · BRAGA CITY WALK</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">100 HALAL &amp; 3 SNI</span>
                  <span className="deck-tag-pill">STANDAR MUTU</span>
                  <span className="deck-tag-pill">PANGGUNG SENI</span>
                </div>
              </div>

              {/* Center Description Box */}
              <div className="deck-center-box">
                <div className="deck-center-badge">
                  <span>STANDARISASI &amp; SENI BUDAYA</span>
                </div>
                <h3 className="deck-center-title">
                  Penyerahan 100 Halal, SNI &amp; Panggung Seni Budaya
                </h3>
                <p className="deck-center-desc">
                  Seremonial penyerahan simbolis 100 Sertifikat Halal gratis, 3 SNI, dan 100 fasilitasi uji laboratorium mutu IKM dari Disdagin Kota Bandung. Disemarakkan layanan konsultasi legalitas usaha langsung serta atraksi perkusi etnik dan musik elektronik kontemporer.
                </p>
                <div className="deck-center-meta">
                  <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>14:00 — 21:00 WIB</span>
                  <span className="text-slate-500">•</span>
                  <span>Main Stage Braga City Walk</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-semibold">Terbuka untuk Umum</span>
                </div>
              </div>
            </div>
          </article>

          {/* LAYER 4: MALAM GALA APRESIASI INDUSTRI (Card 4) */}
          <article className="activities-card deck-project-card" data-index="4">
            <canvas className="deck-project-canvas" id="canvasAwards" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">APRESIASI INDUSTRI SIINAS</span>
                  <span className="deck-project-subtitle">28 NOV 2026 · HOTEL PAPANDAYAN</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">MALAM ANUGERAH</span>
                  <span className="deck-tag-pill">KEPATUHAN SIINAS</span>
                  <span className="deck-tag-pill">200 IKM BINAAN</span>
                </div>
              </div>

              {/* Center Description Box */}
              <div className="deck-center-box">
                <div className="deck-center-badge">
                  <span>MALAM PENGANUGERAHAN</span>
                </div>
                <h3 className="deck-center-title">
                  Malam Anugerah &amp; Temu Kemitraan SIINAS
                </h3>
                <p className="deck-center-desc">
                  Malam gala kehormatan penganugerahan penghargaan bagi 200 pelaku industri dan IKM Kota Bandung yang tertib dan patuh dalam pelaporan Sistem Informasi Industri Nasional (SIINAS), dirangkai gala dinner formal bersama Walikota Bandung dan pimpinan industri.
                </p>
                <div className="deck-center-meta">
                  <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>19:00 — 21:00 WIB</span>
                  <span className="text-slate-500">•</span>
                  <span>Grand Ballroom The Papandayan</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-300 font-semibold">Khusus Undangan Resmi</span>
                </div>
              </div>
            </div>
          </article>

          {/* LAYER 3: LOMBA VIDEO 1 MENIT BRAGA (Card 3) */}
          <article className="activities-card deck-project-card" data-index="3">
            <canvas className="deck-project-canvas" id="canvasVideo" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">LOMBA VIDEO 1 MENIT</span>
                  <span className="deck-project-subtitle">27–28 NOV 2026 · BRAGA CITY WALK</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">VIDEO VERTIKAL</span>
                  <span className="deck-tag-pill">CERITA LOKAL</span>
                  <span className="deck-tag-pill">REELS &amp; TIKTOK</span>
                </div>
              </div>

              {/* Center Description Box */}
              <div className="deck-center-box">
                <div className="deck-center-badge">
                  <span>KREATIVITAS VISUAL</span>
                </div>
                <h3 className="deck-center-title">
                  Hunting Konten &amp; Screening Video 1 Menit
                </h3>
                <p className="deck-center-desc">
                  Ratusan kreator visual mengabadikan dinamika produk IKM, kearifan lokal, dan atmosfer festival di koridor bersejarah Jalan Braga dalam format video vertikal 60 detik. Karya-karya kurasi terbaik ditayangkan langsung di videotron panggung utama festival.
                </p>
                <div className="deck-center-meta">
                  <svg className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Screening 28 Nov 16:00 WIB</span>
                  <span className="text-slate-500">•</span>
                  <span>Layar Videotron Braga City Walk</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-semibold">Terbuka untuk Umum</span>
                </div>
              </div>
            </div>
          </article>

          {/* LAYER 2: LOMBA DESAIN KEMASAN IKM (Card 2) */}
          <article className="activities-card deck-project-card" data-index="2">
            <canvas className="deck-project-canvas" id="canvasPackaging" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">LOMBA DESAIN KEMASAN</span>
                  <span className="deck-project-subtitle">28 NOV 2026 · EXPO BRAGA CITY WALK</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">ECO-PACKAGING</span>
                  <span className="deck-tag-pill">PANGAN LOKAL</span>
                  <span className="deck-tag-pill">KESIAPAN EKSPOR</span>
                </div>
              </div>

              {/* Center Description Box */}
              <div className="deck-center-box">
                <div className="deck-center-badge">
                  <span>INOVASI KEMASAN IKM</span>
                </div>
                <h3 className="deck-center-title">
                  Showcase &amp; Penjurian Terbuka Desain Kemasan
                </h3>
                <p className="deck-center-desc">
                  Pameran fisik dan presentasi langsung karya mockup 3D kemasan ramah lingkungan produk kuliner olahan pangan lokal binaan Bandung. Finalis memaparkan konsep di hadapan dewan juri ahli serta kurator Rumah Kemasan untuk kesiapan pasar ritel modern dan ekspor.
                </p>
                <div className="deck-center-meta">
                  <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>10:00 — 16:30 WIB</span>
                  <span className="text-slate-500">•</span>
                  <span>Area Pameran Braga City Walk</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-semibold">Display Terbuka</span>
                </div>
              </div>
            </div>
          </article>

          {/* LAYER 1: FASHION SHOW RUNWAY (Card 1) */}
          <article className="activities-card deck-project-card" data-index="1">
            <canvas className="deck-project-canvas" id="canvasFashion" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">FASHION SHOW RUNWAY</span>
                  <span className="deck-project-subtitle">27 NOV 2026 · MAIN STAGE BRAGA</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">DESAINER BINAAN</span>
                  <span className="deck-tag-pill">READY-TO-WEAR</span>
                  <span className="deck-tag-pill">WASTRA BANDUNG</span>
                </div>
              </div>

              {/* Center Description Box */}
              <div className="deck-center-box">
                <div className="deck-center-badge">
                  <span>FESYEN &amp; WASTRA</span>
                </div>
                <h3 className="deck-center-title">
                  Peragaan Busana Wastra Kontemporer
                </h3>
                <p className="deck-center-desc">
                  Peragaan busana siap pakai (ready-to-wear) karya 20+ desainer fesyen binaan Disdagin Kota Bandung. Menampilkan eksplorasi motif khas dan kain nusantara berstandar internasional, dilengkapi sesi temu bisnis langsung bersama kurator dan pembeli potensial.
                </p>
                <div className="deck-center-meta">
                  <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>15:30 — 17:30 WIB</span>
                  <span className="text-slate-500">•</span>
                  <span>Main Runway Stage Braga</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-semibold">Terbuka untuk Umum</span>
                </div>
              </div>
            </div>
          </article>

          {/* LAYER 0 (Frontmost): RICH INTRO COVER CARD (No Empty Void) */}
          <section className="activities-card deck-intro-card" data-index="0">
            {/* Top Bar */}
            <div className="deck-intro-top">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 mb-2 sm:mb-3">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>Rangkaian Acara Festival</span>
                </div>
                <h2 className="deck-hero-name" aria-label="6 PROGRAM UNGGULAN">
                  6 PROGRAM UNGGULAN
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-slate-700 shadow-xs">
                <span className="inline-flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-rose-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
                  </svg>
                  <span>Braga City Walk</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-600">27–28 Nov 2026</span>
              </div>
            </div>

            {/* ─── 6 PROGRAM SHOWCASE GRID (Fills Card 0 Center Richly) ─── */}
            <div className="deck-intro-showcase">
              <div className="deck-showcase-header">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Sorotan Program Resmi (Klik Kartu Untuk Membuka Detail)
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  6 Program Terpadu
                </span>
              </div>

              <div className="deck-program-grid">
                {PROGRAMS.map((prog) => (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => scrollToCard(prog.id)}
                    className="deck-program-item group"
                  >
                    <div className="deck-program-item-top">
                      <span className="deck-prog-idx font-mono font-bold">{`0${prog.id}`}</span>
                      <span className="deck-prog-icon flex items-center justify-center">
                        {prog.iconType === 'fashion' && (
                          <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                          </svg>
                        )}
                        {prog.iconType === 'packaging' && (
                          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m7.5 4.27 9 5.15"/>
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                            <path d="m3.3 7 8.7 5 8.7-5"/>
                            <path d="M12 22V12"/>
                          </svg>
                        )}
                        {prog.iconType === 'video' && (
                          <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                            <rect x="2" y="6" width="14" height="12" rx="2"/>
                          </svg>
                        )}
                        {prog.iconType === 'gala' && (
                          <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                            <path d="M4 22h16"/>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                          </svg>
                        )}
                        {prog.iconType === 'cert' && (
                          <svg className="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                            <path d="m9 12 2 2 4-4"/>
                          </svg>
                        )}
                        {prog.iconType === 'music' && (
                          <svg className="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18V5l12-2v13"/>
                            <circle cx="6" cy="18" r="3"/>
                            <circle cx="18" cy="16" r="3"/>
                          </svg>
                        )}
                      </span>
                    </div>
                    <div className="deck-program-item-body">
                      <div className="deck-prog-title group-hover:text-rose-600 transition-colors">
                        {prog.title}
                      </div>
                      <div className="deck-prog-meta">
                        {prog.venue}
                      </div>
                    </div>
                    <div className="deck-program-arrow">
                      →
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Meta & Bio */}
            <div className="deck-intro-bottom">
              <nav className="deck-meta-tags" aria-label="Detail Penyelenggaraan">
                <span>27–28 NOVEMBER 2026</span>
                <span>•</span>
                <span>JALAN BRAGA</span>
                <span>•</span>
                <span>HOTEL PAPANDAYAN</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">DISDAGIN KOTA BANDUNG</span>
              </nav>

              <p className="deck-bio-copy">
                Eksplorasi 6 program unggulan festival industri kreatif Kota Bandung: panggung runway desainer binaan, penganugerahan malam gala kepatuhan SIINAS, kompetisi desain kemasan ramah lingkungan, lomba video vertikal Braga, hingga seremonial 100 sertifikasi halal dan uji mutu.
              </p>

              <div className="deck-scroll-hint">
                <svg className="w-4 h-4 animate-bounce text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M19 12l-7 7-7-7"/>
                </svg>
                <span className="font-semibold text-slate-700">
                  Scroll ke bawah untuk membuka tumpukan kartu program satu per satu ↓
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* ─── FLOATING DECK NAVIGATION HUD (Click & Scroll Synchronization) ─── */}
        <div className="deck-nav-hud" aria-label="Navigasi Kartu Program">
          <button
            type="button"
            onClick={() => scrollToCard(Math.max(0, activeCardIndex - 1))}
            disabled={activeCardIndex === 0}
            className="deck-hud-btn"
            title="Kartu Sebelumnya"
          >
            ← Prev
          </button>
          
          <div className="deck-hud-dots">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToCard(idx)}
                className={`deck-hud-dot ${activeCardIndex === idx ? 'active' : ''}`}
                title={`Buka Kartu ${idx === 0 ? 'Sampul' : idx}`}
              />
            ))}
          </div>

          <span className="deck-hud-label font-mono">
            {activeCardIndex === 0 ? '01 / 06' : `0${activeCardIndex + 1} / 06`}
          </span>

          <button
            type="button"
            onClick={() => scrollToCard(Math.min(5, activeCardIndex + 1))}
            disabled={activeCardIndex === 5}
            className="deck-hud-btn"
            title="Kartu Selanjutnya"
          >
            Next →
          </button>
        </div>

      </section>
    </div>
  );
}
