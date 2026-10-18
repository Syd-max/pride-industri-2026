'use client';

import { useEffect, useRef } from 'react';
import { EVENT_CONFIG } from '@/config/event';
import './gooey-pixel-countdown.css';

/* ============================================================
   5x7 BITMAP FONT GLYPHS (Derived from Reference 2 Implementation)
   ============================================================ */
const GLYPHS: Record<string, string[]> = {
  '0': [
    "01110",
    "10001",
    "10011",
    "10101",
    "11001",
    "10001",
    "01110"
  ],
  '1': [
    "00100",
    "01100",
    "00100",
    "00100",
    "00100",
    "00100",
    "01110"
  ],
  '2': [
    "01110",
    "10001",
    "00001",
    "00110",
    "01000",
    "10000",
    "11111"
  ],
  '3': [
    "11110",
    "00001",
    "00001",
    "01110",
    "00001",
    "10001",
    "01110"
  ],
  '4': [
    "00010",
    "00110",
    "01010",
    "10010",
    "11111",
    "00010",
    "00010"
  ],
  '5': [
    "11111",
    "10000",
    "11110",
    "00001",
    "00001",
    "10001",
    "01110"
  ],
  '6': [
    "01110",
    "10000",
    "10000",
    "11110",
    "10001",
    "10001",
    "01110"
  ],
  '7': [
    "11111",
    "00001",
    "00010",
    "00100",
    "01000",
    "01000",
    "01000"
  ],
  '8': [
    "01110",
    "10001",
    "10001",
    "01110",
    "10001",
    "10001",
    "01110"
  ],
  '9': [
    "01110",
    "10001",
    "10001",
    "01111",
    "00001",
    "00001",
    "01110"
  ],
  ':': [
    "000",
    "010",
    "000",
    "000",
    "010",
    "000",
    "000"
  ]
};

// Scrambling frame sequences for visual initialization
const SCRAMBLE_FRAMES: Record<string, string[]> = {
  hari: ['88', '42', '69', '15', '38'],
  jam: ['74', '21', '85', '09', '18'],
  menit: ['53', '96', '32', '71', '44'],
  detik: ['29', '64', '80', '17', '52'],
};

/* ============================================================
   LIVE COUNTDOWN TIME UTILITY
   ============================================================ */
interface LiveCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: {
    hari: string;
    jam: string;
    menit: string;
    detik: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  state: 'upcoming' | 'live' | 'ended';
}

function calculateCountdown(): LiveCountdown {
  const now = new Date();
  const start = EVENT_CONFIG.startDate;
  const end = EVENT_CONFIG.endDate;

  if (now >= end) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: {
        hari: '00',
        jam: '00',
        menit: '00',
        detik: '00',
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
      },
      state: 'ended',
    };
  }

  if (now >= start) {
    const diff = Math.max(0, end.getTime() - now.getTime());
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1_000);
    const fd = String(d).padStart(2, '0');
    const fh = String(h).padStart(2, '0');
    const fm = String(m).padStart(2, '0');
    const fs = String(s).padStart(2, '0');
    return {
      days: d,
      hours: h,
      minutes: m,
      seconds: s,
      formatted: {
        hari: fd,
        jam: fh,
        menit: fm,
        detik: fs,
        days: fd,
        hours: fh,
        minutes: fm,
        seconds: fs,
      },
      state: 'live',
    };
  }

  const diff = Math.max(0, start.getTime() - now.getTime());
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  const fd = String(d).padStart(2, '0');
  const fh = String(h).padStart(2, '0');
  const fm = String(m).padStart(2, '0');
  const fs = String(s).padStart(2, '0');
  return {
    days: d,
    hours: h,
    minutes: m,
    seconds: s,
    formatted: {
      hari: fd,
      jam: fh,
      menit: fm,
      detik: fs,
      days: fd,
      hours: fh,
      minutes: fm,
      seconds: fs,
    },
    state: 'upcoming',
  };
}

/* ============================================================
   EDITORIAL SVG ICONS (Calendar, Clock, Hourglass, Sparkle)
   ============================================================ */
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

/* ============================================================
   MAIN COMPONENT: GooeyPixelCountdownSection
   ============================================================ */
