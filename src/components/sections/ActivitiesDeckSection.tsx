'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import './activities-deck.css';

export default function ActivitiesDeckSection() {
  const scrollDriverRef = useRef<HTMLDivElement>(null);
  const deckContainerRef = useRef<HTMLDivElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const autoPlayBtnRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    /* ==========================================================
       1. CHARACTER SCRAMBLE INTERACTION (MATCHING ILIA DELIN CIPHER)
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
       2. PROCEDURAL 3D CANVAS ARTWORK RENDERERS
       ========================================================== */
    // Canvas 1: FASHION SHOW RUNWAY (Iridescent Cobalt & Violet Couture Waves)
    function drawFashionArt() {
      const canvas = document.getElementById('canvasFashion') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#111827');
      bg.addColorStop(0.5, '#1e1b4b');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Liquid couture silk folds
      const wavePositions = [
        { x: 920, y: 480, r: 440, c1: '#c084fc', c2: '#6366f1', c3: 'rgba(30,27,75,0)' },
        { x: 740, y: 240, r: 320, c1: '#f472b6', c2: '#818cf8', c3: 'rgba(15,23,42,0)' },
        { x: 1140, y: 680, r: 380, c1: '#38bdf8', c2: '#2563eb', c3: 'rgba(15,23,42,0)' }
      ];
      wavePositions.forEach((wp) => {
        const g = ctx.createRadialGradient(wp.x - 80, wp.y - 80, 20, wp.x, wp.y, wp.r);
        g.addColorStop(0, wp.c1);
        g.addColorStop(0.5, wp.c2);
        g.addColorStop(1, wp.c3);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, wp.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Runway silhouette fabric lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 28; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.15 + i * 25, 0);
        ctx.bezierCurveTo(w * 0.45, h * 0.35, w * 0.35 + i * 15, h * 0.7, w * 0.85, h);
        ctx.stroke();
      }

      // Suspended fashion spheres
      const spheres = [
        { x: 420, y: 240, r: 90, color: '#ec4899' },
        { x: 540, y: 380, r: 120, color: '#8b5cf6' },
        { x: 480, y: 560, r: 100, color: '#3b82f6' },
        { x: 380, y: 700, r: 80, color: '#06b6d4' }
      ];
      spheres.forEach((s) => {
        const sg = ctx.createRadialGradient(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.05, s.x, s.y, s.r);
        sg.addColorStop(0, '#ffffff');
        sg.addColorStop(0.4, s.color);
        sg.addColorStop(1, '#090d16');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Canvas 2: LOMBA DESAIN KEMASAN (Eco-Kraft & Sustainable Sage Matrix)
    function drawPackagingArt() {
      const canvas = document.getElementById('canvasPackaging') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#e2e8f0');
      bgGrad.addColorStop(0.35, '#dcfce7');
      bgGrad.addColorStop(0.7, '#86efac');
      bgGrad.addColorStop(1, '#15803d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Cyan-green vascular packaging grid
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.lineCap = 'round';
      for (let i = 0; i < 8; i++) {
        ctx.lineWidth = 20 - i * 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.2 + i * 50, -40);
        ctx.bezierCurveTo(w * 0.4, h * 0.35, w * 0.6 - i * 30, h * 0.65, w * 0.95, h + 40);
        ctx.stroke();
      }
      ctx.restore();

      // Eco geometric pattern circles
      const ecoPills = [
        { x: 300, y: 160, r: 130, c1: '#bbf7d0', c2: '#16a34a' },
        { x: 500, y: 120, r: 100, c1: '#fef08a', c2: '#ca8a04' },
        { x: 360, y: 740, r: 140, c1: '#86efac', c2: '#047857' },
        { x: 1050, y: 700, r: 125, c1: '#bbf7d0', c2: '#059669' }
      ];
      ecoPills.forEach((cl) => {
        for (let j = 0; j < 30; j++) {
          const ang = (j / 30) * Math.PI * 2;
          const dist = (j % 4) * (cl.r * 0.25);
          const bx = cl.x + Math.cos(ang) * dist;
          const by = cl.y + Math.sin(ang) * dist;
          const rad = 16 + (j % 3) * 8;
          const g = ctx.createRadialGradient(bx - 4, by - 4, 2, bx, by, rad);
          g.addColorStop(0, cl.c1);
          g.addColorStop(1, cl.c2);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(bx, by, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Technical blueprint bounding markers
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(260, 560, 160, 180);
      ctx.strokeRect(1020, 260, 120, 120);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('ECO-BOX · 300g', 265, 550);
      ctx.fillText('IKM SEAL · 100%', 1025, 250);
    }

    // Canvas 3: LOMBA VIDEO 1 MENIT (Cinematic Light Ribbons & Golden Reels)
    function drawVideoArt() {
      const canvas = document.getElementById('canvasVideo') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#450a0a');
      bg.addColorStop(0.45, '#991b1b');
      bg.addColorStop(0.8, '#ea580c');
      bg.addColorStop(1, '#facc15');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Flowing cinematic light splines
      const palette = ['#ff4444', '#f97316', '#fbbf24', '#fde047', '#dc2626', '#7f1d1d'];
      for (let i = 0; i < 360; i++) {
        ctx.strokeStyle = palette[i % palette.length];
        ctx.globalAlpha = 0.32 + (i % 5) * 0.12;
        ctx.lineWidth = 1.4 + (i % 4) * 1.3;
        const startX = (i * 18) % (w + 200) - 100;
        const startY = h + 50;
        const ctrlX1 = startX - 160 + Math.sin(i * 0.16) * 150;
        const ctrlY1 = h * 0.52;
        const ctrlX2 = startX + 110 + Math.cos(i * 0.11) * 180;
        const ctrlY2 = h * 0.24;
        const endX = startX + Math.sin(i * 0.08) * 260;
        const endY = -50;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Canvas 4: APRESIASI INDUSTRI SIINAS (Opulent Fluted Sandstone & Crimson Glass Slab)
    function drawAwardsArt() {
      const canvas = document.getElementById('canvasAwards') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      // Warm fluted sandstone ribs
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 0, w, h);

      const ribCount = 42;
      for (let i = -8; i < ribCount; i++) {
        const x = i * 40;
        const grad = ctx.createLinearGradient(x, 0, x + 40, 140);
        grad.addColorStop(0, '#78350f');
        grad.addColorStop(0.3, '#d97706');
        grad.addColorStop(0.65, '#fde68a');
        grad.addColorStop(1, '#92400e');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 44, 0);
        ctx.lineTo(x - 170, h);
        ctx.lineTo(x - 214, h);
        ctx.closePath();
        ctx.fill();
      }

      // Diagonal crimson glass slab
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-60, 100);
      ctx.lineTo(340, -80);
      ctx.lineTo(w + 140, h - 30);
      ctx.lineTo(w - 400, h + 130);
      ctx.closePath();

      const redGlass = ctx.createLinearGradient(0, 0, w, h);
      redGlass.addColorStop(0, 'rgba(185, 28, 28, 0.94)');
      redGlass.addColorStop(0.5, 'rgba(239, 68, 68, 0.88)');
      redGlass.addColorStop(1, 'rgba(153, 27, 27, 0.96)');
      ctx.fillStyle = redGlass;
      ctx.fill();

      // Specular rim
      ctx.strokeStyle = 'rgba(254, 202, 202, 0.85)';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();
    }

    // Canvas 5: SERTIFIKASI & LIVE ART (Vivid Teal Acoustic Waves & Electronic Beat)
    function drawMusicArt() {
      const canvas = document.getElementById('canvasMusic') as HTMLCanvasElement;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = canvas.width, h = canvas.height;

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#042f2e');
      bg.addColorStop(0.5, '#0f766e');
      bg.addColorStop(1, '#115e59');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Acoustic ripple concentric rings
      const centers = [
        { x: 380, y: 450, maxR: 420, color: 'rgba(45, 212, 191, 0.35)' },
        { x: 980, y: 380, maxR: 380, color: 'rgba(56, 189, 248, 0.35)' }
      ];

      centers.forEach((c) => {
        for (let r = 20; r < c.maxR; r += 26) {
          ctx.strokeStyle = c.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // DJ electronic frequency wave bars
      const barCount = 48;
      const startX = w * 0.15;
      const barWidth = (w * 0.7) / barCount;
      for (let i = 0; i < barCount; i++) {
        const barH = 50 + Math.sin(i * 0.35) * 140 + Math.cos(i * 0.6) * 60;
        const x = startX + i * barWidth;
        const y = h * 0.5 - barH / 2;

        const g = ctx.createLinearGradient(x, y, x, y + barH);
        g.addColorStop(0, '#2dd4bf');
        g.addColorStop(0.5, '#38bdf8');
        g.addColorStop(1, '#a855f7');

        ctx.fillStyle = g;
        ctx.fillRect(x + 2, y, barWidth - 4, barH);
      }
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
      // Maps scrollProgress across card peel stages
      const stageProgress = scrollProgress * (totalCards - 0.4);
      const isMobile = window.innerWidth <= 768;
      const PEEK_STEP_Y = isMobile ? 8 : 12;
      const SCALE_STEP = isMobile ? 0.016 : 0.022;

      cards.forEach((card, i) => {
        // Set z-index: Card 0 is top (60), Card 5 is back (10)
        card.style.zIndex = String((totalCards - i) * 10);
        const depth = i - stageProgress;

        if (depth < 0) {
          // Card peeling down
          const peelAmount = clamp(-depth, 0, 1);
          const easedPeel = easeInOutCubic(peelAmount);
          const translateYPercent = easedPeel * 115;
          card.style.transform = `translate3d(0, ${translateYPercent}%, 0) scale(1)`;
          card.style.pointerEvents = peelAmount > 0.15 ? 'none' : 'auto';
          card.style.opacity = String(1 - peelAmount * 0.18);
        } else {
          // Card resting in stack: cap effectiveDepth at 3.8 to prevent excessive upward reach
          const effectiveDepth = Math.min(depth, 3.8);
          const yOffset = -effectiveDepth * PEEK_STEP_Y;
          const scale = 1 - effectiveDepth * SCALE_STEP;

          card.style.transform = `translate3d(0, ${yOffset}px, 0) scale(${scale.toFixed(4)})`;
          card.style.pointerEvents = depth < 0.35 ? 'auto' : 'none';
          card.style.opacity = '1';
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

  // 4. AUTO-PLAY VIDEO SEQUENCE (Tour feature from Ilia Delin reference)
  const toggleAutoPlay = () => {
    const driver = scrollDriverRef.current;
    if (!driver) return;

    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const startY = window.scrollY;
    const rect = driver.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top;
    const totalDist = driver.offsetHeight - window.innerHeight;
    const startTime = performance.now();
    const duration = 12000; // 12 seconds full tour

    function step(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      let p = 0;
      if (t < 0.4) {
        // Peel all down
        p = t / 0.4;
      } else if (t < 0.55) {
        // Hold on end screen
        p = 1;
      } else if (t < 0.95) {
        // Unpeel back up
        p = 1 - (t - 0.55) / 0.4;
      } else {
        p = 0;
      }

      window.scrollTo(0, targetTop + p * totalDist);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        setIsPlaying(false);
      }
    }

    requestAnimationFrame(step);
  };

  return (
    <div className="activities-scroll-driver" id="programUnggulan" ref={scrollDriverRef}>
      <section className="activities-stage" aria-label="6 Program Unggulan PRIDE 2026">
        
        {/* Base Layer: Revealed when all 6 cards peel down */}
        <div className="activities-end-screen">
          <div className="end-screen-pill">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Semua Program Ditampilkan</span>
          </div>
          <h3 className="end-screen-title">
            Siap Menjadi Bagian Dari Kebangkitan Industri Bandung?
          </h3>
          <p className="end-screen-meta">
            27–28 NOVEMBER 2026 · KORIDOR BRAGA &amp; HOTEL PAPANDAYAN
          </p>
          <a href="#agenda" className="end-screen-cta">
            <span>Lihat Jadwal &amp; Rangkaian Acara Lengkap ↓</span>
          </a>
        </div>

        {/* 6-Card Stack Deck Container */}
        <div className="activities-deck-container" ref={deckContainerRef}>

          {/* LAYER 5: SERTIFIKASI & LIVE ART (Backmost Card) */}
          <article className="activities-card deck-project-card" data-index="5">
            <canvas className="deck-project-canvas" id="canvasMusic" width="1400" height="900" />
            <div className="deck-project-overlay">
              <div className="deck-project-header">
                <div className="deck-info-pill">
                  <span className="deck-project-title">SERTIFIKASI &amp; LIVE ART</span>
                  <span className="deck-project-subtitle">100 HALAL · 3 SNI · LIVE PERCUSSION &amp; DJ</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">FASILITASI GRATIS</span>
                  <span className="deck-tag-pill">STANDAR MUTU</span>
                  <span className="deck-tag-pill">PANGGUNG SENI</span>
                </div>
              </div>

              <a href="#agenda" className="deck-view-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span>LIHAT AGENDA PANGGUNG</span>
              </a>

              <div className="deck-caption-bar">
                Seremonial penyerahan 100 Sertifikat Halal, 3 SNI, dan 100 Uji Mutu IKM dipadu beat dinamis perkusi &amp; DJ kontemporer di Main Stage Braga City Walk.
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
                  <span className="deck-project-subtitle">28 NOV 2026 · BALLROOM HOTEL PAPANDAYAN</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">MALAM ANUGERAH</span>
                  <span className="deck-tag-pill">KEPATUHAN SIINAS</span>
                  <span className="deck-tag-pill">200 IKM BINAAN</span>
                </div>
              </div>

              <a href="#agenda" className="deck-view-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
                <span>DETAIL MALAM GALA</span>
              </a>

              <div className="deck-caption-bar">
                Penganugerahan malam gala kehormatan kepatuhan pelaporan SIINAS bagi 200 pelaku industri berprestasi, juri, dan tamu kehormatan di Ballroom Papandayan.
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
                  <span className="deck-project-subtitle">REELS &amp; TIKTOK COMPETITION · TOTAL HADIAH RATUSAN JUTA</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">VIDEO VERTIKAL</span>
                  <span className="deck-tag-pill">CERITA LOKAL</span>
                  <span className="deck-tag-pill">KREATIF BRAGA</span>
                </div>
              </div>

              <Link href="/competition/video-lokal" className="deck-view-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span>DAFTAR LOMBA VIDEO</span>
              </Link>

              <div className="deck-caption-bar">
                Kompetisi video vertikal kreatif bertema &quot;Karya Lokal, Cerita Lokal&quot; menangkap dinamika, keindahan, dan kebangkitan industri kreatif koridor Braga.
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
                  <span className="deck-project-subtitle">TOTAL HADIAH RP 30.000.000 · 100% GRATIS</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">ECO-PACKAGING</span>
                  <span className="deck-tag-pill">KULINER LOKAL</span>
                  <span className="deck-tag-pill">KEMASAN EKSPOR</span>
                </div>
              </div>

              <Link href="/competition/desain-kemasan" className="deck-view-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <span>DAFTAR LOMBA KEMASAN</span>
              </Link>

              <div className="deck-caption-bar">
                Inovasi kemasan ramah lingkungan produk kuliner dan olahan pangan lokal binaan Bandung untuk menembus pasar ritel modern dan ekspor.
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
                  <span className="deck-project-subtitle">27 NOV 2026 · MAIN STAGE BRAGA CITY WALK</span>
                </div>
                <div className="deck-project-tags">
                  <span className="deck-tag-pill">DESAINER BINAAN</span>
                  <span className="deck-tag-pill">READY-TO-WEAR</span>
                  <span className="deck-tag-pill">WASTRA BANDUNG</span>
                </div>
              </div>

              <a href="#agenda" className="deck-view-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                </svg>
                <span>LIHAT DETAIL FASHION</span>
              </a>

              <div className="deck-caption-bar">
                Peragaan busana ready-to-wear kontemporer karya puluhan desainer fesyen binaan Disdagin Kota Bandung dengan tata panggung runway berstandar internasional.
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
              <div className="deck-intro-actions">
                <Link href="/competition/desain-kemasan" className="deck-btn-pill deck-btn-dark">
                  <span>DAFTAR LOMBA</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
                <a href="/syarat-desain-kemasan.pdf" download className="deck-btn-pill deck-btn-gray">
                  <span>PANDUAN PDF</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </a>
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

        {/* Floating Auto-Play HUD Controller */}
        <div className="deck-hud">
          <button ref={autoPlayBtnRef} onClick={toggleAutoPlay}>
            {isPlaying ? '⏸ Jeda Tur' : '▶ Putar Tur Rangkaian'}
          </button>
          <span className="hidden sm:inline">atau scroll naik / turun</span>
        </div>

      </section>
    </div>
  );
}
