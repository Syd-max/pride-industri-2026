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

  const { time, state } = data;

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
        
        {/* 1. Diagonal Blue Alligator Straps */}
        <div className="watch-strap-top" aria-hidden="true" />
        <div className="watch-strap-bottom" aria-hidden="true" />

        {/* 2. Stainless Steel Watch Case */}
        <div className="watch-case">
          
          {/* Lugs & Screws */}
          <div className="watch-lug lug-tl" />
          <div className="watch-lug lug-tr" />
          <div className="watch-lug lug-bl" />
          <div className="watch-lug lug-br" />

          {/* Crown at 2 o'clock with Sapphire Gem */}
          <div className="watch-crown" />

          {/* Stepped Bezel & Enamel Dial Container */}
          <div className="watch-dial-bezel">
            
            {/* 3. Artistic Enamel Dial Painting (Swirling Koi & Creative Wave Art) */}
            <div className="watch-art-dial">
              <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                <defs>
                  {/* Swirling Water Radial Gradient */}
                  <radialGradient id="waterFlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#0284c7" stopOpacity="0.95" />
                    <stop offset="75%" stopColor="#0369a1" stopOpacity="1" />
                    <stop offset="100%" stopColor="#082f49" stopOpacity="1" />
                  </radialGradient>

                  {/* Red Koi Fish Gradient */}
                  <linearGradient id="koiRed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="25%" stopColor="#f43f5e" />
                    <stop offset="65%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#be123c" />
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
                <path d="M 200 40 A 160 160 0 0 1 360 200 A 120 120 0 0 1 200 320 A 80 80 0 0 1 120 200 A 40 40 0 0 1 200 160" fill="none" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
                <path d="M 170 60 A 140 140 0 0 1 340 200 A 100 100 0 0 1 200 300 A 60 60 0 0 1 140 200" fill="none" stroke="#7dd3fc" strokeWidth="2.5" strokeDasharray="6 8" opacity="0.5" />
                <path d="M 230 350 A 150 150 0 0 1 50 200 A 110 110 0 0 1 200 90 A 70 70 0 0 1 270 200" fill="none" stroke="#e0f2fe" strokeWidth="3" opacity="0.4" />

                {/* Lotus Lily Pads (Emerald Leaves) */}
                <ellipse cx="90" cy="110" rx="42" ry="24" fill="#047857" opacity="0.8" transform="rotate(-25 90 110)" />
                <ellipse cx="320" cy="110" rx="38" ry="22" fill="#065f46" opacity="0.8" transform="rotate(35 320 110)" />
                <ellipse cx="80" cy="290" rx="44" ry="25" fill="#047857" opacity="0.8" transform="rotate(30 80 290)" />
                <ellipse cx="310" cy="300" rx="46" ry="26" fill="#065f46" opacity="0.8" transform="rotate(-30 310 300)" />

                {/* Artistic Koi Fish 1 (Circling Right) */}
                <path
                  d="M 220 80 C 310 100 330 190 280 260 C 265 240 275 190 230 140 C 215 125 195 105 220 80 Z"
                  fill="url(#koiRed)"
                  opacity="0.88"
                />
                {/* Koi 1 Fins & Tail */}
                <path d="M 280 260 Q 310 290 290 320 Q 265 285 270 265 Z" fill="#fda4af" opacity="0.8" />
                <circle cx="215" cy="95" r="3.5" fill="#ffffff" />
                <circle cx="215" cy="95" r="1.8" fill="#0f172a" />

                {/* Artistic Koi Fish 2 (Circling Left) */}
                <path
                  d="M 180 320 C 90 300 70 210 120 140 C 135 160 125 210 170 260 C 185 275 205 295 180 320 Z"
                  fill="url(#koiRed)"
                  opacity="0.88"
                />
                {/* Koi 2 Fins & Tail */}
                <path d="M 120 140 Q 90 110 110 80 Q 135 115 130 135 Z" fill="#fda4af" opacity="0.8" />
                <circle cx="185" cy="305" r="3.5" fill="#ffffff" />
                <circle cx="185" cy="305" r="1.8" fill="#0f172a" />

                {/* Blooming Lotus Flowers */}
                <circle cx="95" cy="115" r="11" fill="url(#goldLotus)" opacity="0.9" />
                <circle cx="315" cy="295" r="12" fill="url(#goldLotus)" opacity="0.9" />
                <circle cx="315" cy="115" r="9" fill="#f43f5e" opacity="0.85" />
                <circle cx="85" cy="285" r="10" fill="#e11d48" opacity="0.85" />

                {/* Perimeter Hour Markers (12 Swiss Pips) */}
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

            {/* 4. Integrated Haute Horlogerie Chronometer Registers */}
            <div className="watch-chronometer-core">
              
              {/* Brand Letterpress */}
              <div className="watch-dial-brand">
                <div className="watch-brand-name">PRIDE INDUSTRI 2026</div>
                <div className="watch-brand-sub">CHRONOMETRE OFFICIEL</div>
              </div>

              {/* 4 Complication Registers: HARI, JAM, MENIT, DETIK */}
              <div className="watch-registers-grid">
                
                {/* 1. HARI */}
                <div className="watch-register-pod pod-rose">
                  <span className="register-val">{String(time.days).padStart(2, '0')}</span>
                  <span className="register-lbl text-rose-400">HARI</span>
                </div>

                {/* 2. JAM */}
                <div className="watch-register-pod pod-amber">
                  <span className="register-val">{String(time.hours).padStart(2, '0')}</span>
                  <span className="register-lbl text-amber-400">JAM</span>
                </div>

                {/* 3. MENIT */}
                <div className="watch-register-pod pod-blue">
                  <span className="register-val">{String(time.minutes).padStart(2, '0')}</span>
                  <span className="register-lbl text-sky-400">MENIT</span>
                </div>

                {/* 4. DETIK (Live Ticking Cadence) */}
                <div className="watch-register-pod pod-green pod-seconds-live">
                  <span className="register-val text-emerald-400">{String(time.seconds).padStart(2, '0')}</span>
                  <span className="register-lbl text-emerald-400">DETIK</span>
                </div>
              </div>

              {/* Dial Bottom Location */}
              <div className="watch-dial-venue">
                27–28 NOV · BRAGA BANDUNG
              </div>
            </div>

            {/* 5. Real Rotating Watch Hands */}
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

            {/* 6. Sapphire Crystal Glass Glare */}
            <div className="watch-crystal-glare" aria-hidden="true" />

          </div>
        </div>
      </div>
    </div>
  );
}