export default function GooeyPixelCountdownSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillTextRef = useRef<HTMLSpanElement>(null);
  const ambientBlob1Ref = useRef<HTMLDivElement>(null);
  const ambientBlob2Ref = useRef<HTMLDivElement>(null);

  // Gooey scenes refs
  const scene1Ref = useRef<HTMLDivElement>(null);
  const scene2Ref = useRef<HTMLDivElement>(null);

  // Pixel countdown container ref
  const pixelWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Math & Easing Utilities
    function clamp(val: number, min: number, max: number): number {
      return Math.max(min, Math.min(max, val));
    }

    function mapRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
      const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
      return outMin + t * (outMax - outMin);
    }

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function easeInCubic(t: number): number {
      return t * t * t;
    }

    // Cache Gooey sub-elements for 60fps performance
    function getSceneData(sceneEl: HTMLElement | null) {
      if (!sceneEl) return null;
      return {
        el: sceneEl,
        mainRects: Array.from(sceneEl.querySelectorAll<HTMLElement>('.main-rect')),
        satRects: {
          top1: sceneEl.querySelector<HTMLElement>('[data-sat="top1"]'),
          top2: sceneEl.querySelector<HTMLElement>('[data-sat="top2"]'),
          left: sceneEl.querySelector<HTMLElement>('[data-sat="left"]'),
          right: sceneEl.querySelector<HTMLElement>('[data-sat="right"]'),
          bottom: sceneEl.querySelector<HTMLElement>('[data-sat="bottom"]')
        },
        textRows: Array.from(sceneEl.querySelectorAll<HTMLElement>('.goo-text-row'))
      };
    }

    const scene1Data = getSceneData(scene1Ref.current);
    const scene2Data = getSceneData(scene2Ref.current);

    /* Render cluster offsets (Reference 1 Physics) */
    function renderSceneCluster(
      sceneObj: ReturnType<typeof getSceneData>,
      visible: boolean,
      entrySpread: number,
      exitSpread: number
    ) {
      if (!sceneObj) return;
      if (!visible) {
        sceneObj.el.classList.remove('visible');
        return;
      }
      sceneObj.el.classList.add('visible');

      const s = entrySpread;
      const e = exitSpread;

      const rowOffsets = [
        { x: -35 * s - 45 * e, y: -42 * s - 130 * e },
        { x: 110 * s - 160 * e, y: 18 * s - 55 * e },
        { x: 240 * s + 95 * e, y: 38 * s + 30 * e },
        { x: 90 * s - 70 * e, y: 105 * s + 110 * e },
      ];

      sceneObj.mainRects.forEach((rect, idx) => {
        const off = rowOffsets[idx];
        if (off) {
          rect.style.transform = `translate3d(${off.x.toFixed(1)}px, ${off.y.toFixed(1)}px, 0)`;
        }
      });

      sceneObj.textRows.forEach((txt, idx) => {
        const off = rowOffsets[idx];
        if (off) {
          txt.style.transform = `translate3d(${off.x.toFixed(1)}px, ${off.y.toFixed(1)}px, 0)`;
        }
      });

      const totalSpread = clamp(s + e * 1.15, 0, 1.4);
      if (sceneObj.satRects.top1) {
        sceneObj.satRects.top1.style.transform = `translate3d(${(-40 * totalSpread).toFixed(1)}px, ${(-125 * totalSpread).toFixed(1)}px, 0)`;
      }
      if (sceneObj.satRects.top2) {
        sceneObj.satRects.top2.style.transform = `translate3d(${(85 * totalSpread).toFixed(1)}px, ${(-70 * totalSpread).toFixed(1)}px, 0)`;
      }
      if (sceneObj.satRects.left) {
        sceneObj.satRects.left.style.transform = `translate3d(${(-230 * totalSpread).toFixed(1)}px, ${(24 * totalSpread).toFixed(1)}px, 0)`;
      }
      if (sceneObj.satRects.right) {
        sceneObj.satRects.right.style.transform = `translate3d(${(270 * totalSpread).toFixed(1)}px, ${(18 * totalSpread).toFixed(1)}px, 0)`;
      }
      if (sceneObj.satRects.bottom) {
        sceneObj.satRects.bottom.style.transform = `translate3d(${(-25 * totalSpread).toFixed(1)}px, ${(120 * totalSpread).toFixed(1)}px, 0)`;
      }
    }

    /* Cache Dot-Matrix DOM structure */
    type DotRef = { el: HTMLElement; r: number; c: number };
    type MetricData = {
      key: 'hari' | 'jam' | 'menit' | 'detik';
      charGrids: { dots: DotRef[] }[];
    };

    const metricsKeys: ('hari' | 'jam' | 'menit' | 'detik')[] = ['hari', 'jam', 'menit', 'detik'];
    const metricsMap: Record<'hari' | 'jam' | 'menit' | 'detik', MetricData> = {
      hari: { key: 'hari', charGrids: [] },
      jam: { key: 'jam', charGrids: [] },
      menit: { key: 'menit', charGrids: [] },
      detik: { key: 'detik', charGrids: [] },
    };

    if (pixelWrapperRef.current) {
      metricsKeys.forEach((key) => {
        const cell = pixelWrapperRef.current?.querySelector(`[data-metric="${key}"]`);
        if (!cell) return;
        const charEls = Array.from(cell.querySelectorAll<HTMLElement>('.matrix-char'));
        metricsMap[key].charGrids = charEls.map((charEl) => {
          const dots = Array.from(charEl.querySelectorAll<HTMLElement>('.pixel-dot')).map((dotEl) => ({
            el: dotEl,
            r: Number(dotEl.getAttribute('data-r')),
            c: Number(dotEl.getAttribute('data-c')),
          }));
          return { dots };
        });
      });
    }

    // Render word to matrix dots (Reference 2 Engine)
    function renderWordToGrid(
      metricKey: 'hari' | 'jam' | 'menit' | 'detik',
      wordStr: string,
      mode: 'final' | 'scramble' | 'fragment'
    ) {
      const metric = metricsMap[metricKey];
      if (!metric) return;
      const chars = wordStr.split('');

      metric.charGrids.forEach((grid, idx) => {
        const targetChar = chars[idx] || '0';
        const bitmap = GLYPHS[targetChar] || GLYPHS['0'];

        grid.dots.forEach(({ el, r, c }) => {
          const shouldBeOn = bitmap[r] && bitmap[r][c] === '1';

          if (mode === 'final') {
            el.className = shouldBeOn ? 'pixel-dot on' : 'pixel-dot';
          } else if (mode === 'scramble') {
            el.className = shouldBeOn ? 'pixel-dot scrambling' : 'pixel-dot';
          } else if (mode === 'fragment') {
            const jitter = Math.random();
            if (shouldBeOn && jitter > 0.25) {
              el.className = 'pixel-dot on';
            } else if (!shouldBeOn && jitter > 0.82) {
              el.className = 'pixel-dot scrambling';
            } else {
              el.className = 'pixel-dot';
            }
          }
        });
      });
    }

    // Live countdown state
    let liveData = calculateCountdown();

    function updateLiveCountdown() {
      liveData = calculateCountdown();
    }

    // Render all 4 metrics to grid with a given mode
    function updateAllMatrixGrids(mode: 'final' | 'scramble' | 'fragment', scrambleIndex = 0) {
      if (mode === 'final') {
        renderWordToGrid('hari', liveData.formatted.days, 'final');
        renderWordToGrid('jam', liveData.formatted.hours, 'final');
        renderWordToGrid('menit', liveData.formatted.minutes, 'final');
        renderWordToGrid('detik', liveData.formatted.seconds, 'final');
      } else if (mode === 'scramble') {
        metricsKeys.forEach((k) => {
          const frames = SCRAMBLE_FRAMES[k];
          const frameWord = frames[scrambleIndex % frames.length];
          renderWordToGrid(k, frameWord, 'scramble');
        });
      } else if (mode === 'fragment') {
        metricsKeys.forEach((k) => {
          renderWordToGrid(k, liveData.formatted[k], 'fragment');
        });
      }
    }

    // Continuous 1-second live countdown ticker
    let countdownIntervalId: NodeJS.Timeout | null = null;
    let isCountdownActive = false;

    function startLiveTicker() {
      if (!countdownIntervalId) {
        updateLiveCountdown();
        updateAllMatrixGrids('final');
        countdownIntervalId = setInterval(() => {
          updateLiveCountdown();
          if (isCountdownActive) {
            updateAllMatrixGrids('final');
          }
        }, 1000);
      }
    }

    function stopLiveTicker() {
      if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
        countdownIntervalId = null;
      }
    }

    // Calculate scroll progress within gooey-pixel-stage (p = 0.0 to 1.0)
    function getScrollProgress(): number {
      const stage = stageRef.current;
      if (!stage) return 0;
      const rect = stage.getBoundingClientRect();
      const scrollDistance = stage.offsetHeight - window.innerHeight;
      if (scrollDistance <= 0) return 0;
      const currentScroll = -rect.top;
      return clamp(currentScroll / scrollDistance, 0, 1);
    }

    // Master Timeline Choreography
    function updateTimeline(p: number) {
      // 1. Ambient Blob Movement
      if (ambientBlob1Ref.current) {
        const x = -50 + p * 25;
        const y = -50 - p * 20;
        ambientBlob1Ref.current.style.transform = `translate3d(${x.toFixed(1)}%, ${y.toFixed(1)}%, 0)`;
      }
      if (ambientBlob2Ref.current) {
        const x = 50 - p * 25;
        const y = 50 + p * 20;
        ambientBlob2Ref.current.style.transform = `translate3d(${x.toFixed(1)}%, ${y.toFixed(1)}%, 0)`;
      }

      // 2. Top Pill Context Text
      if (pillTextRef.current) {
        if (p < 0.32) {
          pillTextRef.current.textContent = 'PRIDE INDUSTRI 2026 · KARYA LOKAL';
        } else if (p < 0.60) {
          pillTextRef.current.textContent = 'KREATIVITAS KOTA BANDUNG · 27–28 NOV';
        } else {
          pillTextRef.current.textContent = 'FESTIVAL COUNTDOWN · BRAGA 2026';
        }
      }

      // 3. Scene 1 Choreography (p = 0.00 -> 0.38)
      if (p < 0.38) {
        const entry = 1 - easeOutCubic(mapRange(p, 0.02, 0.16, 0, 1));
        const exit = easeInCubic(mapRange(p, 0.26, 0.38, 0, 1));
        renderSceneCluster(scene1Data, true, entry, exit);
      } else {
        renderSceneCluster(scene1Data, false, 1, 0);
      }

      // 4. Scene 2 Choreography (p = 0.34 -> 0.62)
      if (p >= 0.34 && p < 0.62) {
        const entry = 1 - easeOutCubic(mapRange(p, 0.36, 0.46, 0, 1));
        const exit = easeInCubic(mapRange(p, 0.52, 0.62, 0, 1));
        renderSceneCluster(scene2Data, true, entry, exit);
      } else {
        renderSceneCluster(scene2Data, false, 1, 0);
      }

      // 5. Scene 3 & 4: Pixel Countdown Choreography (p = 0.56 -> 1.00)
      const pixelWrap = pixelWrapperRef.current;
      if (pixelWrap) {
        if (p >= 0.56) {
          const wrapOpacity = mapRange(p, 0.56, 0.66, 0, 1);
          const wrapY = mapRange(p, 0.56, 0.66, 40, 0);
          pixelWrap.style.opacity = String(wrapOpacity);
          pixelWrap.style.transform = `translate3d(0, ${wrapY.toFixed(1)}px, 0)`;
          pixelWrap.classList.add('visible');

          if (p < 0.70) {
            // Rapid Scrambling Phase (0.58 -> 0.70)
            isCountdownActive = false;
            const scrambleStep = Math.floor(mapRange(p, 0.58, 0.70, 0, 12));
            updateAllMatrixGrids('scramble', scrambleStep);
          } else if (p < 0.76) {
            // Fragmented Settling Phase (0.70 -> 0.76)
            isCountdownActive = false;
            updateAllMatrixGrids('fragment');
          } else {
            // Final Assembled Real Countdown Phase (0.76 -> 1.00)
            isCountdownActive = true;
            updateLiveCountdown();
            updateAllMatrixGrids('final');
          }
        } else {
          pixelWrap.classList.remove('visible');
          pixelWrap.style.opacity = '0';
          pixelWrap.style.transform = 'translate3d(0, 40px, 0)';
          isCountdownActive = false;
        }
      }
    }

    // High-performance RAF Scroll Scheduler
    let rafId: number | null = null;
    let isStageInView = false;

    const observer = new IntersectionObserver(
      (entries) => {
        isStageInView = entries[0].isIntersecting;
        if (isStageInView) {
          startLiveTicker();
          updateTimeline(getScrollProgress());
        } else {
          stopLiveTicker();
        }
      },
      { threshold: 0 }
    );

    if (stageRef.current) {
      observer.observe(stageRef.current);
    }

    const handleScroll = () => {
      if (!isStageInView) return;
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

    // Tab visibility handling (prevents drift when switching browser tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateLiveCountdown();
        if (isStageInView) {
          startLiveTicker();
          updateTimeline(getScrollProgress());
        }
      } else {
        stopLiveTicker();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial pass
    startLiveTicker();
    updateTimeline(getScrollProgress());

    return () => {
      stopLiveTicker();
      if (rafId !== null) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Pre-generate dot matrix cells for clean DOM rendering
  const matrixSpecs = [
    {
      key: 'hari' as const,
      title: 'Hari',
      sub: 'Menuju Acara',
      icon: <CalendarIcon />,
      charCount: 2,
      className: 'cell-hari'
    },
    {
      key: 'jam' as const,
      title: 'Jam',
      sub: 'Waktu WIB',
      icon: <ClockIcon />,
      charCount: 2,
      className: 'cell-jam'
    },
    {
      key: 'menit' as const,
      title: 'Menit',
      sub: 'Presisi',
      icon: <HourglassIcon />,
      charCount: 2,
      className: 'cell-menit'
    },
    {
      key: 'detik' as const,
      title: 'Detik',
      sub: 'Real-Time',
      icon: <SparkleIcon />,
      charCount: 2,
      className: 'cell-detik'
    }
  ];

  return (
    <div className="gooey-pixel-stage" id="gooeyPixelStage" ref={stageRef}>
      {/* Hidden SVG Definitions for Liquid Gooey Filter */}
      <svg className="pride-svg-defs" aria-hidden="true">
        <defs>
          <filter id="pride-liquid-goo" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="11" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 26 -11"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Sticky Viewport */}
      <div className="gooey-pixel-viewport">
        {/* Ambient Backlight Mesh */}
        <div className="gooey-ambient-mesh">
          <div className="gooey-ambient-blob-1" ref={ambientBlob1Ref} />
          <div className="gooey-ambient-blob-2" ref={ambientBlob2Ref} />
          <div className="gooey-grid-overlay" />
        </div>

        {/* Top Floating Context Pill */}
        <div className="scene-top-pill" ref={pillRef}>
          <span className="status-indicator" />
          <span ref={pillTextRef}>PRIDE INDUSTRI 2026 · KARYA LOKAL</span>
        </div>

        {/* ── GOOEY TYPOGRAPHY STAGE (Scenes 1 & 2) ── */}
        <div className="gooey-stage-wrapper">
          {/* Scene 1: KARYA LOKAL / IKM KOTA / BANDUNG / INOVASI NYATA */}
          <div className="gooey-scene gooey-scene-1" ref={scene1Ref}>
            <div className="cluster-anchor">
              <div className="goo-layer">
                {/* 4 Main Blobs */}
                <div className="goo-rect main-rect" data-row="0" style={{ left: '48px', top: '0px', width: '440px', height: '78px' }} />
                <div className="goo-rect main-rect" data-row="1" style={{ left: '0px', top: '72px', width: '330px', height: '78px' }} />
                <div className="goo-rect main-rect" data-row="2" style={{ left: '0px', top: '144px', width: '340px', height: '78px' }} />
                <div className="goo-rect main-rect" data-row="3" style={{ left: '0px', top: '216px', width: '500px', height: '78px' }} />

                {/* 5 Satellite Blobs */}
                <div className="goo-rect sat-rect" data-sat="top1" style={{ left: '20px', top: '0px', width: '320px', height: '68px' }} />
                <div className="goo-rect sat-rect" data-sat="top2" style={{ left: '110px', top: '0px', width: '340px', height: '64px' }} />
                <div className="goo-rect sat-rect" data-sat="left" style={{ left: '0px', top: '76px', width: '210px', height: '66px' }} />
                <div className="goo-rect sat-rect" data-sat="right" style={{ left: '180px', top: '150px', width: '260px', height: '66px' }} />
                <div className="goo-rect sat-rect" data-sat="bottom" style={{ left: '10px', top: '220px', width: '370px', height: '72px' }} />
              </div>

              <div className="text-layer">
                <div className="goo-text-row" data-row="0" style={{ left: '68px', top: '12px' }}>KARYA LOKAL</div>
                <div className="goo-text-row" data-row="1" style={{ left: '20px', top: '84px' }}>IKM KOTA</div>
                <div className="goo-text-row" data-row="2" style={{ left: '20px', top: '156px' }}>BANDUNG</div>
                <div className="goo-text-row" data-row="3" style={{ left: '20px', top: '228px' }}>INOVASI NYATA</div>
              </div>
            </div>
          </div>

          {/* Scene 2: THE NEXT / CREATIVE CHAPTER / FESYEN & KULINER / 27–28 NOV 2026 */}
          <div className="gooey-scene gooey-scene-2" ref={scene2Ref}>
            <div className="cluster-anchor">
              <div className="goo-layer">
                {/* 4 Main Blobs */}
                <div className="goo-rect main-rect" data-row="0" style={{ left: '48px', top: '0px', width: '350px', height: '78px' }} />
                <div className="goo-rect main-rect" data-row="1" style={{ left: '0px', top: '72px', width: '620px', height: '78px' }} />
                <div className="goo-rect main-rect" data-row="2" style={{ left: '0px', top: '144px', width: '610px', height: '78px' }} />
                <div className="goo-rect main-rect" data-row="3" style={{ left: '0px', top: '216px', width: '550px', height: '78px' }} />

                {/* 5 Satellite Blobs */}
                <div className="goo-rect sat-rect" data-sat="top1" style={{ left: '20px', top: '0px', width: '300px', height: '68px' }} />
                <div className="goo-rect sat-rect" data-sat="top2" style={{ left: '120px', top: '0px', width: '360px', height: '64px' }} />
                <div className="goo-rect sat-rect" data-sat="left" style={{ left: '0px', top: '76px', width: '220px', height: '66px' }} />
                <div className="goo-rect sat-rect" data-sat="right" style={{ left: '220px', top: '150px', width: '300px', height: '66px' }} />
                <div className="goo-rect sat-rect" data-sat="bottom" style={{ left: '10px', top: '220px', width: '380px', height: '72px' }} />
              </div>

              <div className="text-layer">
                <div className="goo-text-row" data-row="0" style={{ left: '68px', top: '12px' }}>THE NEXT</div>
                <div className="goo-text-row" data-row="1" style={{ left: '20px', top: '84px' }}>CREATIVE CHAPTER</div>
                <div className="goo-text-row" data-row="2" style={{ left: '20px', top: '156px' }}>FESYEN &amp; KULINER</div>
                <div className="goo-text-row" data-row="3" style={{ left: '20px', top: '228px' }}>27–28 NOV 2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── DOT-MATRIX PIXEL COUNTDOWN (Scene 3 & 4) ── */}
        <div className="pixel-countdown-wrapper" ref={pixelWrapperRef}>
          <div className="pixel-countdown-card">
            {/* Top Bar */}
            <div className="countdown-header-bar">
              <div className="countdown-header-left">
                <span className="live-beacon" />
                <span>Festival Countdown · Braga 2026</span>
              </div>
              <div className="countdown-header-right">
                <span>27–28 November 2026 · Bandung</span>
              </div>
            </div>

            {/* 4 Matrix Columns */}
            <div className="matrix-stats-grid">
              {matrixSpecs.map((spec) => (
                <div
                  key={spec.key}
                  className={`matrix-stat-cell ${spec.className}`}
                  data-metric={spec.key}
                >
                  <div className="matrix-label-row">
                    <div className="matrix-icon-box">{spec.icon}</div>
                    <span className="matrix-stat-title">{spec.title}</span>
                  </div>

                  <div className="matrix-word">
                    {Array.from({ length: spec.charCount }).map((_, charIdx) => {
                      const cols = 5;
                      const rows = 7;
                      return (
                        <div
                          key={charIdx}
                          className="matrix-char"
                        >
                          {Array.from({ length: rows }).map((__, r) =>
                            Array.from({ length: cols }).map((___, c) => (
                              <span
                                key={`${r}-${c}`}
                                className="pixel-dot"
                                data-r={r}
                                data-c={c}
                              />
                            ))
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Card Footer Bar */}
            <div className="countdown-footer-bar">
              <div className="countdown-footer-left">
                <span>Braga City Walk &amp; Koridor Jalan Braga</span>
                <span>•</span>
                <span>Malam Penganugerahan SIINAS</span>
              </div>
              <div className="countdown-footer-right">
                <span>Disdagin Kota Bandung</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ambient Horizon Glow (Harmonizes with Moon Transition) */}
        <div className="countdown-bottom-horizon-glow" aria-hidden="true" />
      </div>
    </div>
  );
}
