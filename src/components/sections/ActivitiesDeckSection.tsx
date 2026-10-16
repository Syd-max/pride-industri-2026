'use client';

import { useEffect, useRef } from 'react';
import './activities-deck.css';

export default function ActivitiesDeckSection() {
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const deckContainerRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    /* ==========================================================
       1. CHARACTER SCRAMBLE INTERACTION (MATCHING CIPHER EFFECT)
       ========================================================== */
    const heroNameEl = heroNameRef.current;
    const words = ['6', 'PROGRAM', 'UNGGULAN'];
    const cipherChars = '{[()]}/\\|<>?!#$%&*@+=~^0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charSpans: HTMLSpanElement[] = [];

    if (heroNameEl) {
      heroNameEl.innerHTML = '';
      words.forEach((word, wordIdx) => {
        const wordWrap = document.createElement('span');
        wordWrap.className = 'deck-word';
        word.split('').forEach((char) => {
          const span = document.createElement('span');
          span.className = 'deck-hero-char';
          span.textContent = char;
          span.dataset.original = char;
          wordWrap.appendChild(span);
          charSpans.push(span);
        });
        heroNameEl.appendChild(wordWrap);

        if (wordIdx < words.length - 1) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'deck-word-space';
          spaceSpan.innerHTML = '&nbsp;';
          heroNameEl.appendChild(spaceSpan);
        }
      });
    }

    function scrambleCharacter(span: HTMLSpanElement, duration = 360) {
      if (span.dataset.original === ' ') return;
      const anySpan = span as unknown as { scrambleTimer?: NodeJS.Timeout };
      if (anySpan.scrambleTimer) clearInterval(anySpan.scrambleTimer);

      const start = performance.now();
      anySpan.scrambleTimer = setInterval(() => {
        const elapsed = performance.now() - start;
        if (elapsed >= duration) {
          span.textContent = span.dataset.original || '';
          clearInterval(anySpan.scrambleTimer);
          anySpan.scrambleTimer = undefined;
        } else {
          span.textContent = cipherChars[Math.floor(Math.random() * cipherChars.length)];
        }
      }, 45);
    }

    charSpans.forEach((span, idx) => {
      const triggerScramble = () => {
        scrambleCharacter(span, 380);
        if (charSpans[idx + 1]) scrambleCharacter(charSpans[idx + 1], 320);
        if (charSpans[idx - 1]) scrambleCharacter(charSpans[idx - 1], 260);
      };
      span.addEventListener('pointerenter', triggerScramble);
      span.addEventListener('touchstart', triggerScramble, { passive: true });
    });

    /* ==========================================================
       2. PROCEDURAL 3D CANVAS ARTWORK RENDERERS (UNIFIED & HARMONIOUS)
       ========================================================== */
    function drawUnifiedCanvasBase(ctx: CanvasRenderingContext2D, w: number, h: number) {
      // 1. Unified Deep Midnight Obsidian Gradient
      const baseGrad = ctx.createLinearGradient(0, 0, w, h);
      baseGrad.addColorStop(0, '#070b14');
      baseGrad.addColorStop(0.5, '#0c1220');
      baseGrad.addColorStop(1, '#05070f');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Blueprint Architectural Perspective Grid
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

      // 3. Coordinate intersection markers
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

    // Canvas 1: FASHION SHOW RUNWAY (Royal Violet & Rose Couture Waves)
    function drawFashionArt() {
      const canvas = document.getElementById('canvasFashion') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Luminous couture ambient light orbs
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

      // Runway silhouette fabric lines
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.18)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 24; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.15 + i * 28, 0);
        ctx.bezierCurveTo(w * 0.45, h * 0.35, w * 0.35 + i * 16, h * 0.7, w * 0.85, h);
        ctx.stroke();
      }

      // Suspended fashion spheres
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

    // Canvas 2: LOMBA DESAIN KEMASAN (Emerald & Mint Eco-Blueprint Matrix)
    function drawPackagingArt() {
      const canvas = document.getElementById('canvasPackaging') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Emerald & mint ambient light orbs
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

      // 3D Isometric packaging wireframe boxes
      ctx.save();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.32)';
      ctx.lineWidth = 1.6;
      const boxes = [
        { cx: 940, cy: 360, size: 130 },
        { cx: 780, cy: 520, size: 95 }
      ];
      boxes.forEach((b) => {
        const s = b.size;
        // Top Face
        ctx.beginPath();
        ctx.moveTo(b.cx, b.cy - s * 0.6);
        ctx.lineTo(b.cx + s * 0.9, b.cy - s * 0.1);
        ctx.lineTo(b.cx, b.cy + s * 0.4);
        ctx.lineTo(b.cx - s * 0.9, b.cy - s * 0.1);
        ctx.closePath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.fill();
        ctx.stroke();
        // Verticals
        ctx.beginPath();
        ctx.moveTo(b.cx - s * 0.9, b.cy - s * 0.1); ctx.lineTo(b.cx - s * 0.9, b.cy + s * 0.6);
        ctx.moveTo(b.cx, b.cy + s * 0.4); ctx.lineTo(b.cx, b.cy + s * 1.1);
        ctx.moveTo(b.cx + s * 0.9, b.cy - s * 0.1); ctx.lineTo(b.cx + s * 0.9, b.cy + s * 0.6);
        ctx.stroke();
        // Bottom Face
        ctx.beginPath();
        ctx.moveTo(b.cx - s * 0.9, b.cy + s * 0.6);
        ctx.lineTo(b.cx, b.cy + s * 1.1);
        ctx.lineTo(b.cx + s * 0.9, b.cy + s * 0.6);
        ctx.stroke();
      });
      ctx.restore();

      // Technical blueprint dimension annotations
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('ECO-BOX · 300g · BIODEGRADABLE', 820, 240);
      ctx.fillText('STANDAR EKSPOR IKM · 100%', 820, 520);
    }

    // Canvas 3: LOMBA VIDEO 1 MENIT (Sunset Amber & Cinema Reel Light Ribbons)
    function drawVideoArt() {
      const canvas = document.getElementById('canvasVideo') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Sunset Amber & Warm Gold ambient light orbs
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

      // Flowing 60fps golden cinematic light ribbons
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

      // Vertical 9:16 Viewfinder reticle brackets
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
      ctx.lineWidth = 1.8;
      const vx = 860, vy = 280, vw = 200, vh = 280;
      // Top-left
      ctx.beginPath(); ctx.moveTo(vx, vy + 24); ctx.lineTo(vx, vy); ctx.lineTo(vx + 24, vy); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(vx + vw - 24, vy); ctx.lineTo(vx + vw, vy); ctx.lineTo(vx + vw, vy + 24); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(vx, vy + vh - 24); ctx.lineTo(vx, vy + vh); ctx.lineTo(vx + 24, vy + vh); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(vx + vw - 24, vy + vh); ctx.lineTo(vx + vw, vy + vh); ctx.lineTo(vx + vw, vy + vh - 24); ctx.stroke();

      // Rec Indicator
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(vx + 18, vy + 20, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('REC [●] 00:01:00 · 9:16 REELS', vx + 28, vy + 24);
      ctx.restore();
    }

    // Canvas 4: APRESIASI INDUSTRI SIINAS (Royal Champagne Gold & Bronze Architecture)
    function drawAwardsArt() {
      const canvas = document.getElementById('canvasAwards') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Royal Champagne Gold ambient light cone
      const tg = ctx.createRadialGradient(960, 420, 10, 960, 420, 380);
      tg.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
      tg.addColorStop(0.4, 'rgba(217, 119, 6, 0.18)');
      tg.addColorStop(1, 'rgba(7, 11, 20, 0)');
      ctx.fillStyle = tg;
      ctx.beginPath(); ctx.arc(960, 420, 380, 0, Math.PI * 2); ctx.fill();

      // Architectural fluted column beams
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

      // Laurel concentric rings
      for (let r = 40; r <= 200; r += 40) {
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.18)';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(960, 420, r, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('MALAM GALA ANUGERAH SIINAS · 200 IKM BINAAN', 780, 210);
    }

    // Canvas 5: SERTIFIKASI & LIVE ART (Electric Cyan & Neon Teal Acoustics)
    function drawMusicArt() {
      const canvas = document.getElementById('canvasMusic') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      drawUnifiedCanvasBase(ctx, w, h);

      // Cyan & teal ambient glow
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

      // Concentric acoustic sound wave ripples
      for (let r = 30; r < 360; r += 32) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(380, 440, r, 0, Math.PI * 2); ctx.stroke();
      }

      // Live Equalizer frequency spectrum bars
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

    // Render all canvases once mounted
    drawFashionArt();
    drawPackagingArt();
    drawVideoArt();
    drawAwardsArt();
    drawMusicArt();

    /* ==========================================================
       3. STACKED DECK SCROLL CHOREOGRAPHY (PEEL-DOWN ON SCROLL)
       ========================================================== */
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.activities-card'));
    cards.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));

    const totalCards = cards.length; // 6 cards (0..5)

    function clamp(val: number, min: number, max: number) {
      return Math.max(min, Math.min(max, val));
    }

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function updateDeck(scrollProgress: number) {
      const peelableCards = totalCards - 1;
      const stageProgress = scrollProgress * peelableCards;
      const isMobile = window.innerWidth <= 768;
      const PEEK_STEP_Y = isMobile ? 8 : 12;
      const SCALE_STEP = isMobile ? 0.016 : 0.022;

      cards.forEach((card, i) => {
        card.style.zIndex = String((totalCards - i) * 10);
        
        const isFinalCard = i === totalCards - 1;
        const depth = isFinalCard ? Math.max(0, i - stageProgress) : (i - stageProgress);

        if (depth < 0) {
          const peelAmount = clamp(-depth, 0, 1);
          const easedPeel = easeInOutCubic(peelAmount);
          const translateYPercent = easedPeel * 120;
          const opacity = Math.max(0, 1 - Math.pow(peelAmount, 1.8));

          card.style.transform = `translate3d(0, ${translateYPercent}%, 0) scale(1)`;
          card.style.opacity = opacity.toFixed(3);
          card.style.pointerEvents = peelAmount > 0.15 ? 'none' : 'auto';
          card.style.visibility = peelAmount >= 1 ? 'hidden' : 'visible';
        } else {
          const effectiveDepth = Math.min(depth, 3.8);
          const yOffset = -effectiveDepth * PEEK_STEP_Y;
          const scale = 1 - effectiveDepth * SCALE_STEP;

          card.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale.toFixed(4)})`;
          card.style.opacity = '1';
          card.style.visibility = 'visible';
          card.style.pointerEvents = depth < 0.35 ? 'auto' : 'none';
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

          {/* LAYER 5: SERTIFIKASI & LIVE ART (Backmost Card) */}
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

              {/* Center Description Box (Apple Style - No Button / No Bullet Clutter) */}
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

          {/* LAYER 4: MALAM GALA APRESIASI INDUSTRI (SIINAS) */}
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

              {/* Center Description Box (Apple Style - No Button / No Bullet Clutter) */}
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

          {/* LAYER 3: LOMBA VIDEO 1 MENIT BRAGA */}
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

              {/* Center Description Box (Apple Style - No Button / No Bullet Clutter) */}
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

          {/* LAYER 2: LOMBA DESAIN KEMASAN IKM */}
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

              {/* Center Description Box (Apple Style - No Button / No Bullet Clutter) */}
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

          {/* LAYER 1: FASHION SHOW RUNWAY */}
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

              {/* Center Description Box (Apple Style - No Button / No Bullet Clutter) */}
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

          {/* LAYER 0 (Frontmost): WHITE INTRO COVER CARD */}
          <section className="activities-card deck-intro-card" data-index="0">
            <div className="deck-intro-top">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 mb-3">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                  <span>Rangkaian Acara Festival</span>
                </div>
                <h2 className="deck-hero-name" id="heroName" ref={heroNameRef} aria-label="6 PROGRAM UNGGULAN">
                  6 PROGRAM UNGGULAN
                </h2>
              </div>
            </div>

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
                <svg className="w-4 h-4 animate-bounce text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M19 12l-7 7-7-7"/>
                </svg>
                <span>Scroll ke bawah untuk membuka tumpukan kartu program (1 per 1)</span>
              </div>
            </div>
          </section>

        </div>

      </section>
    </div>
  );
}
