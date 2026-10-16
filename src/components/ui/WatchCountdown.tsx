'use client';

import { useEffect, useState, useCallback } from 'react';
import { EVENT_CONFIG } from '@/config/event';
import type { CountdownTime, EventState } from '@/types';

function getCountdown(): { time: CountdownTime; state: EventState } {
  const now = new Date();
  const start = EVENT_CONFIG.startDate;
  const end = EVENT_CONFIG.endDate;

  if (now >= end) {
    return { time: { days: 0, hours: 0, minutes: 0, seconds: 0 }, state: 'ended' };
  }

  if (now >= start) {
    const diff = end.getTime() - now.getTime();
    return {
      state: 'live',
      time: {
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      },
    };
  }

  const diff = start.getTime() - now.getTime();
  return {
    state: 'upcoming',
    time: {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
    },
  };
}

export default function WatchCountdown() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{ time: CountdownTime; state: EventState }>({
    time: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    state: 'upcoming',
  });
  const [cumulativeTick, setCumulativeTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const initial = getCountdown();
    setData(initial);
    // Align starting tick clockwise so it advances forward to the right (searah jarum jam)
    const startSec = (60 - (initial.time.seconds % 60)) % 60;
    setCumulativeTick(startSec);

    const interval = setInterval(() => {
      setData(getCountdown());
      setCumulativeTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { time } = data;

  // Real-time ticking watch hand angles (in degrees, strictly rotating clockwise / KEKANAN)
  // +40deg offset counterbalances the -40deg assembly tilt, aligning 0s to 12 o'clock top center
  const secondDeg = 40 + (cumulativeTick * 6);
  const minuteDeg = (time.minutes * 6) + (time.seconds * 0.1);
  const hourDeg = ((time.hours % 12) * 30) + (time.minutes * 0.5);

  if (!mounted) {
    return (
      <div className="watch-tilt-wrapper py-6 opacity-30">
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-slate-900 border-4 border-slate-700 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="watch-tilt-wrapper">
      <div className="watch-timepiece-assembly" role="region" aria-label="Jam Hitung Mundur PRIDE Industri 2026">
        
        {/* 1. Diagonal Alligator Straps (Top-Left to Bottom-Right) */}
        <div className="watch-strap-top" aria-hidden="true" />
        <div className="watch-strap-bottom" aria-hidden="true">
          <div className="strap-keeper" />
        </div>

        {/* 2. Stainless Steel Watch Case */}
        <div className="watch-case">
          
          {/* Solid Machined Cylindrical Lug Bars (Haute Horlogerie Engineering - No floating spheres) */}
          <div className="watch-lug-bar lug-bar-top" />
          <div className="watch-lug-bar lug-bar-bottom" />

          {/* Fluted Stainless Steel Crown with Sapphire Cabochon at ~2 o'clock */}
          <div className="watch-crown" />

          {/* Stepped Bezel & Enamel Dial Container */}
          <div className="watch-dial-bezel">
            
            {/* 3. Swiss Haute Horlogerie Sunburst & Azurage Lathe-Turned Dial */}
            <div className="watch-art-dial">
              <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                <defs>
                  {/* Deep Midnight Obsidian Radial Gradient */}
                  <radialGradient id="dialSunburst" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.85" />
                    <stop offset="45%" stopColor="#0f172a" stopOpacity="0.95" />
                    <stop offset="85%" stopColor="#090d16" stopOpacity="1" />
                    <stop offset="100%" stopColor="#03050a" stopOpacity="1" />
                  </radialGradient>

                  {/* Outer Bezel Inset Shadow */}
                  <radialGradient id="bezelShadow" cx="50%" cy="50%" r="50%">
                    <stop offset="88%" stopColor="#000000" stopOpacity="0" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
                  </radialGradient>
                </defs>

                {/* Base Sunburst Midnight Face */}
                <circle cx="200" cy="200" r="200" fill="url(#dialSunburst)" />

                {/* Precision Concentric Azurage Grooves (Lathe-Turned Horology Rings) */}
                <circle cx="200" cy="200" r="192" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
                <circle cx="200" cy="200" r="185" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <circle cx="200" cy="200" r="172" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />

                {/* 60 Precision Chapter Ring Hash Ticks */}
                {Array.from({ length: 60 }).map((_, i) => {
                  const deg = i * 6;
                  const isMajor = deg % 30 === 0;
                  const isQuarter = deg % 90 === 0;
                  const rad = (deg * Math.PI) / 180;
                  const r1 = isQuarter ? 176 : isMajor ? 179 : 182;
                  const r2 = 186;
                  const x1 = 200 + r1 * Math.sin(rad);
                  const y1 = 200 - r1 * Math.cos(rad);
                  const x2 = 200 + r2 * Math.sin(rad);
                  const y2 = 200 - r2 * Math.cos(rad);

                  return (
                    <line
                      key={deg}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isQuarter ? "#fef08a" : isMajor ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"}
                      strokeWidth={isQuarter ? "2" : isMajor ? "1.5" : "0.75"}
                      strokeLinecap="round"
                    />
                  );
                })}

                {/* 12 Applied Swiss Hour Markers (Subtle Platinum/Gold Pips) */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <circle
                    key={deg}
                    cx={200 + 168 * Math.sin((deg * Math.PI) / 180)}
                    cy={200 - 168 * Math.cos((deg * Math.PI) / 180)}
                    r={deg % 90 === 0 ? "3" : "2"}
                    fill={deg % 90 === 0 ? "#fbbf24" : "rgba(255,255,255,0.85)"}
                    stroke="rgba(0,0,0,0.5)"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Outer Inset Shadow for Depth */}
                <circle cx="200" cy="200" r="200" fill="url(#bezelShadow)" />
              </svg>
            </div>

            {/* 4. Orbital Sweeping Seconds Pip (Traversing outer chapter ring, ZERO overlap with numbers) */}
            <div
              className="watch-orbital-seconds-track"
              style={{ transform: `rotate(${secondDeg}deg)` }}
              aria-hidden="true"
            >
              <div className="watch-orbital-pip" />
            </div>

            {/* 5. Integrated Haute Horlogerie Chronometer Core (Counter-Rotated Upright!) */}
            <div className="watch-chronometer-core">
              
              {/* Brand Letterpress Header */}
              <div className="watch-dial-brand">
                <div className="watch-brand-name">PRIDE INDUSTRI 2026</div>
                <div className="watch-brand-sub">CHRONOMÈTRE OFFICIEL</div>
              </div>

              {/* 4 Apple-Style Complication Pods: HARI, JAM, MENIT, DETIK */}
              <div className="watch-registers-grid">
                
                {/* 1. HARI */}
                <div className="watch-register-pod pod-rose">
                  <span className="register-val">{String(time.days).padStart(2, '0')}</span>
                  <span className="register-lbl">HARI</span>
                </div>

                {/* 2. JAM */}
                <div className="watch-register-pod pod-amber">
                  <span className="register-val">{String(time.hours).padStart(2, '0')}</span>
                  <span className="register-lbl">JAM</span>
                </div>

                {/* 3. MENIT */}
                <div className="watch-register-pod pod-blue">
                  <span className="register-val">{String(time.minutes).padStart(2, '0')}</span>
                  <span className="register-lbl">MENIT</span>
                </div>

                {/* 4. DETIK (Live Real-Time Cadence) */}
                <div className="watch-register-pod pod-green pod-seconds-live">
                  <span className="register-val">{String(time.seconds).padStart(2, '0')}</span>
                  <span className="register-lbl">DETIK</span>
                </div>

                {/* Center Luxury Horology Jewel Pivot (Seated in the crossroad gap, never overlaps numbers) */}
                <div className="watch-center-pivot" aria-hidden="true" />
              </div>

              {/* Dial Bottom Location */}
              <div className="watch-dial-venue">
                27–28 NOV · BRAGA BANDUNG
              </div>
            </div>

            {/* 6. Sapphire Crystal Glass Glare */}
            <div className="watch-crystal-glare" aria-hidden="true" />

          </div>
        </div>
      </div>
    </div>
  );
}
