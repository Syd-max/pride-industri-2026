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

interface RunwayPedestalProps {
  value: number;
  label: string;
  subLabel: string;
  delayIndex: number;
  accentColor: string;
  textColor: string;
  badgeBg: string;
  icon: React.ReactNode;
  isSeconds?: boolean;
}

function RunwayPedestal({
  value,
  label,
  subLabel,
  delayIndex,
  accentColor,
  textColor,
  badgeBg,
  icon,
  isSeconds,
}: RunwayPedestalProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Elevated Glass Podium */}
      <div
        className={`runway-podium-card podium-delay-${delayIndex} ${
          isSeconds ? 'podium-seconds-active' : ''
        }`}
        style={{ color: accentColor }}
      >
        {/* Top Metallic Accent Rim Bar */}
        <div className="podium-top-rim" />

        {/* Podium Top Header: Apple Monoline Badge */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-sm"
            style={{ backgroundColor: badgeBg, borderColor: `${accentColor}40`, color: textColor }}
          >
            {icon}
            <span>{label}</span>
          </div>
          <span
            className="w-1.5 h-1.5 rounded-full transition-transform duration-300"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />
        </div>

        {/* Big Editorial Numbers with Specular Drop Glow */}
        <div className="relative z-10 my-auto text-center">
          <div className="podium-number-display">
            {String(value).padStart(2, '0')}
          </div>
          {/* Subtle runway track floor line */}
          <div
            className="w-14 h-[2px] mx-auto mt-2 rounded-full opacity-60"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            }}
          />
        </div>

        {/* Podium Bottom Stage Sub-Label */}
        <div className="relative z-10 text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {subLabel}
          </span>
        </div>

        {/* Desktop Mirror Floor Reflection (Lacquer Runway Finish) */}
        <div className="podium-mirror-reflection">
          <div className="podium-number-display opacity-40">
            {String(value).padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Countdown() {
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

  if (!mounted) {
    return (
      <div className="podiums-runway-grid opacity-30 py-6">
        <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
        <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
        <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
        <div className="w-36 h-48 sm:w-44 sm:h-56 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />
      </div>
    );
  }

  if (state === 'ended') {
    return (
      <div className="text-center py-8 px-6 bg-slate-900/90 rounded-3xl border border-slate-800 max-w-xl mx-auto backdrop-blur-xl">
        <p className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
          PRIDE Industri 2026 Telah Selesai Diselenggarakan
        </p>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          Terima kasih atas partisipasi seluruh insan kreatif, desainer binaan, dan wargi Kota Bandung.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Live Stage Alert Beacon if currently ongoing */}
      {state === 'live' && (
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md animate-pulse">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span>Festival &amp; Panggung Eksistensi Sedang Berlangsung Hari Ini di Braga!</span>
        </div>
      )}

      {/* The 4 Catwalk Podiums on Runway Floor */}
      <div className="podiums-runway-grid">
        <RunwayPedestal
          value={time.days}
          label="Hari"
          subLabel="27–28 Nov"
          delayIndex={0}
          accentColor="#e51937"
          textColor="#fda4af"
          badgeBg="rgba(229, 25, 55, 0.15)"
          icon={
            <svg className="w-3 h-3 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
          }
        />

        <RunwayPedestal
          value={time.hours}
          label="Jam"
          subLabel="WIB / GMT+7"
          delayIndex={1}
          accentColor="#ffb800"
          textColor="#fde047"
          badgeBg="rgba(255, 184, 0, 0.15)"
          icon={
            <svg className="w-3 h-3 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />

        <RunwayPedestal
          value={time.minutes}
          label="Menit"
          subLabel="Presisi Waktu"
          delayIndex={2}
          accentColor="#1652f0"
          textColor="#93c5fd"
          badgeBg="rgba(22, 82, 240, 0.15)"
          icon={
            <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          }
        />

        <RunwayPedestal
          value={time.seconds}
          label="Detik"
          subLabel="Live Ticking"
          delayIndex={3}
          accentColor="#009e49"
          textColor="#86efac"
          badgeBg="rgba(0, 158, 73, 0.15)"
          isSeconds
          icon={
            <svg className="w-3 h-3 text-emerald-400 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          }
        />
      </div>

      {/* Stage Status Callout */}
      {state === 'upcoming' && (
        <div className="text-center pt-2">
          <p className="text-xs sm:text-sm font-medium text-slate-300">
            Panggung Utama &amp; Eksistensi dibuka resmi pada{' '}
            <strong className="text-amber-400 font-bold">
              Jum&apos;at, 27 November 2026 · 13:30 WIB
            </strong>
          </p>
        </div>
      )}
    </div>
  );
}
