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

  const tick = useCallback(() => {
    setData(getCountdown());
  }, []);

  useEffect(() => {
    setMounted(true);
    setData(getCountdown());
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const { time } = data;

  // Real-time ticking watch hand angles (in degrees)
  const secondDeg = time.seconds * 6;
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
            
            {/* 3. Artistic Enamel Dial Painting (Swirling Koi & Aquatic Ripples) */}
            <div className="watch-art-dial">
              <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                <defs>
                  {/* Swirling Water Radial Gradient */}
                  <radialGradient id="waterFlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                    <stop offset="35%" stopColor="#0284c7" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#0369a1" stopOpacity="1" />
                    <stop offset="100%" stopColor="#082f49" stopOpacity="1" />
                  </radialGradient>

                  {/* Red/White Koi Fish Gradient */}
                  <linearGradient id="koiRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="25%" stopColor="#f43f5e" />
                    <stop offset="65%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#9f1239" />
                  </linearGradient>

                  {/* Golden Lotus Gradient */}
                  <linearGradient id="goldLotus" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                </defs>

                {/* Swirling Aquatic Background */}
                <circle cx="200" cy="200" r="200" fill="url(#waterFlow)" />

                {/* Water Swirl Current Lines */}
                <path d="M 200 35 A 165 165 0 0 1 365 200 A 125 125 0 0 1 200 325 A 85 85 0 0 1 115 200 A 45 45 0 0 1 200 155" fill="none" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                <path d="M 170 55 A 145 145 0 0 1 345 200 A 105 105 0 0 1 200 305 A 65 65 0 0 1 135 200" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="6 8" opacity="0.45" />
                <path d="M 235 355 A 155 155 0 0 1 45 200 A 115 115 0 0 1 200 85 A 75 75 0 0 1 275 200" fill="none" stroke="#e0f2fe" strokeWidth="3" opacity="0.35" />

                {/* Lotus Lily Pads (Emerald Leaves) */}
                <ellipse cx="85" cy="105" rx="38" ry="22" fill="#047857" opacity="0.8" transform="rotate(-25 85 105)" />
                <ellipse cx="325" cy="105" rx="36" ry="20" fill="#065f46" opacity="0.8" transform="rotate(35 325 105)" />
                <ellipse cx="75" cy="295" rx="40" ry="23" fill="#047857" opacity="0.8" transform="rotate(30 75 295)" />
                <ellipse cx="315" cy="305" rx="42" ry="24" fill="#065f46" opacity="0.8" transform="rotate(-30 315 305)" />

                {/* Artistic Koi Fish 1 (Circling Right) */}
                <path
                  d="M 220 75 C 315 95 335 190 285 260 C 268 238 278 188 232 138 C 216 122 195 102 220 75 Z"
                  fill="url(#koiRed)"
                  opacity="0.9"
                />
                <path d="M 285 260 Q 315 290 295 322 Q 270 286 275 265 Z" fill="#fda4af" opacity="0.8" />
                <circle cx="215" cy="90" r="3.5" fill="#ffffff" />
                <circle cx="215" cy="90" r="1.8" fill="#0f172a" />

                {/* Artistic Koi Fish 2 (Circling Left) */}
                <path
                  d="M 180 325 C 85 305 65 210 115 140 C 132 162 122 212 168 262 C 184 278 205 298 180 325 Z"
                  fill="url(#koiRed)"
                  opacity="0.9"
                />
                <path d="M 115 140 Q 85 110 105 78 Q 130 114 125 135 Z" fill="#fda4af" opacity="0.8" />
                <circle cx="185" cy="310" r="3.5" fill="#ffffff" />
                <circle cx="185" cy="310" r="1.8" fill="#0f172a" />

                {/* Blooming Lotus Flowers */}
                <circle cx="90" cy="110" r="11" fill="url(#goldLotus)" opacity="0.9" />
                <circle cx="320" cy="298" r="12" fill="url(#goldLotus)" opacity="0.9" />
                <circle cx="320" cy="110" r="9" fill="#f43f5e" opacity="0.85" />
                <circle cx="80" cy="290" r="10" fill="#e11d48" opacity="0.85" />

                {/* Perimeter Hour Markers (12 Swiss Applied Gold Pips) */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <circle
                    key={deg}
                    cx={200 + 185 * Math.sin((deg * Math.PI) / 180)}
                    cy={200 - 185 * Math.cos((deg * Math.PI) / 180)}
                    r={deg % 90 === 0 ? "4" : "2.5"}
                    fill="#fef08a"
                    stroke="#b45309"
                    strokeWidth="1"
                    opacity="0.85"
                  />
                ))}
              </svg>
            </div>

            {/* 4. Integrated Haute Horlogerie Chronometer Core (Counter-Rotated Upright!) */}
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
              </div>

              {/* Dial Bottom Location */}
              <div className="watch-dial-venue">
                27–28 NOV · BRAGA BANDUNG
              </div>

              {/* 5. Precision Rotating Watch Hands (Integrated with Upright Dial) */}
              <div className="watch-hands-center" aria-hidden="true">
                {/* Hour Hand */}
                <div
                  className="watch-hand hand-hour"
                  style={{ transform: `rotate(${hourDeg}deg)` }}
                />
                {/* Minute Hand */}
                <div
                  className="watch-hand hand-minute"
                  style={{ transform: `rotate(${minuteDeg}deg)` }}
                />
                {/* Sweeping Seconds Hand */}
                <div
                  className="watch-hand hand-second"
                  style={{ transform: `rotate(${secondDeg}deg)` }}
                />
                {/* Center Pivot Jewel */}
                <div className="watch-center-pivot" />
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
